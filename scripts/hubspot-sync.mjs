// Reads HubSpot companies, open Sev1/Sev2 tickets, and the latest NPS rating per company,
// then writes site/hubspot-snapshot.js. Runs in GitHub Actions with HUBSPOT_API_KEY.
// Only company name, Sev1 count, Sev2 count, and NPS are written. No ticket subjects or contact details.

import { mkdir, writeFile } from "node:fs/promises";

const TOKEN = process.env.HUBSPOT_API_KEY;
if (!TOKEN) {
  console.error("HUBSPOT_API_KEY is not set.");
  process.exit(1);
}

const BASE = "https://api.hubapi.com";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function hs(method, path, body) {
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: body ? JSON.stringify(body) : undefined
    });
    if (res.status === 429 || res.status >= 500) {
      await sleep(attempt * 5000);
      continue;
    }
    if (!res.ok) {
      const text = (await res.text()).slice(0, 200);
      throw new Error(`HubSpot ${res.status} on ${path}: ${text}`);
    }
    return res.json();
  }
  throw new Error(`HubSpot did not respond on ${path}`);
}

async function allCompanies() {
  const out = [];
  let after;
  do {
    const query = new URLSearchParams({ limit: "100", properties: "name" });
    if (after) query.set("after", after);
    const page = await hs("GET", `/crm/v3/objects/companies?${query}`);
    out.push(...page.results);
    after = page.paging?.next?.after;
  } while (after);
  return out;
}

async function searchAll(objectType, filterGroups, properties) {
  const out = [];
  let after;
  do {
    const body = { filterGroups, properties, limit: 100 };
    if (after) body.after = after;
    const page = await hs("POST", `/crm/v3/objects/${objectType}/search`, body);
    out.push(...page.results);
    after = page.paging?.next?.after;
  } while (after);
  if (out.length >= 10000) throw new Error(`${objectType} search reached the 10,000 result limit.`);
  return out;
}

async function associationsOf(fromType, toType, ids) {
  const map = new Map();
  for (let i = 0; i < ids.length; i += 1000) {
    const inputs = ids.slice(i, i + 1000).map((id) => ({ id: String(id) }));
    const page = await hs("POST", `/crm/v4/associations/${fromType}/${toType}/batch/read`, { inputs });
    for (const row of page.results || []) {
      map.set(String(row.from.id), (row.to || []).map((link) => String(link.toObjectId)));
    }
  }
  return map;
}

const companies = await allCompanies();
const rows = new Map();
const ensure = (id) => {
  if (!rows.has(id)) rows.set(id, { sev1: 0, sev2: 0, nps: null, npsDate: "" });
  return rows.get(id);
};

const tickets = await searchAll(
  "tickets",
  [{ filters: [
    { propertyName: "severity", operator: "IN", values: ["Sev1", "Sev2"] },
    { propertyName: "closed_date", operator: "NOT_HAS_PROPERTY" }
  ] }],
  ["severity"]
);
const ticketCompanies = await associationsOf("tickets", "companies", tickets.map((ticket) => ticket.id));
for (const ticket of tickets) {
  const severity = ticket.properties.severity;
  for (const companyId of ticketCompanies.get(String(ticket.id)) || []) {
    const row = ensure(companyId);
    if (severity === "Sev1") row.sev1 += 1;
    if (severity === "Sev2") row.sev2 += 1;
  }
}

const contacts = await searchAll(
  "contacts",
  [{ filters: [{ propertyName: "hs_feedback_last_nps_rating_number", operator: "HAS_PROPERTY" }] }],
  ["hs_feedback_last_nps_rating_number", "hs_feedback_last_survey_date"]
);
const contactCompanies = await associationsOf("contacts", "companies", contacts.map((contact) => contact.id));
for (const contact of contacts) {
  const rating = Number(contact.properties.hs_feedback_last_nps_rating_number);
  const date = contact.properties.hs_feedback_last_survey_date || "";
  for (const companyId of contactCompanies.get(String(contact.id)) || []) {
    const row = ensure(companyId);
    if (!row.npsDate || date > row.npsDate) {
      row.nps = rating;
      row.npsDate = date;
    }
  }
}

const list = [];
for (const company of companies) {
  const name = String(company.properties.name || "").trim();
  if (!name) continue;
  const row = rows.get(String(company.id)) || { sev1: 0, sev2: 0, nps: null, npsDate: "" };
  list.push({
    name,
    sev1: row.sev1,
    sev2: row.sev2,
    nps: row.nps,
    npsDate: row.npsDate ? row.npsDate.slice(0, 10) : ""
  });
}

const snapshot = { updatedAt: new Date().toISOString(), companies: list };
await mkdir("site", { recursive: true });
await writeFile("site/hubspot-snapshot.js", `window.HUBSPOT_SNAPSHOT = ${JSON.stringify(snapshot)};\n`);
console.log(`Wrote ${list.length} companies, ${tickets.length} open Sev1/Sev2 tickets, ${contacts.length} contacts with NPS.`);
