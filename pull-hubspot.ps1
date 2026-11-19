# Reads an Onboarding Health Score export and writes HubSpot answers for
# on-time activation, open Sev1, open Sev2, and NPS.
# The token is read from HUBSPOT_TOKEN or %USERPROFILE%\.hubspot-onboarding-token.
# It is never written into the answers file.

param(
  [string]$ExportPath,
  [string]$OutPath,
  [string[]]$Names
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

function Read-Token {
  if ($env:HUBSPOT_TOKEN) { return $env:HUBSPOT_TOKEN.Trim() }
  $path = Join-Path $env:USERPROFILE ".hubspot-onboarding-token"
  if (Test-Path $path) { return (Get-Content -Raw -Path $path).Trim() }
  throw "Set HUBSPOT_TOKEN, or save the private app token in $path"
}

function Fold-Name([string]$value) {
  if (-not $value) { return "" }
  $text = $value.ToLower()
  $text = $text -replace '^sample\s+[—–-]\s+', ''
  $text = $text -replace '\bfulfilment\b', 'fulfillment'
  $text = $text -replace '&', ' and '
  $text = $text -replace '[^a-z0-9]+', ' '
  return ($text -replace '\s+', ' ').Trim()
}

function Test-NamesMatch([string]$customer, [string]$listed) {
  $left = Fold-Name $customer
  $right = Fold-Name $listed
  if (-not $left -or -not $right -or $left.Length -lt 3 -or $right.Length -lt 3) { return $false }
  if ($left -eq $right) { return $true }
  $shorter = $left
  $longer = $right
  if ($right.Length -lt $left.Length) { $shorter = $right; $longer = $left }
  if ($shorter.Length -ge 8 -and $longer.Contains($shorter)) { return $true }
  if ($longer.StartsWith("$shorter ")) { return $true }
  $shared = 0
  while ($shared -lt $left.Length -and $shared -lt $right.Length -and $left[$shared] -eq $right[$shared]) { $shared++ }
  $restLeft = $left.Substring($shared)
  $restRight = $right.Substring($shared)
  return $shared -ge 12 -and $restLeft.Length -le 4 -and $restRight.Length -le 4 -and ($restLeft + $restRight) -match '^[a-z]*$'
}

function Invoke-HubSpot([string]$Method, [string]$Uri, $Body) {
  $headers = @{ Authorization = "Bearer $script:Token" }
  if ($Body) {
    $json = $Body | ConvertTo-Json -Depth 8 -Compress
    return Invoke-RestMethod -Method $Method -Headers $headers -ContentType "application/json; charset=utf-8" -Uri $Uri -Body $json
  }
  return Invoke-RestMethod -Method $Method -Headers $headers -Uri $Uri
}

function Get-Associations([string]$companyId, [string]$type) {
  $ids = New-Object System.Collections.Generic.List[string]
  $after = $null
  do {
    $uri = "https://api.hubapi.com/crm/v4/objects/companies/$companyId/associations/${type}?limit=100"
    if ($after) { $uri += "&after=$([uri]::EscapeDataString($after))" }
    $page = Invoke-HubSpot GET $uri
    foreach ($row in @($page.results)) {
      if ($row.toObjectId) { [void]$ids.Add([string]$row.toObjectId) }
    }
    $after = $null
    if ($page.paging -and $page.paging.next) { $after = [string]$page.paging.next.after }
  } while ($after)
  return $ids
}

function Read-Objects([string]$type, $ids, [string[]]$properties) {
  $found = New-Object System.Collections.Generic.List[object]
  for ($offset = 0; $offset -lt $ids.Count; $offset += 100) {
    $end = [Math]::Min($offset + 99, $ids.Count - 1)
    $inputs = New-Object System.Collections.Generic.List[object]
    foreach ($id in @($ids[$offset..$end])) { [void]$inputs.Add(@{ id = [string]$id }) }
    $page = Invoke-HubSpot POST "https://api.hubapi.com/crm/v3/objects/$type/batch/read" @{ properties = $properties; inputs = $inputs }
    foreach ($row in @($page.results)) { [void]$found.Add($row) }
  }
  return $found
}

function Find-Company([string]$name, [string]$existingId) {
  if ($existingId) {
    try {
      $direct = Invoke-HubSpot GET "https://api.hubapi.com/crm/v3/objects/companies/${existingId}?properties=name"
      return @{ id = [string]$direct.id; name = [string]$direct.properties.name }
    } catch {
      # The saved id is no longer readable. Search by name.
    }
  }
  $tokens = @(Fold-Name $name -split ' ' | Where-Object { $_.Length -ge 3 } | Select-Object -First 4)
  if (-not $tokens.Count) { return $null }
  $attempt = @($tokens)
  while ($attempt.Count -ge 1) {
    $filters = New-Object System.Collections.Generic.List[object]
    foreach ($token in $attempt) {
      [void]$filters.Add(@{ propertyName = "name"; operator = "CONTAINS_TOKEN"; value = $token })
    }
    $search = Invoke-HubSpot POST "https://api.hubapi.com/crm/v3/objects/companies/search" @{
      filterGroups = @(@{ filters = $filters })
      properties = @("name")
      limit = 20
    }
    $hits = @($search.results | Where-Object { Test-NamesMatch $name $_.properties.name })
    if ($hits.Count -eq 1) {
      return @{ id = [string]$hits[0].id; name = [string]$hits[0].properties.name }
    }
    if ($hits.Count -gt 1) {
      $best = $null
      $bestCount = -1
      foreach ($hit in $hits) {
        $count = @(Get-Associations $hit.id "tickets").Count
        $exact = (Fold-Name $name) -eq (Fold-Name $hit.properties.name)
        $rank = $count * 10 + $(if ($exact) { 1 } else { 0 })
        if ($rank -gt $bestCount) {
          $bestCount = $rank
          $best = $hit
        }
      }
      return @{ id = [string]$best.id; name = [string]$best.properties.name }
    }
    if ($attempt.Count -eq 1) { break }
    $attempt = @($attempt[0..($attempt.Count - 2)])
  }
  return $null
}

function Get-Weeks($deals, $tickets) {
  $desired = @($deals | Where-Object { $_.properties.go_live_date })
  if (-not $desired.Count) { return $null }
  $preferred = @($desired | Where-Object { $_.properties.dealname -match 'New Deal' } | Sort-Object { $_.properties.go_live_date } -Descending)
  $deal = if ($preferred.Count) { $preferred[0] } else { @($desired | Sort-Object { $_.properties.go_live_date } -Descending)[0] }
  $activated = @($tickets | Where-Object { $_.properties.in_support_date })
  if (-not $activated.Count) { return $null }
  $named = @($activated | Where-Object { $_.properties.subject -match 'New Deal' } | Sort-Object { $_.properties.in_support_date })
  $ticket = if ($named.Count) { $named[0] } else { @($activated | Sort-Object { $_.properties.in_support_date })[0] }
  $start = [datetime]::Parse($deal.properties.go_live_date)
  $finish = [datetime]::Parse($ticket.properties.in_support_date)
  $days = ($finish - $start).TotalDays
  if ($days -lt 0) { $days = 0 }
  $weeks = [math]::Round($days / 7, 1)
  return @{
    raw = $(if ($weeks -eq [math]::Truncate($weeks)) { [string][int]$weeks } else { [string]$weeks })
    note = "Desired go-live $($deal.properties.go_live_date.Substring(0, 10)), activated $($ticket.properties.in_support_date.Substring(0, 10))."
  }
}

function Get-LatestNps($contacts) {
  $rated = @($contacts | Where-Object { $_.properties.hs_feedback_last_nps_rating_number })
  if (-not $rated.Count) { return $null }
  $latest = @($rated | Sort-Object { $_.properties.hs_feedback_last_survey_date } -Descending)[0]
  $when = [string]$latest.properties.hs_feedback_last_survey_date
  $day = if ($when.Length -ge 10) { $when.Substring(0, 10) } else { "" }
  $note = "Latest NPS survey rating on a HubSpot contact"
  if ($day) { $note += " ($day)" }
  return @{ raw = [string]$latest.properties.hs_feedback_last_nps_rating_number; note = "$note." }
}

function Convert-Answers($company) {
  $ticketIds = @(Get-Associations $company.id "tickets")
  $dealIds = @(Get-Associations $company.id "deals")
  $contactIds = @(Get-Associations $company.id "contacts")
  $tickets = @()
  $deals = @()
  $contacts = @()
  if ($ticketIds.Count) {
    $tickets = @(Read-Objects "tickets" $ticketIds @("subject", "severity", "closed_date", "in_support_date"))
  }
  if ($dealIds.Count) {
    $deals = @(Read-Objects "deals" $dealIds @("dealname", "go_live_date"))
  }
  if ($contactIds.Count) {
    $contacts = @(Read-Objects "contacts" $contactIds @("hs_feedback_last_nps_rating_number", "hs_feedback_last_survey_date"))
  }
  $open = @($tickets | Where-Object { -not $_.properties.closed_date })
  $sev1 = @($open | Where-Object { $_.properties.severity -eq "Sev1" }).Count
  $sev2 = @($open | Where-Object { $_.properties.severity -eq "Sev2" }).Count
  $sticky = @{
    sev1 = @{ raw = [string]$sev1; note = "Open Sev1 tickets on the HubSpot company." }
    sev2 = @{ raw = [string]$sev2; note = "Open Sev2 tickets on the HubSpot company." }
  }
  $nps = Get-LatestNps $contacts
  if ($nps) { $sticky.nps = $nps }
  else { $sticky.nps = @{ na = $true; note = "No NPS survey on the HubSpot contacts for this company." } }
  $answers = @{ sticky = $sticky }
  $weeks = Get-Weeks $deals $tickets
  if ($weeks) { $answers.activation = @{ ontime = $weeks } }
  return $answers
}

$script:Token = Read-Token
if ($ExportPath) {
  $export = Get-Content -Raw -Path $ExportPath | ConvertFrom-Json
  if ($export.customers) { $customers = @($export.customers) }
  elseif ($export.name) { $customers = @($export) }
  else { throw "That file is not an onboarding health export." }
} elseif ($Names) {
  $customers = @($Names | ForEach-Object { [pscustomobject]@{ name = $_ } })
} else {
  throw "Pass -ExportPath or -Names."
}

$rows = New-Object System.Collections.Generic.List[object]
foreach ($customer in $customers) {
  $name = [string]$customer.name
  $existing = [string]$customer.hubspotCompanyId
  Write-Output "Looking up $name"
  $row = @{ id = [string]$customer.id; name = $name; matched = $false }
  try {
    $company = Find-Company $name $existing
    if ($company) {
      $row.matched = $true
      $row.companyId = $company.id
      $row.companyName = $company.name
      $row.answers = Convert-Answers $company
      Write-Output "  matched $($company.name)"
    } else {
      Write-Output "  not found"
    }
  } catch {
    $row.error = $_.Exception.Message
    Write-Output "  failed: $($_.Exception.Message)"
  }
  [void]$rows.Add($row)
}

$updatedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$customerJson = @($rows | ForEach-Object { $_ | ConvertTo-Json -Depth 8 -Compress }) -join ","
$json = "{`"kind`":`"hubspot-answers`",`"updatedAt`":`"$updatedAt`",`"customers`":[$customerJson]}"
if (-not $OutPath) {
  $folder = if ($ExportPath) { Split-Path -Parent $ExportPath } else { (Get-Location).Path }
  $OutPath = Join-Path $folder "hubspot-answers.json"
}
[System.IO.File]::WriteAllText($OutPath, $json)
Write-Output "Wrote $OutPath"
