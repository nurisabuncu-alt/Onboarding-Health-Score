const KEY = "onboarding-health-score-v1";

const BANDS = {
  high: {
    label: "High risk",
    text: "Immediate red flag. A detailed discussion with the customer is needed to address the identified issues before proceeding. A revised project plan with a preliminary remediation phase may be necessary."
  },
  medium: {
    label: "Medium risk",
    text: "Potential for challenges. These areas should be noted and proactively managed throughout the implementation. Additional training or resources may be required."
  },
  low: {
    label: "Low risk",
    text: "The customer is well-prepared for a successful WMS implementation."
  }
};

const payment = {
  anchors: [
    [1, "Delayed invoice payments or partial payments. High level of follow-up."],
    [3, "Some delays in payments requiring small follow-ups."],
    [5, "Payments done on time."]
  ]
};

const ownership = {
  method: "Clarity of ownership for data setup, process alignment, project sponsor, integration development, and training.",
  anchors: [
    [1, "Lack of clarity in most roles, or one person owns everything."],
    [3, "Clarity in some of the key roles."],
    [5, "Most or all roles have clear names assigned."]
  ]
};

const integration = {
  method: "The template source is still marked in progress. Until it is connected, enter the phase integration-health score.",
  source: "Integration health source",
  optional: true,
  helper: "integration",
  helperLabel: "Health score, 0–100",
  anchors: [
    [1, "Between 0 and 60."],
    [3, "Between 61 and 80."],
    [5, "80 and above."]
  ]
};

const PHASES = [
  {
    id: "early",
    name: "Early Churn",
    scoreName: "Early Churn Detection Score",
    purpose: "Decide whether implementation should proceed as planned.",
    metrics: [
      { id: "stakeholder", category: "Communication & Engagement", name: "Stakeholder engagement", weight: 0.05, source: "Manual", method: "Attendance and active participation of the warehouse manager, IT lead, and executive sponsor in discovery meetings.", anchors: [[1, "Key stakeholders frequently absent or disengaged."], [3, "Inconsistent attendance and participation."], [5, "All key stakeholders consistently attend and actively contribute."]] },
      { id: "expectations", category: "Communication & Engagement", name: "Clarity of expectations", weight: 0.1, source: "Kickoff / SOW", method: "Detail and clarity of stated requirements, pain points, and desired outcomes.", anchors: [[1, "Vague, unrealistic, or constantly changing expectations."], [3, "Some clarity, but with significant gaps."], [5, "Clear, specific, and well-documented expectations."]] },
      { id: "ownership", category: "Communication & Engagement", name: "Project ownership", weight: 0.1, source: "Kickoff", ...ownership },
      { id: "timeline", category: "Operational timelines & maturity", name: "Timeline realism", weight: 0.15, source: "Kickoff + plan", method: "Compare the desired timeline with the scope and benchmarks for similar implementations.", anchors: [[1, "Highly unrealistic timeline given the scope."], [3, "Ambitious but potentially achievable, with some risk."], [5, "Realistic and well-paced timeline."]] },
      { id: "change", category: "Operational timelines & maturity", name: "Change readiness", weight: 0.15, source: "Manual", method: "Attitude of warehouse staff, managers, IT, and the executive sponsor toward process change and new technology.", anchors: [[1, "High resistance to change."], [3, "Some apprehension, but willing to consider changes."], [5, "Enthusiastic about process improvement and new technology."]] },
      { id: "it", category: "Technical & integration readiness", name: "IT resources", weight: 0.15, source: "Manual", method: "Size, expertise, and availability of the internal or external IT team for implementation, integrations, and maintenance.", anchors: [[1, "No dedicated IT staff."], [3, "IT staff with limited WMS or integration experience."], [5, "Experienced and dedicated IT resources."]] },
      { id: "fit", category: "Solution compatibility", name: "Solution fit", weight: 0.2, source: "Manual", method: "Whether Logiwa fits the line of business, or can be configured or built to cover the majority of needs.", anchors: [[1, "The majority of use cases do not fit and will not be built."], [3, "A workaround can cover some of the solution."], [5, "Good fit."]] },
      { id: "payment", category: "Financial status", name: "Payment score", weight: 0.1, source: "Manual", method: "Delays in paying fees, or delinquency.", ...payment }
    ]
  },
  {
    id: "activation",
    name: "Activation",
    scoreName: "Activation Health Score",
    purpose: "Judge execution health through go-live.",
    metrics: [
      { id: "stakeholder", category: "Communication & Engagement", name: "Stakeholder engagement", weight: 0.05, source: "Manual", method: "Attendance and active participation of the warehouse manager, IT lead, and executive sponsor in meetings.", anchors: [[1, "Key stakeholders frequently absent or disengaged."], [3, "Inconsistent attendance and participation."], [5, "All key stakeholders consistently attend and actively contribute."]] },
      { id: "ownership", category: "Communication & Engagement", name: "Project ownership", weight: 0.05, source: "Manual", ...ownership },
      { id: "integration", category: "Technical & integration readiness", name: "Integration health", weight: 0.15, ...integration },
      { id: "payment", category: "Financial status", name: "Payment score", weight: 0.15, source: "Maxio", method: "Delays in paying fees, or delinquency.", ...payment },
      { id: "training", category: "Training participation", name: "Training delays", weight: 0.2, source: "Manual", helper: "training", helperLabel: "No-shows or reschedules", method: "How many training sessions or meetings had a no-show or were rescheduled?", anchors: [[1, "This happened more than 3 times."], [3, "This happened up to 3 times."], [5, "Everything was on time, with no no-show issues."]] },
      { id: "uat", category: "Quality and testing", name: "UAT readiness", weight: 0.2, source: "Manual", helper: "uat", helperLabel: "Test cases verified, %", method: "Is the customer actively testing the system, and how far has testing progressed?", anchors: [[1, "Any test case is verified."], [3, "Over 60% of test cases are verified."], [5, "Over 90% of test cases are verified."]] },
      { id: "adaption", category: "Governance and adaption", name: "Adaption", weight: 0.1, source: "Manual", method: "Learning curve of the project team.", anchors: [[1, "No capacity."], [3, "Moderate."], [5, "The project team is tech savvy and picks things up quickly."]] },
      { id: "ontime", category: "Target achievement", name: "On-time activation", weight: 0.1, source: "HubSpot tickets", helper: "weeks", helperLabel: "Weeks the go-live moved", method: "Did the customer activate as initially planned, or has go-live moved?", anchors: [[1, "Go-live moved more than 8 weeks."], [3, "Go-live moved more than 4 weeks."], [5, "Go-live moved by up to 2 weeks."]] }
    ]
  },
  {
    id: "sticky",
    name: "Pre-Sticky",
    scoreName: "Pre-Sticky Health Score",
    purpose: "Judge whether usage and support are holding after activation.",
    metrics: [
      { id: "ownership", category: "Communication & Engagement", name: "Project ownership", weight: 0.1, source: "Manual", ...ownership },
      { id: "integration", category: "Technical & integration readiness", name: "Integration health", weight: 0.15, ...integration },
      { id: "payment", category: "Financial status", name: "Payment score", weight: 0.1, source: "Maxio", method: "Delays in paying fees, or delinquency.", ...payment },
      { id: "volume", category: "Usage", name: "Shipment volume", weight: 0.2, source: "Kickoff baseline + customer account", helper: "volume", helperLabel: "Match to baseline, %", method: "Compare actual volume with the kickoff notes and contract details.", anchors: [[1, "Matches less than 50%."], [3, "Matches 50–80%."], [5, "Matches 80% or more."]] },
      { id: "sev2", category: "Customer support", name: "Open tickets (Sev2)", weight: 0.15, source: "HubSpot", helper: "sev2", helperLabel: "Sev2 tickets", method: "Number of Sev2 tickets.", anchors: [[1, "More than 10 Sev2 tickets."], [3, "Between 5 and 10 Sev2 tickets."], [5, "Up to 5 Sev2 tickets."]] },
      { id: "sev1", category: "Customer support", name: "Sev1 tickets", weight: 0.2, source: "HubSpot", helper: "sev1", helperLabel: "Sev1 tickets", method: "Number of Sev1 tickets.", anchors: [[1, "More than 2 Sev1 tickets."], [3, "Up to 2 Sev1 tickets."], [5, "No Sev1 tickets."]] },
      { id: "nps", category: "Customer satisfaction", name: "NPS rating", weight: 0.1, source: "HubSpot", optional: true, helper: "nps", helperLabel: "Survey rating, 0–10", method: "NPS rating via HubSpot. A missing survey can be marked not applicable.", anchors: [[1, "Rating 0–4."], [3, "Rating 5–7."], [5, "Rating 8 or above."]] }
    ]
  }
];

const ui = { q: "", risk: "all" };

function load() {
  let loaded;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && Array.isArray(saved.customers)) loaded = saved;
    }
  } catch (err) { /* replace an unreadable save with the sample book */ }
  if (!loaded) loaded = { customers: samples() };
  loaded.customers.forEach(normalizeCustomer);
  localStorage.setItem(KEY, JSON.stringify(loaded));
  return loaded;
}

const MARKETPLACES = [
  { group: "Marketplace", name: "Amazon FBM", aliases: ["amazon fbm","amazonfbm","fbm","fulfillment by merchant"] },
  { group: "Marketplace", name: "Amazon Seller Central", aliases: ["amazon seller central","amazonsellercentral","amazon seller","seller central","amazon"] },
  { group: "Marketplace", name: "Amazon SFP", aliases: ["amazon sfp","amazonsfp","sfp","seller fulfilled prime"] },
  { group: "Marketplace", name: "Bed, Bath and Beyond", aliases: ["bed, bath and beyond","bed bath and beyond","bedbathandbeyond"] },
  { group: "Marketplace", name: "BestBuy", aliases: ["bestbuy"] },
  { group: "Marketplace", name: "Ebay", aliases: ["ebay","e-bay"] },
  { group: "Marketplace", name: "Faire", aliases: ["faire"] },
  { group: "Marketplace", name: "Logicbroker", aliases: ["logicbroker"] },
  { group: "Marketplace", name: "Magento", aliases: ["magento"], note: "Not on the public site" },
  { group: "Marketplace", name: "Magento 2", aliases: ["magento 2","magento2"] },
  { group: "Marketplace", name: "Mirakl", aliases: ["mirakl"] },
  { group: "Marketplace", name: "Target Plus", aliases: ["target plus","targetplus"] },
  { group: "Marketplace", name: "Tik Tok Shop", aliases: ["tik tok shop","tiktokshop","tiktok","tik tok","tiktok shop"] },
  { group: "Marketplace", name: "Walmart DSV", aliases: ["walmart dsv","walmartdsv"] },
  { group: "Marketplace", name: "Walmart Marketplace", aliases: ["walmart marketplace","walmartmarketplace","walmart"] },
  { group: "Ecommerce", name: "Acenda", aliases: ["acenda"] },
  { group: "Ecommerce", name: "Amazon Vendor Central", aliases: ["amazon vendor central","amazonvendorcentral","vendor central","amazon vendor"] },
  { group: "Ecommerce", name: "BigCommerce", aliases: ["bigcommerce","big commerce"] },
  { group: "Ecommerce", name: "BJ’s Wholesale Club (Rithum)", aliases: ["bj’s wholesale club (rithum)","bj’s wholesale club","bj s wholesale club","bjswholesaleclub"] },
  { group: "Ecommerce", name: "Blastramp", aliases: ["blastramp"] },
  { group: "Ecommerce", name: "Brightpearl", aliases: ["brightpearl"] },
  { group: "Ecommerce", name: "Channel Advisor (Rithum)", aliases: ["channel advisor (rithum)","channel advisor","channeladvisor"] },
  { group: "Ecommerce", name: "Costco Wholesale (Rithum)", aliases: ["costco wholesale (rithum)","costco wholesale","costcowholesale"] },
  { group: "Ecommerce", name: "Etsy", aliases: ["etsy"] },
  { group: "Ecommerce", name: "Home Depot", aliases: ["home depot","homedepot"] },
  { group: "Ecommerce", name: "Hot Topic (Rithum)", aliases: ["hot topic (rithum)","hot topic","hottopic"] },
  { group: "Ecommerce", name: "JOOR", aliases: ["joor"] },
  { group: "Ecommerce", name: "Lowes", aliases: ["lowes"] },
  { group: "Ecommerce", name: "Macy’s (Rithum)", aliases: ["macy’s (rithum)","macy’s","macy s","macys"] },
  { group: "Ecommerce", name: "Nordstrom", aliases: ["nordstrom"] },
  { group: "Ecommerce", name: "OrderDesk", aliases: ["orderdesk"], note: "Not on the public site" },
  { group: "Ecommerce", name: "Overstock", aliases: ["overstock"] },
  { group: "Ecommerce", name: "QVC", aliases: ["qvc"] },
  { group: "Ecommerce", name: "Sears", aliases: ["sears"] },
  { group: "Ecommerce", name: "Shopify", aliases: ["shopify"] },
  { group: "Ecommerce", name: "Square", aliases: ["square"] },
  { group: "Ecommerce", name: "Squarespace", aliases: ["squarespace"], note: "Not on the public site" },
  { group: "Ecommerce", name: "Target", aliases: ["target"] },
  { group: "Ecommerce", name: "TechOMS", aliases: ["techoms"], note: "Not on the public site" },
  { group: "Ecommerce", name: "Temu", aliases: ["temu"] },
  { group: "Ecommerce", name: "VTex", aliases: ["vtex"] },
  { group: "Ecommerce", name: "Walmart V3", aliases: ["walmart v3","walmartv3"] },
  { group: "Ecommerce", name: "Wayfair", aliases: ["wayfair"] },
  { group: "Ecommerce", name: "Wish", aliases: ["wish"] },
  { group: "Ecommerce", name: "Wix", aliases: ["wix"] },
  { group: "Ecommerce", name: "WooCommerce", aliases: ["woocommerce","woo commerce"] },
  { group: "EDI", name: "CommerceHub (Rithum)", aliases: ["commercehub (rithum)","commercehub","commerce hub"] },
  { group: "EDI", name: "Orderful", aliases: ["orderful"] },
  { group: "EDI", name: "SPS Commerce", aliases: ["sps commerce","spscommerce","sps"] },
  { group: "EDI", name: "True Commerce", aliases: ["true commerce","truecommerce"] },
  { group: "ERP", name: "Acumatica", aliases: ["acumatica"] },
  { group: "ERP", name: "Apparel Magic", aliases: ["apparel magic","apparelmagic"], note: "Not on the public site" },
  { group: "ERP", name: "Cin7 Core", aliases: ["cin7 core","cin7core","cin7","cin 7"] },
  { group: "ERP", name: "Microsoft Dynamics 365", aliases: ["microsoft dynamics 365","microsoftdynamics365","dynamics 365","microsoft dynamics","dynamics"] },
  { group: "ERP", name: "NetSuite", aliases: ["netsuite"] },
  { group: "ERP", name: "NewEgg", aliases: ["newegg"] },
  { group: "ERP", name: "Odoo", aliases: ["odoo"] },
  { group: "ERP", name: "Odoo 17", aliases: ["odoo 17","odoo17"] },
  { group: "ERP", name: "Quickbooks Online", aliases: ["quickbooks online","quickbooksonline","quickbooks","qbo"] },
  { group: "ERP", name: "Sage Intacct", aliases: ["sage intacct","sageintacct"] },
  { group: "ERP", name: "SAP", aliases: ["sap"] },
  { group: "CRM", name: "HubSpot", aliases: ["hubspot"] },
  { group: "CRM", name: "Salesforce", aliases: ["salesforce"] },
  { group: "CRM", name: "Zoho", aliases: ["zoho"] },
  { group: "Returns", name: "Loop Returns", aliases: ["loop returns","loopreturns"] },
  { group: "Other", name: "Cartrover", aliases: ["cartrover","cart rover"] }
];

const CARRIERS = [
  { group: "Pre-built", name: "Amazon Buy Shipping", aliases: ["amazon buy shipping","amazonbuyshipping","buy shipping"] },
  { group: "Pre-built", name: "Amazon Vendor Shipping", aliases: ["amazon vendor shipping","amazonvendorshipping","vendor shipping"] },
  { group: "Pre-built", name: "BukuShip", aliases: ["bukuship","buku"] },
  { group: "Pre-built", name: "EasyPost", aliases: ["easypost","easy post"] },
  { group: "Pre-built", name: "eHub", aliases: ["ehub","e-hub"] },
  { group: "Pre-built", name: "eShipper", aliases: ["eshipper"] },
  { group: "Pre-built", name: "FedEx", aliases: ["fedex","fed ex"] },
  { group: "Pre-built", name: "iDriveLogistics", aliases: ["idrivelogistics","idrive","idrive logistics"] },
  { group: "Pre-built", name: "Shipium", aliases: ["shipium"] },
  { group: "Pre-built", name: "Shippo", aliases: ["shippo"] },
  { group: "Pre-built", name: "ShipStation", aliases: ["shipstation","ship station"] },
  { group: "Pre-built", name: "Stamps.com", aliases: ["stamps.com","stamps com","stampscom","stamps"] },
  { group: "Pre-built", name: "TechShip", aliases: ["techship","tech ship"] },
  { group: "Pre-built", name: "UPS", aliases: ["ups"] },
  { group: "Pre-built", name: "Veeqo", aliases: ["veeqo"] },
  { group: "Partner", name: "Walmart Canada", aliases: ["walmart canada","walmartcanada"] }
];

const EXTRA_SYSTEMS = [];

const CATALOGS = { marketplaces: MARKETPLACES, carriers: CARRIERS };

const TO_DEVELOP = new Set([
  "Acenda", "Amazon SFP", "Bed, Bath and Beyond", "BestBuy", "BJ’s Wholesale Club (Rithum)",
  "Brightpearl", "Costco Wholesale (Rithum)", "Faire", "Home Depot", "Hot Topic (Rithum)",
  "HubSpot", "JOOR", "Logicbroker", "Lowes", "Macy’s (Rithum)", "Microsoft Dynamics 365",
  "Mirakl", "NewEgg", "Nordstrom", "Odoo", "Odoo 17", "Overstock", "QVC", "Sage Intacct",
  "Salesforce", "Sears", "Square", "Target", "Target Plus", "Temu", "VTex", "Walmart Canada",
  "Walmart DSV", "Walmart Marketplace", "Wish", "Zoho"
]);

function catalogItem(name) {
  const key = String(name || "").toLowerCase();
  return MARKETPLACES.find((item) => item.name.toLowerCase() === key) || CARRIERS.find((item) => item.name.toLowerCase() === key) || null;
}

function requiresCustomization(name) {
  const item = catalogItem(name);
  return !!item && (item.group === "ERP" || item.name === "SPS Commerce");
}

function escapeReg(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function uniqueNames(list) {
  const out = [];
  list.forEach((name) => {
    const clean = String(name || "").replace(/\s+/g, " ").trim();
    if (!clean || out.some((item) => item.toLowerCase() === clean.toLowerCase())) return;
    out.push(clean);
  });
  return out;
}

function matchCatalog(text, catalog) {
  const source = String(text || "");
  const lower = source.toLowerCase();
  const pairs = [];
  catalog.forEach((item) => item.aliases.forEach((alias) => pairs.push({ item, alias: alias.toLowerCase() })));
  pairs.sort((a, b) => b.alias.length - a.alias.length);
  const claimed = [];
  const found = [];
  pairs.forEach(({ item, alias }) => {
    const re = new RegExp(`(^|[^a-z0-9])${escapeReg(alias)}(?=[^a-z0-9]|$)`, "ig");
    let match;
    while ((match = re.exec(lower))) {
      const start = match.index + match[1].length;
      const end = start + alias.length;
      if (claimed.some((span) => start < span.end && end > span.start)) continue;
      claimed.push({ start, end });
      if (!found.includes(item.name)) found.push(item.name);
      break;
    }
  });
  return found;
}

function matchSystems(text, catalog) {
  return uniqueNames(matchCatalog(text, catalog).concat(matchCatalog(text, EXTRA_SYSTEMS)));
}

function canonicalizeList(value, catalog) {
  if (Array.isArray(value)) {
    return uniqueNames(value.flatMap((item) => {
      const matched = matchSystems(item, catalog);
      return matched.length ? matched : [item];
    }));
  }
  const text = String(value || "").trim();
  if (!text) return [];
  const matched = matchSystems(text, catalog);
  return matched.length ? matched : [text];
}

const LEFTOVER_STOP = new Set("a an the and or with for from to of in on at by as is are was were be we you they this that these those do does did need needs needed have has had will would can could should yes no none na tbd unknown maybe future immediate store stores shop shops connection connections two client clients direct wholesale brand integration integrations integrate open api wms order orders shipped shipping but not which our their via using use used plus also only new old other all both per day ground express freight home delivery asap".split(/\s+/));

function hasSupport(text) {
  return matchSystems(text, MARKETPLACES).length + matchSystems(text, CARRIERS).length > 0;
}

function stripSupported(text) {
  const source = String(text || "");
  const lower = source.toLowerCase();
  const aliases = [];
  [MARKETPLACES, CARRIERS].forEach((catalog) => {
    catalog.forEach((item) => item.aliases.forEach((alias) => aliases.push(alias.toLowerCase())));
  });
  aliases.sort((a, b) => b.length - a.length);
  const claimed = [];
  aliases.forEach((alias) => {
    const re = new RegExp(`(^|[^a-z0-9])${escapeReg(alias)}(?=[^a-z0-9]|$)`, "ig");
    let match;
    while ((match = re.exec(lower))) {
      const start = match.index + match[1].length;
      const end = start + alias.length;
      if (claimed.some((span) => start < span.end && end > span.start)) continue;
      claimed.push({ start, end });
    }
  });
  claimed.sort((a, b) => a.start - b.start);
  let cursor = 0;
  let rest = "";
  claimed.forEach((span) => {
    rest += source.slice(cursor, span.start);
    cursor = span.end;
  });
  return rest + source.slice(cursor);
}

function shortLeftovers(text) {
  const cleaned = String(text || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  if (!hasSupport(cleaned)) {
    if (/[?]/.test(cleaned)) return [];
    const words = cleaned.split(/\s+/);
    if (words.length > 4) return [];
    const meaningful = words.filter((word) => !LEFTOVER_STOP.has(word.toLowerCase().replace(/^[.(]+|[).,]+$/g, "")));
    if (!meaningful.length) return [];
    return [cleaned.replace(/^[.\s]+|[.\s]+$/g, "")];
  }
  const tokens = stripSupported(cleaned).split(/[^A-Za-z0-9.&+]+/).map((token) => token.trim()).filter((token) => token.length >= 2);
  const kept = tokens.filter((token) => !LEFTOVER_STOP.has(token.toLowerCase()));
  return kept.length > 3 ? [] : kept;
}

function unsupportedFromText(text) {
  const found = [];
  String(text || "").split(/\n+/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (/no store|not a store|no integration|\bnone\b|\bn\/a\b/i.test(trimmed) && !hasSupport(trimmed)) return;
    const parts = trimmed.split(/\s+[-–—]{1,2}\s*/);
    const anyMatch = parts.some((part) => hasSupport(part));
    parts.forEach((part) => {
      if (anyMatch && parts.length > 1 && !hasSupport(part)) return;
      if (hasSupport(part) && /\b(connection|connections|store|stores|client|clients)\b/i.test(part)) return;
      part.split(/\s*(?:,|;|\/|\(|\)|\band\b)\s*/i).forEach((piece) => {
        shortLeftovers(piece).forEach((name) => found.push(name));
      });
    });
  });
  return uniqueNames(found);
}

function rememberNames(list, names) {
  names.forEach((name) => {
    const clean = String(name || "").replace(/\s+/g, " ").trim();
    if (!clean || list.some((item) => item.toLowerCase() === clean.toLowerCase())) return;
    list.push(clean);
  });
}

function partitionIntegrations(marketplaces, carriers, unsupported, developing, custom) {
  const nextMarkets = [];
  const nextCarriers = [];
  const nextCustom = [];
  const nextMissing = [];
  [marketplaces, carriers, unsupported, developing, custom].forEach((list) => {
    if (list == null || list === "") return;
    const values = Array.isArray(list) ? list : String(list).split(/[,;\n]+/);
    values.forEach((value) => {
      const markets = matchSystems(value, MARKETPLACES);
      const cars = matchSystems(value, CARRIERS);
      const matched = uniqueNames(markets.concat(cars));
      if (matched.length) {
        matched.forEach((name) => {
          if (requiresCustomization(name)) rememberNames(nextCustom, [name]);
          else if (TO_DEVELOP.has(name)) rememberNames(nextMissing, [name]);
          else if (markets.includes(name)) rememberNames(nextMarkets, [name]);
          else rememberNames(nextCarriers, [name]);
        });
        return;
      }
      rememberNames(nextMissing, [value]);
    });
  });
  return { marketplaces: nextMarkets, carriers: nextCarriers, custom: nextCustom, unsupported: nextMissing };
}

function normalizeCustomer(item) {
  item.kickoff = item.kickoff || {};
  const kickoff = item.kickoff;
  ["date", "goLive", "warehouses", "users", "clients", "apiUsers", "volume", "notes"].forEach((key) => {
    if (kickoff[key] == null) kickoff[key] = "";
  });
  if (kickoff.integrations == null) kickoff.integrations = "";
  if (!Array.isArray(kickoff.unsupported)) kickoff.unsupported = [];
  if (!Array.isArray(kickoff.custom)) kickoff.custom = [];
  const earlierDeveloping = Array.isArray(kickoff.developing) ? kickoff.developing : [];
  const marketsBlank = !canonicalizeList(kickoff.marketplaces, MARKETPLACES).length && !String(kickoff.marketplaces || "").trim();
  const carriersBlank = !canonicalizeList(kickoff.carriers, CARRIERS).length && !String(kickoff.carriers || "").trim();
  if (marketsBlank && carriersBlank && !kickoff.unsupported.length && !kickoff.custom.length && String(kickoff.integrations || "").trim()) {
    kickoff.marketplaces = matchSystems(kickoff.integrations, MARKETPLACES);
    kickoff.carriers = matchSystems(kickoff.integrations, CARRIERS);
    kickoff.unsupported = unsupportedFromText(kickoff.integrations);
    if (kickoff.marketplaces.length || kickoff.carriers.length || kickoff.unsupported.length) kickoff.integrations = "";
  }
  const split = partitionIntegrations(kickoff.marketplaces, kickoff.carriers, kickoff.unsupported, earlierDeveloping, kickoff.custom);
  kickoff.marketplaces = split.marketplaces;
  kickoff.carriers = split.carriers;
  kickoff.custom = split.custom;
  kickoff.unsupported = split.unsupported;
  delete kickoff.developing;
  normalizeStickyForm(item);
}

const STICKY_FIELDS = [
  { key: "dateRequested", label: "Date requested", type: "date", match: /date requested/i },
  { key: "requestedBy", label: "Requested by (OBE)", type: "text", match: /requested by/i },
  { key: "csm", label: "CSM", type: "text", match: /^csm$/i },
  { key: "salesAe", label: "Sales account executive", type: "text", match: /sales account executive/i },
  { key: "orderLines", label: "Purchased order lines per month", type: "text", match: /order lines per month/i },
  { key: "activatedDate", label: "Customer activated date", type: "date", match: /activated date/i },
  { key: "onboardingApproval", label: "Onboarding approval date", type: "date", match: /onboarding approval/i },
  { key: "salesApproval", label: "Sales / CSM approval date", type: "date", match: /sales\s*\/\s*csm approval/i },
  { key: "scopeDelivered", label: "Has all scope been delivered", type: "yesno", match: /scope been delivered/i },
  { key: "trainingDelivered", label: "Has training been delivered", type: "yesno", match: /training been delivered/i },
  { key: "testingSignoff", label: "Customer testing sign-off", type: "yesno", match: /testing sign-?off/i },
  { key: "pastDue", label: "Is customer past due with payments", type: "yesno", match: /past due/i },
  { key: "shippedLines", label: "Customer shipped 20,000 order lines", type: "yesno", match: /shipped 20[,.]?000|shipped 20000/i },
  { key: "consistentUsage", label: "Customer has 2 months of consistent usage", type: "yesno", match: /consistent usage/i }
];

function emptyStickyForm() {
  const form = { updatedAt: "", aiAdoption: "" };
  STICKY_FIELDS.forEach((field) => { form[field.key] = ""; });
  return form;
}

function normalizeStickyForm(item) {
  const current = item.stickyForm && typeof item.stickyForm === "object" ? item.stickyForm : {};
  item.stickyForm = { ...emptyStickyForm(), ...current };
}

function stickyStarted(item) {
  return STICKY_FIELDS.some((field) => String(item.stickyForm[field.key] || "").trim());
}

function scorePair(item) {
  const activation = evaluate(item, "activation");
  const pre = evaluate(item, "sticky");
  const average = activation.complete && pre.complete ? (activation.score + pre.score) / 2 : null;
  return { activation, pre, average };
}

function stickySuggestions(item) {
  const form = item.stickyForm;
  const scores = scorePair(item);
  const steps = [];
  if (!scores.activation.complete || !scores.pre.complete) {
    steps.push({
      level: "hold",
      timing: "Before the sticky meeting",
      owner: "Implementation engineer",
      action: "Activation and Pre-Sticky both need a full score before this account is judged ready for the sticky meeting.",
      done: "Both scores are in, so the average can be read."
    });
  } else if (scores.average < 3) {
    steps.push({
      level: "hold",
      timing: "Suggested first",
      owner: "Implementation engineer",
      action: `Activation is ${fmt(scores.activation.score)} and Pre-Sticky is ${fmt(scores.pre.score)}. Together they average ${fmt(scores.average)}, under 3. It would help to look through those scores again. This account does not look ready to bring to the sticky meeting yet.`,
      done: "The two scores have been reviewed, and the average is no longer under 3, or the team has agreed to wait."
    });
  }
  if (stickyStarted(item)) {
    if (form.testingSignoff !== "Yes") {
      steps.push({
        timing: "Before the sticky meeting",
        owner: "Implementation engineer",
        action: "Customer testing sign-off is still missing. Asking the customer to sign it would close that step.",
        done: "Customer testing sign-off is marked Yes."
      });
    }
    if (!String(form.onboardingApproval || "").trim()) {
      steps.push({
        timing: "Before the sticky meeting",
        owner: "Implementation engineer",
        action: "Onboarding approval is not dated yet. A sign-off there would help before the meeting.",
        done: "The onboarding approval date is on the form."
      });
    }
    if (!String(form.salesApproval || "").trim()) {
      steps.push({
        timing: "Before the sticky meeting",
        owner: "Implementation engineer",
        action: "Sales and CSM approval is not dated yet. That sign-off is still needed.",
        done: "The Sales / CSM approval date is on the form."
      });
    }
    if (form.scopeDelivered === "No") {
      steps.push({
        timing: "Before the sticky meeting",
        owner: "Implementation engineer",
        action: "Some of the agreed scope still looks open. Naming what is left would make the sticky conversation clearer.",
        done: "Scope delivered is marked Yes, or the remaining scope has a note the team accepts."
      });
    }
    if (form.trainingDelivered === "No") {
      steps.push({
        timing: "When there is a moment",
        owner: "Implementation engineer",
        action: "Training does not look finished. A remaining session, when the team is ready, would help.",
        done: "Training delivered is marked Yes, or a makeup session is agreed."
      });
    }
    if (form.pastDue === "Yes") {
      steps.push({
        timing: "Before the sticky meeting",
        owner: "Implementation engineer",
        action: "Payments look past due. A gentle follow-up would help before the meeting. The invoice detail can stay in Maxio.",
        done: "The past-due question is No, or the follow-up is recorded."
      });
    }
    if (form.shippedLines === "No") {
      steps.push({
        timing: "When there is a moment",
        owner: "Implementation engineer",
        action: "The 20,000 order-line mark is not checked yet. It may help to confirm current volume against that threshold.",
        done: "Shipped order lines is marked Yes, or the team has agreed the threshold can wait."
      });
    }
    if (form.consistentUsage === "No") {
      steps.push({
        timing: "Before the sticky meeting",
        owner: "Implementation engineer",
        action: "Two months of consistent usage is not in place yet. The sticky meeting can wait until that usage is there.",
        done: "Consistent usage is marked Yes."
      });
    }
  } else if (!steps.some((step) => step.level === "hold")) {
    steps.push({
      timing: "Next step",
      owner: "Implementation engineer",
      action: "The sticky form is the next step after Pre-Sticky. Filling it in shows whether a sign-off, scope, training, payment, or usage item is still open.",
      done: "The sticky form has its answers, including the sign-off lines."
    });
  }
  if (onAiList(item)) {
    steps.push({
      timing: "At the sticky meeting",
      owner: "Implementation engineer",
      action: "This customer is on the AI Adoption list. The sticky conversation can include a short invitation to that path.",
      done: "AI adoption has been mentioned, or the team has agreed to leave it for later."
    });
  }
  return steps;
}

function stickyLead(item, steps) {
  if (steps.some((step) => step.level === "hold")) return "This is the next step after Pre-Sticky, and the account needs another look before the sticky meeting.";
  if (!stickyStarted(item)) return "The sticky form is the next step after Pre-Sticky.";
  if (!steps.length) return "Pre-Sticky is behind this account, and the sticky form looks settled. It can be brought to the sticky meeting.";
  return "The sticky form is the next step after Pre-Sticky. A few items are still open.";
}

function stickyFormStatus(item) {
  const filled = STICKY_FIELDS.filter((field) => String(item.stickyForm[field.key] || "").trim()).length;
  if (!filled) return "Not started";
  if (filled < STICKY_FIELDS.length) return `${filled}/${STICKY_FIELDS.length} filled`;
  return stickySuggestions(item).some((step) => step.level === "hold") ? "Needs a look" : "Form complete";
}

function stickyFieldHtml(item, field) {
  const value = item.stickyForm[field.key] || "";
  if (field.type === "yesno") {
    return `<label>${esc(field.label)}<select class="text" data-sticky="${field.key}"><option value="" ${value === "" ? "selected" : ""}>Select</option><option value="Yes" ${value === "Yes" ? "selected" : ""}>Yes</option><option value="No" ${value === "No" ? "selected" : ""}>No</option></select></label>`;
  }
  return `<label>${esc(field.label)}<input class="text" type="${field.type === "date" ? "date" : "text"}" data-sticky="${field.key}" value="${esc(value)}" /></label>`;
}

function stickyFormHtml(item) {
  const people = STICKY_FIELDS.filter((field) => ["dateRequested", "requestedBy", "csm", "salesAe", "orderLines", "activatedDate"].includes(field.key));
  const approvals = STICKY_FIELDS.filter((field) => ["onboardingApproval", "salesApproval"].includes(field.key));
  const checks = STICKY_FIELDS.filter((field) => field.type === "yesno");
  return `<section class="card kickoff sticky-sheet">
    <div class="import-row"><label class="btn file-btn">Import sticky form Excel<input type="file" accept=".xlsx,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" data-sticky-file /></label><p class="hint" data-sticky-status>Reads a sticky form workbook, with the question in column A and the answer in column B.</p></div>
    <div class="sticky-fields">${people.map((field) => stickyFieldHtml(item, field)).join("")}</div>
    <h2 class="span-3">Approvals</h2>
    <div class="sticky-fields">${approvals.map((field) => stickyFieldHtml(item, field)).join("")}</div>
    <h2 class="span-3">Select all applicable</h2>
    <div class="sticky-fields">${checks.map((field) => stickyFieldHtml(item, field)).join("")}</div>
    <label class="span-3">On the AI Adoption list<select class="text" data-sticky="aiAdoption"><option value="" ${item.stickyForm.aiAdoption === "" ? "selected" : ""}>Select</option><option value="Yes" ${item.stickyForm.aiAdoption === "Yes" ? "selected" : ""}>Yes</option><option value="No" ${item.stickyForm.aiAdoption === "No" ? "selected" : ""}>No</option></select></label>
    <p class="hint span-3">${esc(aiAdoptionHint(item))} Leave this blank to follow the <a href="https://docs.google.com/spreadsheets/d/1mjr3-XtbDVAfKAgSdBOuElTSdZkzh6UoVilhYi8rkU0/edit" target="_blank" rel="noopener">AI Adoption document</a>. Yes or No overrides that list.</p>
  </section>`;
}

function stickyPlanHtml(item) {
  const steps = stickySuggestions(item);
  const list = steps.map((step) => `<li><p class="meta">${esc(step.timing)} · ${esc(step.owner)}</p><p>${esc(step.action)}</p><p class="hint">Feels settled when ${esc(step.done.charAt(0).toLowerCase() + step.done.slice(1))}</p></li>`).join("");
  return `<h2>Suggested plan</h2><p class="plan-lead">${esc(stickyLead(item, steps))}</p>${list ? `<ol class="plan-steps">${list}</ol>` : ""}<p class="hint">Suggestions for the sticky meeting, the next step after Pre-Sticky. The engineer can take them in any order.</p>`;
}

function stickyRailHtml(item) {
  const scores = scorePair(item);
  const warn = scores.average != null && scores.average < 3;
  const headline = scores.average == null ? "—" : fmt(scores.average);
  const status = scores.average == null ? "Scores needed" : warn ? "Below 3" : "At 3 or above";
  return `
    <p class="eyebrow">Sticky meeting</p>
    <div class="big-score">${headline}</div>
    <span class="pill ${warn ? "high" : scores.average != null ? "low" : ""}">${status}</span>
    <p class="meta">Average of Activation and Pre-Sticky.</p>
    <h2>Scores</h2>
    <div class="driver"><span>Activation</span><b>${scores.activation.complete ? fmt(scores.activation.score) : "—"}</b></div>
    <div class="driver"><span>Pre-Sticky</span><b>${scores.pre.complete ? fmt(scores.pre.score) : "—"}</b></div>
    <p class="band-copy">An average under 3 means the account is not ready for the sticky meeting yet. Missing sign-off on the form becomes a suggestion to have it signed.</p>`;
}

function foldName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/^sample\s+[—–-]\s+/, "")
    .replace(/\bfulfilment\b/g, "fulfillment")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function namesMatch(customer, listed) {
  const left = foldName(customer);
  const right = foldName(listed);
  if (!left || !right || left.length < 3 || right.length < 3) return false;
  if (left === right) return true;
  const shorter = left.length <= right.length ? left : right;
  const longer = left.length <= right.length ? right : left;
  if (shorter.length >= 8 && longer.includes(shorter)) return true;
  return longer.startsWith(`${shorter} `);
}

const AI_ADOPTION = [
  "Priority Fulfillment", "Future Fulfilment - Pilot", "Future Fulfillment", "Howlett - Logiwa IO Migration", "Howlett",
  "RXO", "American Warehouse - New Deal", "American Warehouse, Inc.", "KSP Fulfillment - New Deal", "KSP Fulfillment",
  "GTH America - IO Migration", "GTH America - Non Deliverr", "OneLive - IO Migration", "OneLive", "Custom Back Office",
  "Custom Back Office Solutions", "Velocity International Group", "Simpson Labs - IO Migration - CSM", "Simpson Labs",
  "On Air Direct - IO Migration", "On Air Direct", "JKD", "Evolution Logistics", "Golden Bridge", "Harris Freeman",
  "Amir Transports", "A to Z Drying", "Group Transport - IO Migration", "Favafill", "Product Fulfillment Solutions",
  "Product Fulllment Solutions, Inc.", "OC3PL", "Admirari", "Valencia Fulfillment", "Inland Star", "Simple Global",
  "Logistics Plus", "Dile Logistics", "California Olive Ranch", "Paleovalley", "Revelry", "GoodBuy Gear", "Good Buy Gear",
  "Genesis Engineering", "Genesis Engineering Services", "Airyze", "7 Days Express", "YM Trading", "Komyo Logistics",
  "Accurate Freight Systems", "WP Fulfillment", "Fanatics Topps", "Fanatics", "United Logistics", "World Pantry",
  "Team 1 Supply", "Pepsi", "List Logistics", "Pronto", "Warehouseanywhere", "Fulfillment Australia", "Flofillment",
  "Supplied Longevity", "National Commercial Warehouse (NCW)", "Flexport", "Deliverr Inc / Flexport", "Radial", "Sincro",
  "Go Sincro Limited", "Drive Fulfillment", "Badger", "Badger Fulfillment Group Inc", "Veyer LLC", "Locad",
  "Aviator Nation", "eShipper+", "JLab", "Pegasus Media & Logistics", "Calibrate Network", "Palletized",
  "Annies Publishing (aka DRG Management, Inc.)", "eCom Logistics", "Shipflow", "Left Brain Logistics", "ShipTo Partners",
  "3PL PROS, LLC.", "Magna-Tiles", "MV Sport", "Stockmatic", "Imogne + Willie", "MP Fulfillment, LLC (Priority Fulfillment)",
  "Saddlepoint 3PL", "Velociraptor 3PL", "Logistic Angels"
];

function listedForAi(name) {
  return AI_ADOPTION.some((listed) => namesMatch(name, listed));
}

function onAiList(item) {
  if (item.stickyForm.aiAdoption === "No") return false;
  if (item.stickyForm.aiAdoption === "Yes") return true;
  return listedForAi(item.name);
}

function aiAdoptionHint(item) {
  if (item.stickyForm.aiAdoption === "Yes") return "Marked Yes on this form.";
  if (item.stickyForm.aiAdoption === "No") return "Marked No, so a document match is set aside.";
  if (listedForAi(item.name)) return "This name is on the AI Adoption document.";
  return "This name was not found on the AI Adoption document.";
}

function normalizeYesNo(value) {
  const text = String(value || "").trim();
  if (/^y/i.test(text)) return "Yes";
  if (/^n/i.test(text)) return "No";
  return "";
}

function normalizeDate(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
  const serial = Number(text);
  if (serial > 20000 && serial < 80000) {
    const utc = new Date(Date.UTC(1899, 11, 30) + Math.round(serial) * 86400000);
    return utc.toISOString().slice(0, 10);
  }
  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${parsed.getFullYear()}-${month}-${day}`;
  }
  return "";
}

function applyStickyWorkbook(workbook, item) {
  let matched = 0;
  let workbookName = "";
  workbook.SheetNames.some((name) => {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1, defval: "", raw: false });
    rows.forEach((row) => {
      const label = String(row[0] || "").replace(/\s+/g, " ").trim();
      const value = row[1];
      if (/customer name/i.test(label)) {
        workbookName = String(value || "").trim();
        return;
      }
      const field = STICKY_FIELDS.find((itemField) => itemField.match.test(label));
      if (!field) return;
      const next = field.type === "yesno" ? normalizeYesNo(value) : field.type === "date" ? normalizeDate(value) : String(value || "").trim();
      item.stickyForm[field.key] = next;
      if (String(value || "").trim()) matched += 1;
    });
    return matched > 0;
  });
  if (!matched) throw new Error("This workbook does not look like a sticky form. Use the sheet with questions in column A and answers in column B.");
  item.stickyForm.updatedAt = new Date().toISOString();
  const who = workbookName ? ` for ${workbookName}` : "";
  return `Imported sticky form${who}.`;
}

function readStickyFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const status = () => document.querySelector("[data-sticky-status]");
    try {
      if (typeof XLSX === "undefined") throw new Error("The Excel reader did not load. Refresh the page and try again.");
      const found = currentCustomer();
      if (!found) return;
      const workbook = XLSX.read(new Uint8Array(reader.result), { type: "array" });
      const summary = applyStickyWorkbook(workbook, found.item);
      save();
      render();
      const line = status();
      if (line) line.textContent = summary;
    } catch (err) {
      const line = status();
      if (line) line.textContent = err.message || "That workbook could not be read.";
    }
  };
  reader.readAsArrayBuffer(file);
}

let state = load();

function samples() {
  return [
    customer({
      sample: true,
      name: "Sample — Atlas Fulfillment",
      engineer: "Sample engineer",
      kickoff: { date: "2026-09-02", goLive: "2026-11-18", warehouses: "1", users: "20", clients: "5", apiUsers: "2", volume: "500 orders/day", marketplaces: ["Shopify", "NetSuite"], carriers: [], notes: "Executive sponsor attended discovery. Payment follow-up is open." },
      phases: { early: answers({ stakeholder: 5, expectations: 5, ownership: 5, timeline: 5, change: 5, it: 5, fit: 5, payment: 3 }) }
    }),
    customer({
      sample: true,
      name: "Sample — Cedar Warehouse",
      engineer: "Sample engineer",
      kickoff: { date: "2026-07-14", goLive: "2026-10-02", warehouses: "2", users: "12", clients: "8", apiUsers: "1", volume: "1,200 shipments/day", marketplaces: ["SPS Commerce", "Shopify"], carriers: ["UPS", "FedEx"], notes: "UAT is active. Go-live has already moved." },
      phases: {
        early: answers({ stakeholder: 5, expectations: 3, ownership: 5, timeline: 3, change: 5, it: 3, fit: 5, payment: 5 }),
        activation: answers({ stakeholder: 3, ownership: 5, integration: 3, payment: 5, training: 3, uat: 3, adaption: 3, ontime: 1 }, { ontime: "9", uat: "70", training: "2", integration: "72" })
      }
    }),
    customer({
      sample: true,
      name: "Sample — Northwind Parcel",
      engineer: "Sample engineer",
      kickoff: { date: "2026-05-20", goLive: "2026-08-01", warehouses: "1", users: "8", clients: "3", apiUsers: "1", volume: "800 shipments/day", marketplaces: ["NetSuite"], carriers: ["UPS"], notes: "Volume is below the kickoff baseline and Sev1 tickets are open." },
      phases: {
        early: answers({ stakeholder: 5, expectations: 5, ownership: 5, timeline: 5, change: 3, it: 5, fit: 5, payment: 5 }),
        activation: answers({ stakeholder: 5, ownership: 5, integration: 5, payment: 5, training: 5, uat: 5, adaption: 5, ontime: 5 }),
        sticky: answers({ ownership: 5, integration: 1, payment: 3, volume: 1, sev2: 1, sev1: 1, nps: 3 }, { integration: "48", volume: "42", sev2: "14", sev1: "3", nps: "6" })
      }
    })
  ];
}

function customer(seed) {
  const phases = {};
  PHASES.forEach((phase) => {
    phases[phase.id] = seed.phases && seed.phases[phase.id]
      ? { ...seed.phases[phase.id], updatedAt: seed.phases[phase.id].updatedAt || new Date().toISOString() }
      : { assessor: seed.engineer || "", updatedAt: "", answers: {} };
  });
  return {
    id: crypto.randomUUID(),
    sample: !!seed.sample,
    name: seed.name || "",
    engineer: seed.engineer || "",
    kickoff: {
      date: "", goLive: "", warehouses: "", users: "", clients: "", apiUsers: "", volume: "", marketplaces: [], carriers: [], custom: [], unsupported: [], integrations: "", notes: "",
      ...(seed.kickoff || {})
    },
    phases
  };
}

function answers(scores, raw = {}) {
  const out = {};
  Object.entries(scores).forEach(([id, score]) => {
    out[id] = { score, na: false, note: "", raw: raw[id] || "", manual: false };
  });
  return { assessor: "Sample engineer", updatedAt: new Date().toISOString(), answers: out };
}

function save() { localStorage.setItem(KEY, JSON.stringify(state)); }

function phaseById(id) { return PHASES.find((phase) => phase.id === id); }
function customerById(id) { return state.customers.find((item) => item.id === id); }
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}
function fmt(value) { return value == null || Number.isNaN(value) ? "—" : (Math.round(value * 10) / 10).toFixed(1); }
function pct(weight) { return `${Math.round(weight * 100)}%`; }
function when(iso) {
  if (!iso) return "Not started";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function bandFor(score) {
  if (score == null) return null;
  if (score < 3) return "high";
  if (score <= 4) return "medium";
  return "low";
}

function answerFor(customer, phaseId, metricId) {
  const phase = customer.phases[phaseId];
  phase.answers[metricId] = phase.answers[metricId] || { score: null, na: false, note: "", raw: "", manual: false };
  return phase.answers[metricId];
}

function evaluate(customer, phaseId) {
  const phase = phaseById(phaseId);
  const items = phase.metrics.map((metric) => {
    const answer = answerFor(customer, phaseId, metric.id);
    const included = !answer.na && answer.score != null;
    return { metric, answer, included, weighted: included ? answer.score * metric.weight : 0 };
  });
  const applicable = items.filter((item) => !item.answer.na);
  const answered = applicable.filter((item) => item.answer.score != null);
  const weight = answered.reduce((sum, item) => sum + item.metric.weight, 0);
  const score = weight ? items.reduce((sum, item) => sum + item.weighted, 0) / weight : null;
  const complete = applicable.length > 0 && answered.length === applicable.length;
  return {
    items, applicable, answered, score, complete,
    band: complete ? bandFor(score) : null,
    drivers: items
      .filter((item) => item.included && item.answer.score < 5)
      .sort((a, b) => (5 - b.answer.score) * b.metric.weight - (5 - a.answer.score) * a.metric.weight)
  };
}

function worst(customer) {
  const scored = PHASES.map((phase) => ({ phase, result: evaluate(customer, phase.id) })).filter((item) => item.result.complete);
  if (!scored.length) return null;
  return scored.sort((a, b) => a.result.score - b.result.score)[0];
}

function suggest(metric, raw) {
  if (raw === "" || raw == null) return { score: null, message: "" };
  const n = Number(raw);
  if (Number.isNaN(n)) return { score: null, message: "Enter a number." };
  if (metric.helper === "integration") {
    if (n < 0 || n > 100) return { score: null, message: "Use a score from 0 to 100." };
    if (n <= 60) return { score: 1, message: "0–60 maps to 1." };
    if (n < 80) return { score: 3, message: "61–79 maps to 3. A score of 80 uses the top band." };
    return { score: 5, message: "80 and above maps to 5." };
  }
  if (metric.helper === "training") {
    if (n <= 0) return { score: 5, message: "No no-shows or reschedules maps to 5." };
    if (n <= 3) return { score: 3, message: "1–3 events map to 3." };
    return { score: 1, message: "More than 3 events map to 1." };
  }
  if (metric.helper === "uat") {
    if (n > 90) return { score: 5, message: "Over 90% maps to 5." };
    if (n > 60) return { score: 3, message: "Over 60% maps to 3." };
    return { score: 1, message: "60% or below maps to 1." };
  }
  if (metric.helper === "weeks") {
    if (n > 8) return { score: 1, message: "More than 8 weeks maps to 1." };
    if (n > 4) return { score: 3, message: "More than 4 and up to 8 weeks maps to 3." };
    if (n <= 2) return { score: 5, message: "Up to 2 weeks maps to 5." };
    return { score: null, message: "More than 2 and up to 4 weeks is not defined in the template. Choose the closest band." };
  }
  if (metric.helper === "volume") {
    if (n < 50) return { score: 1, message: "Below 50% maps to 1." };
    if (n < 80) return { score: 3, message: "50–79% maps to 3. 80% uses the top band." };
    return { score: 5, message: "80% or more maps to 5." };
  }
  if (metric.helper === "sev2") {
    if (n > 10) return { score: 1, message: "More than 10 maps to 1." };
    if (n > 5) return { score: 3, message: "6–10 maps to 3. Five or fewer uses the top band." };
    return { score: 5, message: "Up to 5 maps to 5." };
  }
  if (metric.helper === "sev1") {
    if (n <= 0) return { score: 5, message: "No Sev1 tickets maps to 5." };
    if (n <= 2) return { score: 3, message: "1 or 2 Sev1 tickets map to 3." };
    return { score: 1, message: "More than 2 Sev1 tickets map to 1." };
  }
  if (metric.helper === "nps") {
    if (n < 0 || n > 10) return { score: null, message: "Use a rating from 0 to 10." };
    if (n <= 4) return { score: 1, message: "0–4 maps to 1." };
    if (n <= 7) return { score: 3, message: "5–7 maps to 3." };
    return { score: 5, message: "8 and above maps to 5." };
  }
  return { score: null, message: "" };
}

function route() {
  const [path, query] = (location.hash || "#/").slice(1).split("?");
  const parts = path.split("/").filter(Boolean);
  const params = new URLSearchParams(query || "");
  if (parts[0] === "new") return { name: "new" };
  if (parts[0] === "customer" && parts[1]) return { name: "customer", id: decodeURIComponent(parts[1]), phase: params.get("phase") || "early" };
  return { name: "dashboard" };
}

function render(resetScroll) {
  const current = route();
  document.getElementById("app").innerHTML = current.name === "customer"
    ? customerView(current)
    : current.name === "new" ? newView() : dashboardView();
  if (resetScroll) window.scrollTo(0, 0);
}

function dashboardView() {
  const rows = state.customers
    .map((item) => ({ item, worst: worst(item) }))
    .filter(({ item, worst: low }) => {
      const text = `${item.name} ${item.engineer}`.toLowerCase();
      if (ui.q && !text.includes(ui.q.toLowerCase())) return false;
      if (ui.risk === "open") return !low;
      if (ui.risk !== "all") return low && low.result.band === ui.risk;
      return true;
    })
    .sort((a, b) => (a.worst?.result.score ?? 99) - (b.worst?.result.score ?? 99));
  const counts = { high: 0, medium: 0, low: 0, open: 0 };
  state.customers.forEach((item) => {
    const low = worst(item);
    counts[low ? low.result.band : "open"] += 1;
  });
  const phaseCounts = PHASES.map((phase) => ({
    phase,
    done: state.customers.filter((item) => evaluate(item, phase.id).complete).length
  }));
  const weak = weakMetrics();
  const hasSamples = state.customers.some((item) => item.sample);
  return `
    ${shell("Score a customer at kickoff, during activation, and again before the account is treated as sticky.")}
    <main class="wrap">
      ${hasSamples ? `<div class="notice"><span>Three sample customers are loaded so the dashboard has something to read. Remove them before entering live accounts.</span><button class="btn" data-action="clear-samples">Remove samples</button></div>` : ""}
      <section class="stats">
        <article class="stat"><b>${state.customers.length}</b><span>Customers</span></article>
        <article class="stat high"><b>${counts.high}</b><span>High risk</span></article>
        <article class="stat medium"><b>${counts.medium}</b><span>Medium risk</span></article>
        <article class="stat low"><b>${counts.low}</b><span>Low risk</span></article>
        <article class="stat"><b>${counts.open}</b><span>Not scored yet</span></article>
      </section>
      <section class="grid-2">
        <article class="panel">
          <h2>Phase coverage</h2>
          ${phaseCounts.map(({ phase, done }) => `<div class="bar-row"><span>${esc(phase.name)}</span><div class="track"><span style="width:${state.customers.length ? (done / state.customers.length) * 100 : 0}%"></span></div><b>${done}</b></div>`).join("")}
        </article>
        <article class="panel">
          <h2>Repeated weak spots</h2>
          ${weak.length ? weak.map((item) => `<div class="weak"><span>${esc(item.name)}</span><b>${item.count}</b></div>`).join("") : `<p class="muted">Weak scores will collect here after assessments are completed.</p>`}
        </article>
      </section>
      <div class="toolbar">
        <input class="search" id="search" placeholder="Search customer or engineer" value="${esc(ui.q)}" />
        ${[["all", "All"], ["high", "High"], ["medium", "Medium"], ["low", "Low"], ["open", "Not scored"]].map(([id, label]) => `<button class="chip" data-action="filter" data-risk="${id}" aria-pressed="${ui.risk === id}">${label}</button>`).join("")}
      </div>
      <section class="board">
        ${rows.length ? rows.map(({ item, worst: low }) => customerRow(item, low)).join("") : `<div class="card empty"><h2>No customers match</h2><p class="muted">Add a customer, or clear the current filter.</p></div>`}
      </section>
    </main>`;
}

function customerRow(item, low) {
  const phases = PHASES.map((phase) => {
    const result = evaluate(item, phase.id);
    const cls = result.complete ? result.band : "";
    return `<span class="phase-score"><em>${esc(phase.name)}</em><b class="score-num">${result.complete ? fmt(result.score) : "—"}</b><i class="pill ${cls}">${result.complete ? BANDS[result.band].label : `${result.answered.length}/${result.applicable.length || phase.metrics.length}`}</i></span>`;
  }).join("");
  return `<button class="customer-row" data-action="open" data-id="${esc(item.id)}"><span><strong>${esc(item.name)}</strong><span class="meta">${esc(item.engineer || "No engineer")} · ${low ? esc(low.phase.name) : "No completed phase"}</span></span>${phases}</button>`;
}

function weakMetrics() {
  const counts = new Map();
  state.customers.forEach((item) => {
    PHASES.forEach((phase) => {
      const result = evaluate(item, phase.id);
      if (!result.complete) return;
      result.items.forEach((entry) => {
        if (!entry.included || entry.answer.score === 5) return;
        const key = `${phase.name} · ${entry.metric.name}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      });
    });
  });
  return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5);
}

function newView() {
  return `
    ${shell("Create the customer record, then score each phase when that work actually happens.")}
    <main class="wrap">
      <a class="back" href="#/">Back to dashboard</a>
      <form class="card form-card form-grid" id="new-form" style="margin-top:12px">
        <h2>New customer</h2>
        ${kickoffImportRow()}
        <label>Customer name<input class="text" name="name" required placeholder="Customer name" /></label>
        <label>Implementation engineer<input class="text" name="engineer" placeholder="Engineer name" /></label>
        <div class="pair">
          <label>Warehouses<input class="text" name="warehouses" /></label>
          <label>Users<input class="text" name="users" /></label>
        </div>
        <label>Clients<textarea name="clients"></textarea></label>
        <div class="pair">
          <label>API users<input class="text" name="apiUsers" /></label>
          <label>Expected volume from kickoff or contract<input class="text" name="volume" placeholder="Example: 500 orders/day" /></label>
        </div>
        ${comboHtml("marketplaces", "Marketplace integrations", [], "Search Shopify, Amazon, WooCommerce")}
        ${comboHtml("carriers", "Carrier integrations", [], "Search UPS, FedEx, ShipStation")}
        ${customHtml([])}
        ${unsupportedHtml([])}
        <label>Kickoff notes<textarea name="notes"></textarea></label>
        <button class="btn primary" type="submit">Create and start Early Churn</button>
      </form>
    </main>`;
}

function customerView(current) {
  const item = customerById(current.id);
  if (!item) return `${shell("")}<main class="wrap"><a class="back" href="#/">Back</a><div class="card empty"><h2>Customer not found</h2></div></main>`;
  const stickyForm = current.phase === "sticky-form";
  const phase = stickyForm ? null : (phaseById(current.phase) || PHASES[0]);
  const result = phase ? evaluate(item, phase.id) : null;
  const updated = stickyForm ? item.stickyForm.updatedAt : item.phases[phase.id].updatedAt;
  return `
    ${shell(stickyForm ? "The next step after Pre-Sticky. Decide whether this account is ready for the sticky meeting." : phase.purpose)}
    <main class="wrap">
      <div class="page-head">
        <div>
          <a class="back" href="#/">All customers</a>
          <input class="name-input" data-field="name" value="${esc(item.name)}" aria-label="Customer name" />
          <p class="meta" id="updated-line">${item.sample ? "Sample record · " : ""}Last change ${esc(when(updated))}</p>
        </div>
        <button class="btn quiet" data-action="delete" data-id="${esc(item.id)}">Delete customer</button>
      </div>
      <section class="card kickoff">
        ${kickoffImportRow()}
        ${field("Engineer", "engineer", item.engineer, "text")}
        ${field("Kickoff date", "date", item.kickoff.date, "date", true)}
        ${field("Target activation", "goLive", item.kickoff.goLive, "date", true)}
        ${field("Warehouses", "warehouses", item.kickoff.warehouses, "text", true)}
        ${field("Users", "users", item.kickoff.users, "text", true)}
        ${field("API users", "apiUsers", item.kickoff.apiUsers, "text", true)}
        ${field("Expected volume", "volume", item.kickoff.volume, "text", true)}
        <label class="span-3">Clients<textarea data-kickoff="clients">${esc(item.kickoff.clients)}</textarea></label>
        <div class="pair">
          ${comboHtml("marketplaces", "Marketplace integrations", item.kickoff.marketplaces, "Search Shopify, Amazon, WooCommerce")}
          ${comboHtml("carriers", "Carrier integrations", item.kickoff.carriers, "Search UPS, FedEx, ShipStation")}
        </div>
        ${customHtml(item.kickoff.custom)}
        ${unsupportedHtml(item.kickoff.unsupported)}
        ${item.kickoff.integrations ? `<p class="hint span-3">Earlier combined list: ${esc(item.kickoff.integrations)}. Move each name into marketplace or carrier above.</p>` : ""}
        <label class="span-3">Kickoff notes<textarea data-kickoff="notes">${esc(item.kickoff.notes)}</textarea></label>
      </section>
      <nav class="tabs">${PHASES.map((itemPhase) => tab(item, itemPhase, phase && phase.id)).join("")}${stickyFormTab(item, stickyForm)}</nav>
      ${stickyForm ? `${stickyFormHtml(item)}<section class="layout"><div><section class="card plan" id="plan">${stickyPlanHtml(item)}</section></div><aside class="rail" id="rail">${stickyRailHtml(item)}</aside></section>` : `<section class="card plan" id="plan">${planHtml(item, phase, result)}</section>
      <section class="layout">
        <div class="questions" id="questions">${questionsHtml(item, phase)}</div>
        <aside class="rail" id="rail">${railHtml(item, phase, result)}</aside>
      </section>`}
    </main>`;
}

function field(label, key, value, type, kickoff) {
  const attr = kickoff ? `data-kickoff="${key}"` : `data-field="${key}"`;
  return `<label>${esc(label)}<input class="text" type="${type}" ${attr} value="${esc(value)}" /></label>`;
}

function kickoffImportRow() {
  return `<div class="import-row"><label class="btn file-btn">Import kickoff Excel<input type="file" accept=".xlsx,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" data-kickoff-file /></label><p class="hint" data-import-status>Reads Project Details, Business Goals, and Integration answers. The customer name comes from the file name.</p></div>`;
}

function comboHtml(key, label, selected, placeholder) {
  const names = Array.isArray(selected) ? selected : canonicalizeList(selected, CATALOGS[key]);
  return `<div class="combo" data-combo="${esc(key)}" data-selected="${esc(JSON.stringify(names))}" data-placeholder="${esc(placeholder)}">
    <span class="combo-label">${esc(label)}</span>
    <div class="combo-anchor">
      <div class="combo-control">${names.map((name) => tagHtml(name)).join("")}<input class="combo-search" data-combo-search type="text" placeholder="${esc(names.length ? "Add another" : placeholder)}" autocomplete="off" role="combobox" aria-expanded="false" aria-autocomplete="list" /></div>
      <div class="combo-menu" data-combo-menu hidden></div>
    </div>
    <p class="hint combo-hint">From the Logiwa integrations list. ERP names and SPS Commerce go under Integrations that may require customization. A name with no owner, or one that is not listed, stays under Integrations not pre-built.</p>
  </div>`;
}

function customHtml(selected) {
  return chipFieldHtml("custom", "Integrations that may require customization", selected, "Add an ERP, such as NetSuite, or SPS Commerce", "ERP integrations from the Logiwa list, plus SPS Commerce. These may need custom work.");
}

function unsupportedHtml(selected) {
  return chipFieldHtml("unsupported", "Integrations not pre-built", selected, "Add a system that is not on the Logiwa list", "Names that are not on the Logiwa list, and listed names with no owner, stay here unless they are an ERP or SPS Commerce.");
}

function chipFieldHtml(kind, label, selected, emptyPlaceholder, hint) {
  const names = Array.isArray(selected) ? selected : [];
  const placeholder = names.length ? "Add another" : emptyPlaceholder;
  return `<div class="${kind === "custom" ? "custom-list" : "unsupported"}" data-${kind} data-empty="${esc(emptyPlaceholder)}" data-selected="${esc(JSON.stringify(names))}">
    <span class="combo-label">${esc(label)}</span>
    <div class="combo-control">${names.map((name) => tagHtml(name)).join("")}<input class="combo-search" data-${kind}-search type="text" placeholder="${esc(placeholder)}" autocomplete="off" /></div>
    <p class="hint combo-hint">${esc(hint)}</p>
  </div>`;
}

function tagHtml(name) {
  return `<button type="button" class="tag" data-remove="${esc(name)}">${esc(name)}<span aria-hidden="true">×</span></button>`;
}

function readSelected(combo) {
  try { return JSON.parse(combo.dataset.selected || "[]"); }
  catch (err) { return []; }
}

function writeSelected(combo, names) {
  const selected = uniqueNames(names);
  combo.dataset.selected = JSON.stringify(selected);
  const control = combo.querySelector(".combo-control");
  const search = combo.querySelector("[data-combo-search]");
  control.querySelectorAll(".tag").forEach((tag) => tag.remove());
  selected.forEach((name) => search.insertAdjacentHTML("beforebegin", tagHtml(name)));
  search.placeholder = selected.length ? "Add another" : combo.dataset.placeholder;
  const found = currentCustomer();
  if (found) {
    found.item.kickoff[combo.dataset.combo] = selected;
    save();
  }
}

function writeChipBox(box, names, field) {
  const selected = uniqueNames(names);
  box.dataset.selected = JSON.stringify(selected);
  const control = box.querySelector(".combo-control");
  const search = box.querySelector("[data-unsupported-search], [data-custom-search]");
  control.querySelectorAll(".tag").forEach((tag) => tag.remove());
  selected.forEach((name) => search.insertAdjacentHTML("beforebegin", tagHtml(name)));
  search.placeholder = selected.length ? "Add another" : box.dataset.empty;
  const found = currentCustomer();
  if (found) {
    found.item.kickoff[field] = selected;
    save();
  }
}

function writeUnsupported(box, names) { writeChipBox(box, names, "unsupported"); }
function writeCustom(box, names) { writeChipBox(box, names, "custom"); }

function fieldBox(from, selector) {
  const root = from && from.closest ? from.closest("form, .kickoff, main") : document;
  return (root && root.querySelector ? root.querySelector(selector) : null) || document.querySelector(selector);
}

function toggleChip(box, write, name) {
  if (!box) return;
  const current = readSelected(box);
  const has = current.some((item) => item.toLowerCase() === name.toLowerCase());
  write(box, has ? current.filter((item) => item.toLowerCase() !== name.toLowerCase()) : current.concat(name));
}

function addTypedName(origin, typed) {
  const clean = String(typed || "").replace(/\s+/g, " ").trim();
  if (!clean) return;
  const markets = matchSystems(clean, MARKETPLACES);
  const carriers = matchSystems(clean, CARRIERS);
  const matched = uniqueNames(markets.concat(carriers));
  const root = origin.closest("form, .kickoff, main") || document;
  const custom = matched.filter((name) => requiresCustomization(name));
  const readyMarkets = markets.filter((name) => !requiresCustomization(name) && !TO_DEVELOP.has(name));
  const readyCarriers = carriers.filter((name) => !requiresCustomization(name) && !TO_DEVELOP.has(name));
  const develop = matched.filter((name) => !requiresCustomization(name) && TO_DEVELOP.has(name));
  if (custom.length) {
    const box = fieldBox(origin, "[data-custom]");
    if (box) writeCustom(box, readSelected(box).concat(custom));
  }
  if (readyMarkets.length) {
    const combo = root.querySelector("[data-combo='marketplaces']");
    if (combo) writeSelected(combo, readSelected(combo).concat(readyMarkets));
  }
  if (readyCarriers.length) {
    const combo = root.querySelector("[data-combo='carriers']");
    if (combo) writeSelected(combo, readSelected(combo).concat(readyCarriers));
  }
  const missing = (matched.length ? unsupportedFromText(clean) : [clean]).concat(develop);
  if (missing.length) {
    const box = fieldBox(origin, "[data-unsupported]");
    if (box) writeUnsupported(box, readSelected(box).concat(missing));
  }
}

function renderMenu(combo, query) {
  const catalog = CATALOGS[combo.dataset.combo] || [];
  const selected = readSelected(combo);
  const root = combo.closest("form, .kickoff, main") || document;
  const held = ["[data-unsupported]", "[data-custom]"].flatMap((selector) => {
    const box = root.querySelector(selector);
    return box ? readSelected(box) : [];
  });
  const q = String(query || "").trim().toLowerCase();
  const matches = catalog.filter((item) => !q || item.name.toLowerCase().includes(q) || item.aliases.some((alias) => alias.includes(q)) || item.group.toLowerCase().includes(q));
  const groups = [];
  matches.forEach((item) => {
    let bucket = groups.find((group) => group.name === item.group);
    if (!bucket) {
      bucket = { name: item.group, items: [] };
      groups.push(bucket);
    }
    bucket.items.push(item);
  });
  let html = groups.map((group) => `<div class="combo-group"><p>${esc(group.name)}</p>${group.items.map((item) => {
    const on = selected.concat(held).some((name) => name.toLowerCase() === item.name.toLowerCase());
    const note = [item.note, requiresCustomization(item.name) ? "May require customization" : ""].filter(Boolean).join(" · ");
    return `<button type="button" class="combo-option${on ? " on" : ""}" data-option="${esc(item.name)}" role="option" aria-selected="${on}"><span>${esc(item.name)}${note ? `<small>${esc(note)}</small>` : ""}</span>${on ? "<em>Selected</em>" : ""}</button>`;
  }).join("")}</div>`).join("");
  const exact = catalog.some((item) => item.name.toLowerCase() === q) || selected.some((name) => name.toLowerCase() === q);
  if (q && !exact) html += `<button type="button" class="combo-option" data-add-custom="${esc(query.trim())}">Add “${esc(query.trim())}”</button>`;
  const menu = combo.querySelector("[data-combo-menu]");
  menu.innerHTML = html || `<p class="combo-empty">No matching Logiwa integration.</p>`;
  menu.hidden = false;
  combo.querySelector("[data-combo-search]").setAttribute("aria-expanded", "true");
}

function closeMenus(except) {
  document.querySelectorAll("[data-combo-menu]").forEach((menu) => {
    if (except && menu.closest("[data-combo]") === except) return;
    menu.hidden = true;
    const search = menu.closest("[data-combo]").querySelector("[data-combo-search]");
    if (search) search.setAttribute("aria-expanded", "false");
  });
}

function parseKickoffSheet(workbook) {
  let found = null;
  workbook.SheetNames.some((name) => {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1, defval: "", raw: false });
    found = parseKickoffRows(rows);
    return !!found;
  });
  if (!found) throw new Error("This workbook does not have Project Details, Business Goals, or Integration answers. Use the kickoff sheet with Slide, Topic, Questions, and Answer columns.");
  return found;
}

function headerIdentity(rows) {
  let customerName = "";
  let engineer = "";
  rows.forEach((row) => {
    (row || []).forEach((cell) => {
      const text = String(cell || "").replace(/\s+/g, " ").trim();
      const customer = text.match(/^customer\s*:\s*(.+)$/i);
      const person = text.match(/^engineer\s*:\s*(.+)$/i);
      if (customer) customerName = customer[1].trim();
      if (person) engineer = person[1].trim();
    });
  });
  return { customerName, engineer };
}

function parseKickoffRows(rows) {
  let header = -1;
  let slideCol = -1;
  let topicCol = 0;
  let questionCol = 0;
  let answerCol = 0;
  for (let index = 0; index < Math.min(rows.length, 20); index += 1) {
    const row = (rows[index] || []).map((cell) => String(cell || "").trim().toLowerCase());
    const topic = row.findIndex((cell) => cell === "topic");
    const question = row.findIndex((cell) => cell === "question" || cell === "questions");
    const answer = row.findIndex((cell) => cell === "answer" || cell === "answers");
    if (topic >= 0 && question >= 0 && answer >= 0) {
      header = index;
      slideCol = row.findIndex((cell) => cell === "slide");
      topicCol = topic;
      questionCol = question;
      answerCol = answer;
      break;
    }
  }
  if (header < 0) return null;
  let slide = "";
  let topic = "";
  const details = [];
  const integrations = [];
  const goals = [];
  for (let index = header + 1; index < rows.length; index += 1) {
    const row = rows[index] || [];
    const slideCell = slideCol >= 0 ? String(row[slideCol] || "").trim() : "";
    const topicCell = String(row[topicCol] || "").trim();
    if (slideCell) slide = slideCell;
    if (topicCell) topic = topicCell;
    const question = String(row[questionCol] || "").trim();
    const answer = String(row[answerCol] || "").trim();
    if (!question && !answer) continue;
    if (/business\s*goals?/i.test(slide)) goals.push({ question, answer });
    else if (/project detail/i.test(topic)) details.push({ question, answer });
    else if (/^integration$/i.test(topic)) integrations.push({ question, answer });
  }
  if (!details.length && !integrations.length && !goals.length) return null;
  return { details, integrations, goals, ...headerIdentity(rows) };
}

function customerNameFromFile(filename) {
  let name = String(filename || "").replace(/\.[^.]+$/i, "").replace(/[_]+/g, " ").trim();
  name = name.replace(/\s*-\s*new logiwa\s*$/i, "").trim();
  name = name.replace(/\s*kick-?off questions\s*$/i, "").trim();
  name = name.replace(/^kick-?off questions\s*[-–—]\s*/i, "").trim();
  name = name.replace(/\s*kick-?off\s*$/i, "").trim();
  name = name.replace(/^kick-?off\s*[-–—]\s*/i, "").trim();
  return name.replace(/\s+/g, " ").trim();
}

function applyKickoff(parsed, kickoff) {
  const lines = [];
  parsed.details.forEach(({ question, answer }) => {
    if (!answer) return;
    if (/warehouse/i.test(question)) kickoff.warehouses = answer;
    else if (/api\s*user/i.test(question)) kickoff.apiUsers = answer;
    else if (/\buser/i.test(question)) kickoff.users = answer;
    else if (/client/i.test(question)) kickoff.clients = answer;
    lines.push(`${question}\n${answer}`);
  });
  let storeText = "";
  let carrierText = "";
  parsed.integrations.forEach(({ question, answer }) => {
    if (/endpoint/i.test(question)) {
      if (answer) lines.push(`${question}\n${answer}`);
      return;
    }
    if (/carrier/i.test(question)) {
      carrierText = [carrierText, answer].filter(Boolean).join("\n");
      if (answer) lines.push(`${question}\n${answer}`);
      return;
    }
    if (/store|shop|marketplace|channel|integrat/i.test(question)) {
      storeText = [storeText, answer].filter(Boolean).join("\n");
      if (answer) lines.push(`${question}\n${answer}`);
    }
  });
  if (storeText) kickoff.marketplaces = matchSystems(storeText, MARKETPLACES);
  if (carrierText) kickoff.carriers = matchSystems(carrierText, CARRIERS);
  if (storeText || carrierText) {
    const split = partitionIntegrations(
      kickoff.marketplaces,
      kickoff.carriers,
      unsupportedFromText([storeText, carrierText].filter(Boolean).join("\n")),
      kickoff.developing,
      kickoff.custom
    );
    kickoff.marketplaces = split.marketplaces;
    kickoff.carriers = split.carriers;
    kickoff.custom = split.custom;
    kickoff.unsupported = split.unsupported;
    delete kickoff.developing;
  }
  const goalLines = [];
  (parsed.goals || []).forEach(({ question, answer }) => {
    if (!answer) return;
    if (/orders?.{0,20}(a day|per day|daily)|processed a day/i.test(question) && !String(kickoff.volume || "").trim()) {
      kickoff.volume = /^\d[\d,]*$/.test(answer.trim()) ? `${answer.trim()} orders/day` : answer.trim();
    }
    goalLines.push(`${question}\n${answer}`);
  });
  if (goalLines.length) lines.push(`Business Goals\n${goalLines.join("\n\n")}`);
  if (lines.length) {
    const marker = "Imported from kickoff Excel";
    const before = String(kickoff.notes || "").split(marker)[0].trim();
    kickoff.notes = `${before ? `${before}\n\n` : ""}${marker}\n${lines.join("\n\n")}`;
  }
  const parts = [];
  if (kickoff.warehouses) parts.push(countPhrase(kickoff.warehouses, "warehouse", "warehouses"));
  if (kickoff.users) parts.push(countPhrase(kickoff.users, "user", "users"));
  if (kickoff.apiUsers) parts.push(countPhrase(kickoff.apiUsers, "API user", "API users"));
  if (kickoff.clients) parts.push("clients captured");
  if (kickoff.marketplaces.length) parts.push(`marketplaces: ${kickoff.marketplaces.join(", ")}`);
  if (kickoff.carriers.length) parts.push(`carriers: ${kickoff.carriers.join(", ")}`);
  if (kickoff.custom && kickoff.custom.length) parts.push(`may require customization: ${kickoff.custom.join(", ")}`);
  if (kickoff.unsupported && kickoff.unsupported.length) parts.push(`not pre-built: ${kickoff.unsupported.join(", ")}`);
  if ((parsed.goals || []).some((item) => item.answer)) parts.push("business goals captured");
  if (kickoff.volume) parts.push(`volume: ${kickoff.volume}`);
  return parts.length ? `Imported kickoff · ${parts.join(" · ")}` : "No Project Details, Business Goals, or Integration answers were found in that workbook.";
}

function countPhrase(answer, singular, plural) {
  const text = String(answer || "").trim();
  if (/^\d+$/.test(text)) return `${text} ${Number(text) === 1 ? singular : plural}`;
  return `${plural}: ${text}`;
}

function readKickoffFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const status = () => document.querySelector("[data-import-status]");
    try {
      if (typeof XLSX === "undefined") throw new Error("The Excel reader did not load. Refresh the page and try again.");
      const workbook = XLSX.read(new Uint8Array(reader.result), { type: "array" });
      const parsed = parseKickoffSheet(workbook);
      const named = customerNameFromFile(file.name) || parsed.customerName || "";
      const found = currentCustomer();
      if (found) {
        const appliedName = named && !String(found.item.name || "").trim() ? (found.item.name = named) : "";
        if (parsed.engineer && !String(found.item.engineer || "").trim()) found.item.engineer = parsed.engineer;
        const summary = applyKickoff(parsed, found.item.kickoff);
        save();
        render();
        const line = status();
        if (line) line.textContent = appliedName ? `${summary} · customer: ${appliedName}` : summary;
        return;
      }
      const draft = { warehouses: "", users: "", clients: "", apiUsers: "", volume: "", notes: "", marketplaces: [], carriers: [], custom: [], unsupported: [] };
      const form = document.getElementById("new-form");
      if (form) draft.notes = String(new FormData(form).get("notes") || "");
      const summary = applyKickoff(parsed, draft);
      const nameInput = form && form.querySelector('[name="name"]');
      const appliedName = nameInput && named && !String(nameInput.value || "").trim() ? (nameInput.value = named) : "";
      const engineerInput = form && form.querySelector('[name="engineer"]');
      if (engineerInput && parsed.engineer && !String(engineerInput.value || "").trim()) engineerInput.value = parsed.engineer;
      ["warehouses", "users", "clients", "apiUsers", "volume", "notes"].forEach((key) => {
        const input = form && form.querySelector(`[name="${key}"]`);
        if (input) input.value = draft[key] || "";
      });
      ["marketplaces", "carriers"].forEach((key) => {
        const combo = form && form.querySelector(`[data-combo="${key}"]`);
        if (combo) writeSelected(combo, draft[key]);
      });
      const custom = form && form.querySelector("[data-custom]");
      if (custom) writeCustom(custom, draft.custom || []);
      const missing = form && form.querySelector("[data-unsupported]");
      if (missing) writeUnsupported(missing, draft.unsupported || []);
      const line = status();
      if (line) line.textContent = appliedName ? `${summary} · customer: ${appliedName}` : summary;
    } catch (err) {
      const line = status();
      if (line) line.textContent = err.message || "That workbook could not be read.";
    }
  };
  reader.readAsArrayBuffer(file);
}

function tab(item, phase, active) {
  const result = evaluate(item, phase.id);
  const label = result.complete ? `${fmt(result.score)} · ${BANDS[result.band].label}` : result.answered.length ? `${result.answered.length}/${result.applicable.length} answered` : "Not started";
  return `<a class="tab" data-phase="${phase.id}" href="#/customer/${encodeURIComponent(item.id)}?phase=${phase.id}" aria-selected="${phase.id === active}"><b>${esc(phase.name)}</b><span class="meta">${label}</span></a>`;
}

function stickyFormTab(item, active) {
  return `<a class="tab" data-phase="sticky-form" href="#/customer/${encodeURIComponent(item.id)}?phase=sticky-form" aria-selected="${active}"><b>Sticky form</b><span class="meta">${esc(stickyFormStatus(item))}</span></a>`;
}

function questionsHtml(item, phase) {
  let category = "";
  return phase.metrics.map((metric) => {
    const answer = answerFor(item, phase.id, metric.id);
    const heading = metric.category !== category ? `<h2 class="category">${esc(metric.category)}</h2>` : "";
    category = metric.category;
    const baseline = metric.id === "volume" ? `<p class="hint" data-baseline>${item.kickoff.volume ? `Kickoff / contract baseline: ${esc(item.kickoff.volume)}` : "Add the expected volume in the kickoff record before judging this match."}</p>` : "";
    const suggestion = metric.helper ? suggest(metric, answer.raw).message : "";
    return `${heading}<article class="q">
      <div class="q-top"><div><h3>${esc(metric.name)}</h3><p class="method">${esc(metric.method)}</p></div><span class="pill">${pct(metric.weight)} · ${esc(metric.source)}</span></div>
      ${baseline}
      <div class="choices">${metric.anchors.map(([score, text]) => `<button type="button" class="choice s${score}" data-action="score" data-metric="${metric.id}" data-score="${score}" aria-pressed="${answer.score === score && !answer.na}" ${answer.na ? "disabled" : ""}><small>${score}</small>${esc(text)}</button>`).join("")}</div>
      ${metric.optional ? `<label class="na"><input type="checkbox" data-action="na" data-metric="${metric.id}" ${answer.na ? "checked" : ""}/> Not applicable for this customer</label>` : ""}
      <div class="q-foot${metric.helper ? " with-helper" : ""}">
        ${metric.helper ? `<label class="block">${esc(metric.helperLabel)}<input class="text" data-raw="${metric.id}" value="${esc(answer.raw)}" inputmode="decimal" /></label>` : ""}
        <label class="block">Note<textarea data-note="${metric.id}">${esc(answer.note)}</textarea></label>
      </div>
      <p class="hint" data-hint="${metric.id}">${esc(suggestion)}</p>
    </article>`;
  }).join("");
}

function planDrivers(phase, result) {
  return result.drivers.slice().sort((a, b) => {
    const drag = (entry) => (5 - entry.answer.score) * entry.metric.weight;
    const boost = (entry) => phase.id === "sticky" && entry.metric.id === "sev1" && entry.answer.score === 1 ? 0.01 : 0;
    return drag(b) + boost(b) - (drag(a) + boost(a));
  }).slice(0, 4);
}

function planLead(phase, result) {
  const leads = {
    early: {
      high: "It may help to pause and talk through the open concerns before the project moves ahead.",
      medium: "Implementation can continue, with a little extra care for the notes below.",
      low: "Implementation looks ready to move ahead."
    },
    activation: {
      high: "Go-live may feel easier if the team spends a little time on the notes below first.",
      medium: "Activation can continue. The notes below are light follow-ups.",
      low: "Activation is in a good place."
    },
    sticky: {
      high: "A handoff conversation can wait until the notes below feel a little more settled.",
      medium: "A handoff looks possible, with a short follow-up on the notes below.",
      low: "This account looks ready to leave implementation."
    }
  };
  return leads[phase.id][result.band];
}

function evidencePhrase(metric, answer) {
  const raw = String(answer.raw ?? "").trim();
  if (raw === "" || Number.isNaN(Number(raw))) return "";
  const n = Number(raw);
  if (metric.id === "sev1") return n === 1 ? "There is 1 open Sev1 ticket." : `There are ${n} open Sev1 tickets.`;
  if (metric.id === "sev2") return `There are ${n} open Sev2 tickets.`;
  if (metric.id === "volume") return `It currently matches ${n}% of the baseline.`;
  if (metric.id === "integration") return `The health score entered is ${n}.`;
  if (metric.id === "training") return n === 1 ? "One session was missed or moved." : `${n} sessions were missed or moved.`;
  if (metric.id === "uat") return `${n}% of test cases are verified.`;
  if (metric.helper === "weeks") return `Go-live has moved ${n} weeks.`;
  if (metric.id === "nps") return `The survey rating entered is ${n}.`;
  return "";
}

function planStep(metric, answer, item) {
  const low = answer.score === 1;
  const evidence = evidencePhrase(metric, answer);
  const join = (text) => evidence ? `${text} ${evidence}` : text;
  const known = {
    sev1: low
      ? ["It would help to look through the open Sev1 tickets with support before a handoff conversation.", "The open Sev1 tickets have been worked through, and this phase can be scored again."]
      : ["A short look at the remaining Sev1 tickets would make the next conversation easier.", "The remaining Sev1 tickets have an owner and a next check-in."],
    sev2: low
      ? ["The Sev2 queue is a bit full. Support can thin it out once the more pressing tickets feel settled.", "The Sev2 count is closer to a comfortable level."]
      : ["The Sev2 count is worth a glance so it does not grow.", "Someone has had a look and the queue feels manageable."],
    volume: low
      ? [`Shipment volume is under the kickoff baseline${item.kickoff.volume ? ` (${item.kickoff.volume})` : ""}. It may help to confirm that this is still the right comparison.`, "The baseline is confirmed, and the customer is comfortable with the gap."]
      : ["Volume is partway toward the baseline. A short check can confirm the gap is expected.", "The customer has confirmed whether the gap is expected."],
    integration: low
      ? ["Integration health is on the low side. Naming the flow that is struggling would make the next conversation easier.", "The struggling flow is named in the phase note."]
      : ["Integration health has some room to improve. A note on which flow needs attention is enough for now.", "The flow to watch is named in the phase note."],
    payment: low
      ? ["Payments may need a closer, gentler follow-up. The invoice detail can stay in Maxio.", "The follow-up is recorded, or the linked subscription has no past-due invoice."]
      : ["There looks to be a small payment follow-up. The invoice detail can stay in Maxio.", "The follow-up is recorded, or the delay has a note the team is comfortable with."],
    training: low
      ? ["Training has been hard to keep on the calendar. A makeup session, when the team is ready, would help.", "A makeup session is on the calendar, or the team has agreed to pause training."]
      : ["A few training sessions moved. Catching one of them up would be plenty.", "One of the moved sessions has a new time, or the team is comfortable moving on."],
    uat: low
      ? ["Testing is still early. Inviting the customer to verify a few more cases would help.", "A few more cases are verified, and the customer knows what is left."]
      : ["Testing is underway. A little more verified coverage would round it out.", "The customer is comfortable with how much has been verified."],
    ontime: low
      ? ["Go-live has moved quite a bit. A fresh date the customer is comfortable with would help.", "A new date is agreed, and it still feels realistic."]
      : ["Go-live has shifted a little. Agreeing a date everyone can live with is a gentle next step.", "The date is agreed."]
    ,
    nps: low
      ? ["The survey rating is on the low side. It may help to ask what would make the experience easier, when the customer is ready.", "The customer has had a chance to say what would help."]
      : ["The survey rating is in the middle. A short conversation about what would make the experience easier could help.", "The team has heard what would make the experience easier."]
  };
  const pair = known[metric.id];
  if (pair) return { action: join(pair[0]), done: pair[1] };
  const name = metric.name.toLowerCase();
  return low
    ? { action: `It may help to spend a little time on ${name} before moving on.`, done: `${metric.name} has had a conversation, and the note says what was agreed.` }
    : { action: `${metric.name} could use a light follow-up when there is a moment.`, done: `${metric.name} has a short note, or the team is comfortable leaving it.` };
}

function planTiming(index, step, drivers) {
  if (index === 0) return "Suggested first";
  const sev1Open = drivers.some((entry) => entry.metric.id === "sev1" && entry.answer.score === 1);
  if (step.metric.id === "sev2" && sev1Open) return "Once Sev1 feels settled";
  return step.answer.score === 1 ? "This week" : "When there is a moment";
}

function planHtml(item, phase, result) {
  if (!result.complete) {
    return `<h2>Suggested plan</h2><p class="plan-lead">A suggested plan appears once every applicable answer is in. Nothing here is firmed up until then.</p>`;
  }
  const drivers = planDrivers(phase, result);
  const steps = drivers.map((entry, index) => {
    const copy = planStep(entry.metric, entry.answer, item);
    const owner = entry.metric.id === "sev1" || entry.metric.id === "sev2" ? "Implementation engineer, with support" : "Implementation engineer";
    return `<li><p class="meta">${esc(planTiming(index, entry, drivers))} · ${esc(owner)}</p><p>${esc(copy.action)}</p><p class="hint">Feels settled when ${esc(copy.done.charAt(0).toLowerCase() + copy.done.slice(1))}</p></li>`;
  }).join("");
  const quiet = drivers.length ? "" : `<p class="hint">Nothing stands out as a follow-up.</p>`;
  const payment = result.drivers.find((entry) => entry.metric.id === "payment");
  const paymentNote = payment && !drivers.some((entry) => entry.metric.id === "payment")
    ? `<p class="hint">${esc(payment.answer.score === 1 ? "Payments may also need a closer follow-up. The invoice detail can stay in Maxio." : "There is also a small payment follow-up. The invoice detail can stay in Maxio.")}</p>`
    : "";
  const next = phase.id === "sticky" && result.complete ? `<p class="hint">The next step after Pre-Sticky is the Sticky form.</p>` : "";
  return `<h2>Suggested plan</h2><p class="plan-lead">${esc(planLead(phase, result))}</p>${steps ? `<ol class="plan-steps">${steps}</ol>` : ""}${quiet}${paymentNote}${next}<p class="hint">Suggestions from this phase’s scores. The engineer can take them in any order.</p>`;
}

function railHtml(item, phase, result) {
  const cls = result.band || "";
  const headline = result.score == null ? "—" : fmt(result.score);
  const status = result.complete ? BANDS[result.band].label : result.answered.length ? "In progress" : "Not started";
  const drivers = result.drivers.slice(0, 3).map((item) => `<div class="driver"><span>${esc(item.metric.name)}</span><b>${item.answer.score}</b></div>`).join("");
  return `
    <p class="eyebrow">${esc(phase.scoreName)}</p>
    <div class="big-score">${headline}</div>
    <span class="pill ${cls}">${status}</span>
    <p class="meta">${result.answered.length} of ${result.applicable.length} applicable metrics answered${result.items.some((entry) => entry.answer.na) ? " · remaining weights scaled to 100%" : ""}</p>
    <h2>Lowest drivers</h2>
    ${drivers || `<p class="muted">Scores of 1 or 3 will appear here.</p>`}
    <p class="band-copy">${result.complete ? esc(BANDS[result.band].text) : "The risk band appears when every applicable metric has an answer. Blank answers stay blank; they do not become zero."}</p>
    <div class="actions"><button class="btn" data-action="export-one">Export this customer</button></div>`;
}

function shell(lede) {
  return `<header class="app-header"><div class="header-inner header-row"><div><p class="eyebrow">Professional Services</p><h1>Onboarding Health Score</h1><p class="lede">${esc(lede)}</p></div><div class="header-actions"><a class="btn" href="#/">Dashboard</a><a class="btn primary" href="#/new">New customer</a><button class="btn" data-action="export">Export</button><label class="btn file-btn">Import JSON<input id="import-file" type="file" accept="application/json" /></label></div></div></header>`;
}

function touch(item, phaseId) {
  item.phases[phaseId].updatedAt = new Date().toISOString();
  save();
}

function paint(item, phase) {
  if (!phase) {
    paintSticky(item);
    return;
  }
  const result = evaluate(item, phase.id);
  document.getElementById("rail").innerHTML = railHtml(item, phase, result);
  const plan = document.getElementById("plan");
  if (plan) plan.innerHTML = planHtml(item, phase, result);
  const updated = document.getElementById("updated-line");
  if (updated) updated.textContent = `${item.sample ? "Sample record · " : ""}Last change ${when(item.phases[phase.id].updatedAt)}`;
  refreshTabs(item);
}

function paintSticky(item) {
  const plan = document.getElementById("plan");
  if (plan) plan.innerHTML = stickyPlanHtml(item);
  const rail = document.getElementById("rail");
  if (rail) rail.innerHTML = stickyRailHtml(item);
  const updated = document.getElementById("updated-line");
  if (updated) updated.textContent = `${item.sample ? "Sample record · " : ""}Last change ${when(item.stickyForm.updatedAt)}`;
  refreshTabs(item);
}

function refreshTabs(item) {
  document.querySelectorAll(".tab").forEach((tabEl) => {
    const id = tabEl.dataset.phase;
    const meta = tabEl.querySelector(".meta");
    if (!meta) return;
    if (id === "sticky-form") {
      meta.textContent = stickyFormStatus(item);
      return;
    }
    const resultForTab = evaluate(item, id);
    meta.textContent = resultForTab.complete ? `${fmt(resultForTab.score)} · ${BANDS[resultForTab.band].label}` : resultForTab.answered.length ? `${resultForTab.answered.length}/${resultForTab.applicable.length} answered` : "Not started";
  });
}

function currentCustomer() {
  const current = route();
  if (current.name !== "customer") return null;
  const item = customerById(current.id);
  if (!item) return null;
  if (current.phase === "sticky-form") return { item, phase: null, stickyForm: true };
  const phase = phaseById(current.phase) || PHASES[0];
  return { item, phase, stickyForm: false };
}

document.body.addEventListener("click", (event) => {
  const searchField = event.target.closest("[data-combo-search]");
  if (searchField) renderMenu(searchField.closest("[data-combo]"), searchField.value);
  const option = event.target.closest("[data-option], [data-add-custom], [data-remove]");
  if (option) {
    event.preventDefault();
    const chip = option.closest("[data-unsupported], [data-custom]");
    if (chip) {
      const write = chip.hasAttribute("data-custom") ? writeCustom : writeUnsupported;
      write(chip, readSelected(chip).filter((name) => name !== option.dataset.remove));
      return;
    }
    const combo = option.closest("[data-combo]");
    const selected = readSelected(combo);
    if (option.dataset.remove) writeSelected(combo, selected.filter((name) => name !== option.dataset.remove));
    if (option.dataset.option) {
      const name = option.dataset.option;
      if (requiresCustomization(name)) toggleChip(fieldBox(combo, "[data-custom]"), writeCustom, name);
      else if (TO_DEVELOP.has(name)) toggleChip(fieldBox(combo, "[data-unsupported]"), writeUnsupported, name);
      else {
        const has = selected.some((item) => item.toLowerCase() === name.toLowerCase());
        writeSelected(combo, has ? selected.filter((item) => item.toLowerCase() !== name.toLowerCase()) : selected.concat(name));
      }
    }
    if (option.dataset.addCustom) addTypedName(combo, option.dataset.addCustom);
    const search = combo.querySelector("[data-combo-search]");
    if (option.dataset.option || option.dataset.addCustom) search.value = "";
    renderMenu(combo, search.value);
    search.focus();
    return;
  }
  if (!event.target.closest("[data-combo]")) closeMenus();
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "open") location.hash = `#/customer/${encodeURIComponent(target.dataset.id)}`;
  if (action === "filter") { ui.risk = target.dataset.risk; render(); }
  if (action === "clear-samples") { state.customers = state.customers.filter((item) => !item.sample); save(); render(); }
  if (action === "delete") {
    const item = customerById(target.dataset.id);
    if (item && confirm(`Delete ${item.name}?`)) {
      state.customers = state.customers.filter((customer) => customer.id !== item.id);
      save();
      location.hash = "#/";
    }
  }
  if (action === "export") download(state, "onboarding-health-scores.json");
  if (action === "export-one") {
    const found = currentCustomer();
    if (found) download(found.item, `${slug(found.item.name)}.json`);
  }
  if (action === "score") {
    const found = currentCustomer();
    if (!found) return;
    const answer = answerFor(found.item, found.phase.id, target.dataset.metric);
    answer.score = Number(target.dataset.score);
    answer.na = false;
    answer.manual = true;
    touch(found.item, found.phase.id);
    target.closest(".choices").querySelectorAll(".choice").forEach((choice) => choice.setAttribute("aria-pressed", String(choice === target)));
    const checkbox = target.closest(".q").querySelector("[data-action='na']");
    if (checkbox) checkbox.checked = false;
    target.closest(".q").querySelectorAll(".choice").forEach((choice) => { choice.disabled = false; });
    paint(found.item, found.phase);
  }
  if (action === "na") {
    const found = currentCustomer();
    if (!found) return;
    const answer = answerFor(found.item, found.phase.id, target.dataset.metric);
    answer.na = target.checked;
    if (target.checked) answer.score = null;
    touch(found.item, found.phase.id);
    target.closest(".q").querySelectorAll(".choice").forEach((choice) => {
      choice.disabled = target.checked;
      choice.setAttribute("aria-pressed", "false");
    });
    paint(found.item, found.phase);
  }
});

document.body.addEventListener("keydown", (event) => {
  const chipSearch = event.target.closest("[data-unsupported], [data-custom]");
  if (chipSearch && event.target.matches && event.target.matches("[data-unsupported-search], [data-custom-search]")) {
    const write = chipSearch.hasAttribute("data-custom") ? writeCustom : writeUnsupported;
    if (event.key === "Enter") {
      event.preventDefault();
      addTypedName(chipSearch, event.target.value);
      event.target.value = "";
    }
    if (event.key === "Backspace" && !event.target.value) {
      const selected = readSelected(chipSearch);
      if (selected.length) write(chipSearch, selected.slice(0, -1));
    }
    return;
  }
  if (!event.target.matches || !event.target.matches("[data-combo-search]")) return;
  const combo = event.target.closest("[data-combo]");
  if (event.key === "Escape") {
    closeMenus();
    return;
  }
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const options = [...combo.querySelectorAll(".combo-option")];
    if (!options.length) return;
    const index = options.findIndex((item) => item.classList.contains("highlight"));
    const next = index < 0 ? (event.key === "ArrowDown" ? 0 : options.length - 1) : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
    options.forEach((item) => item.classList.remove("highlight"));
    options[next].classList.add("highlight");
    options[next].scrollIntoView({ block: "nearest" });
  }
  if (event.key === "Enter") {
    event.preventDefault();
    const highlighted = combo.querySelector(".combo-option.highlight") || combo.querySelector(".combo-option");
    if (highlighted) highlighted.click();
  }
  if (event.key === "Backspace" && !event.target.value) {
    const selected = readSelected(combo);
    if (selected.length) writeSelected(combo, selected.slice(0, -1));
  }
});

document.body.addEventListener("focusin", (event) => {
  if (!event.target.matches || !event.target.matches("[data-combo-search]")) return;
  closeMenus(event.target.closest("[data-combo]"));
  renderMenu(event.target.closest("[data-combo]"), event.target.value);
});

document.body.addEventListener("input", (event) => {
  const el = event.target;
  if (el.matches && el.matches("[data-combo-search]")) {
    renderMenu(el.closest("[data-combo]"), el.value);
    return;
  }
  if (el.id === "search") {
    ui.q = el.value;
    render();
    const search = document.getElementById("search");
    if (search) { search.focus(); search.setSelectionRange(el.value.length, el.value.length); }
    return;
  }
  const found = currentCustomer();
  if (!found) return;
  if (el.dataset.field) {
    found.item[el.dataset.field] = el.value;
    save();
  }
  if (el.dataset.kickoff) {
    found.item.kickoff[el.dataset.kickoff] = el.value;
    save();
    if (el.dataset.kickoff === "volume") {
      const hint = document.querySelector("[data-baseline]");
      if (hint) hint.textContent = el.value ? `Kickoff / contract baseline: ${el.value}` : "Add the expected volume in the kickoff record before judging this match.";
    }
  }
  if (el.dataset.sticky) {
    saveStickyField(found.item, el.dataset.sticky, el.value);
    return;
  }
  if (el.dataset.note) {
    if (!found.phase) return;
    answerFor(found.item, found.phase.id, el.dataset.note).note = el.value;
    touch(found.item, found.phase.id);
  }
  if (el.dataset.raw) {
    const metric = found.phase.metrics.find((item) => item.id === el.dataset.raw);
    const answer = answerFor(found.item, found.phase.id, metric.id);
    answer.raw = el.value;
    const suggested = suggest(metric, el.value);
    if (suggested.score) {
      answer.score = suggested.score;
      answer.na = false;
      el.closest(".q").querySelectorAll(".choice").forEach((choice) => {
        choice.disabled = false;
        choice.setAttribute("aria-pressed", choice.dataset.score === String(suggested.score));
      });
    }
    const hint = el.closest(".q").querySelector("[data-hint]");
    hint.textContent = suggested.message;
    touch(found.item, found.phase.id);
    paint(found.item, found.phase);
  }
});

document.body.addEventListener("submit", (event) => {
  if (event.target.id !== "new-form") return;
  event.preventDefault();
  const data = new FormData(event.target);
  const item = customer({
    name: String(data.get("name") || "").trim(),
    engineer: String(data.get("engineer") || "").trim(),
    kickoff: {
      warehouses: String(data.get("warehouses") || ""),
      users: String(data.get("users") || ""),
      clients: String(data.get("clients") || ""),
      apiUsers: String(data.get("apiUsers") || ""),
      volume: String(data.get("volume") || ""),
      notes: String(data.get("notes") || ""),
      marketplaces: readSelected(event.target.querySelector("[data-combo='marketplaces']")),
      carriers: readSelected(event.target.querySelector("[data-combo='carriers']")),
      custom: readSelected(event.target.querySelector("[data-custom]")),
      unsupported: readSelected(event.target.querySelector("[data-unsupported]"))
    }
  });
  if (!item.name) return;
  item.phases.early.assessor = item.engineer;
  state.customers.unshift(item);
  save();
  location.hash = `#/customer/${encodeURIComponent(item.id)}?phase=early`;
});

function saveStickyField(item, key, value) {
  item.stickyForm[key] = value;
  item.stickyForm.updatedAt = new Date().toISOString();
  save();
  paintSticky(item);
}

document.body.addEventListener("change", (event) => {
  if (event.target.matches && event.target.matches("[data-sticky]")) {
    const found = currentCustomer();
    if (!found) return;
    saveStickyField(found.item, event.target.dataset.sticky, event.target.value);
    return;
  }
  if (event.target.matches && event.target.matches("[data-sticky-file]")) {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    if (file) readStickyFile(file);
    return;
  }
  if (event.target.matches && event.target.matches("[data-kickoff-file]")) {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    if (file) readKickoffFile(file);
    return;
  }
  if (event.target.id !== "import-file") return;
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const customers = Array.isArray(data) ? data : data.customers;
      if (Array.isArray(customers)) state = { customers };
      else if (data && data.name && data.phases) state.customers.unshift(data);
      else throw new Error("missing customers");
      save();
      location.hash = "#/";
      render();
    } catch (err) {
      alert("That file is not an onboarding health export.");
    }
  };
  reader.readAsText(file);
});

function slug(name) { return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "customer"; }
function download(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

window.addEventListener("hashchange", () => render(true));
render(true);

const atlas = samples()[0];
const atlasScore = evaluate(atlas, "early").score;
if (Math.abs(atlasScore - 4.8) > 0.001) console.error("Early churn sample should score 4.8", atlasScore);
