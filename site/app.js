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

function normalizeCustomer(item) {
  item.kickoff = item.kickoff || {};
  const kickoff = item.kickoff;
  ["date", "goLive", "warehouses", "users", "clients", "apiUsers", "volume", "notes"].forEach((key) => {
    if (kickoff[key] == null) kickoff[key] = "";
  });
  if (kickoff.integrations == null) kickoff.integrations = "";
  const marketsBlank = !canonicalizeList(kickoff.marketplaces, MARKETPLACES).length && !String(kickoff.marketplaces || "").trim();
  const carriersBlank = !canonicalizeList(kickoff.carriers, CARRIERS).length && !String(kickoff.carriers || "").trim();
  if (marketsBlank && carriersBlank && String(kickoff.integrations || "").trim()) {
    kickoff.marketplaces = matchSystems(kickoff.integrations, MARKETPLACES);
    kickoff.carriers = matchSystems(kickoff.integrations, CARRIERS);
    if (kickoff.marketplaces.length || kickoff.carriers.length) kickoff.integrations = "";
  } else {
    kickoff.marketplaces = canonicalizeList(kickoff.marketplaces, MARKETPLACES);
    kickoff.carriers = canonicalizeList(kickoff.carriers, CARRIERS);
  }
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
      date: "", goLive: "", warehouses: "", users: "", clients: "", apiUsers: "", volume: "", marketplaces: [], carriers: [], integrations: "", notes: "",
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
        ${comboHtml("marketplaces", "Marketplace integrations", [], "Search Shopify, Amazon, SPS, NetSuite")}
        ${comboHtml("carriers", "Carrier integrations", [], "Search UPS, FedEx, USPS, ShipStation")}
        <label>Kickoff notes<textarea name="notes"></textarea></label>
        <button class="btn primary" type="submit">Create and start Early Churn</button>
      </form>
    </main>`;
}

function customerView(current) {
  const item = customerById(current.id);
  if (!item) return `${shell("")}<main class="wrap"><a class="back" href="#/">Back</a><div class="card empty"><h2>Customer not found</h2></div></main>`;
  const phase = phaseById(current.phase) || PHASES[0];
  const result = evaluate(item, phase.id);
  return `
    ${shell(phase.purpose)}
    <main class="wrap">
      <div class="page-head">
        <div>
          <a class="back" href="#/">All customers</a>
          <input class="name-input" data-field="name" value="${esc(item.name)}" aria-label="Customer name" />
          <p class="meta" id="updated-line">${item.sample ? "Sample record · " : ""}Last change ${esc(when(item.phases[phase.id].updatedAt))}</p>
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
          ${comboHtml("marketplaces", "Marketplace integrations", item.kickoff.marketplaces, "Search Shopify, Amazon, SPS, NetSuite")}
          ${comboHtml("carriers", "Carrier integrations", item.kickoff.carriers, "Search UPS, FedEx, USPS, ShipStation")}
        </div>
        ${item.kickoff.integrations ? `<p class="hint span-3">Earlier combined list: ${esc(item.kickoff.integrations)}. Move each name into marketplace or carrier above.</p>` : ""}
        <label class="span-3">Kickoff notes<textarea data-kickoff="notes">${esc(item.kickoff.notes)}</textarea></label>
      </section>
      <nav class="tabs">${PHASES.map((itemPhase) => tab(item, itemPhase, phase.id)).join("")}</nav>
      <section class="layout">
        <div class="questions" id="questions">${questionsHtml(item, phase)}</div>
        <aside class="rail" id="rail">${railHtml(item, phase, result)}</aside>
      </section>
    </main>`;
}

function field(label, key, value, type, kickoff) {
  const attr = kickoff ? `data-kickoff="${key}"` : `data-field="${key}"`;
  return `<label>${esc(label)}<input class="text" type="${type}" ${attr} value="${esc(value)}" /></label>`;
}

function kickoffImportRow() {
  return `<div class="import-row"><label class="btn file-btn">Import kickoff Excel<input type="file" accept=".xlsx,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" data-kickoff-file /></label><p class="hint" data-import-status>Reads the Project Details and Integration sections of the kickoff workbook.</p></div>`;
}

function comboHtml(key, label, selected, placeholder) {
  const names = Array.isArray(selected) ? selected : canonicalizeList(selected, CATALOGS[key]);
  return `<div class="combo" data-combo="${esc(key)}" data-selected="${esc(JSON.stringify(names))}" data-placeholder="${esc(placeholder)}">
    <span class="combo-label">${esc(label)}</span>
    <div class="combo-anchor">
      <div class="combo-control">${names.map((name) => tagHtml(name)).join("")}<input class="combo-search" data-combo-search type="text" placeholder="${esc(names.length ? "Add another" : placeholder)}" autocomplete="off" role="combobox" aria-expanded="false" aria-autocomplete="list" /></div>
      <div class="combo-menu" data-combo-menu hidden></div>
    </div>
    <p class="hint combo-hint">From the Logiwa integrations list. Select every connection that applies, or add a name that is not listed.</p>
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

function renderMenu(combo, query) {
  const catalog = CATALOGS[combo.dataset.combo] || [];
  const selected = readSelected(combo);
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
    const on = selected.some((name) => name.toLowerCase() === item.name.toLowerCase());
    return `<button type="button" class="combo-option${on ? " on" : ""}" data-option="${esc(item.name)}" role="option" aria-selected="${on}"><span>${esc(item.name)}${item.note ? `<small>${esc(item.note)}</small>` : ""}</span>${on ? "<em>Selected</em>" : ""}</button>`;
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
  if (!found) throw new Error("This workbook does not have Project Details or Integration answers. Use the kickoff sheet with Topic, Questions, and Answer columns.");
  return found;
}

function parseKickoffRows(rows) {
  let header = -1;
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
      topicCol = topic;
      questionCol = question;
      answerCol = answer;
      break;
    }
  }
  if (header < 0) return null;
  let topic = "";
  const details = [];
  const integrations = [];
  for (let index = header + 1; index < rows.length; index += 1) {
    const row = rows[index] || [];
    const topicCell = String(row[topicCol] || "").trim();
    if (topicCell) topic = topicCell;
    const question = String(row[questionCol] || "").trim();
    const answer = String(row[answerCol] || "").trim();
    if (!question && !answer) continue;
    if (/project detail/i.test(topic)) details.push({ question, answer });
    else if (/^integration$/i.test(topic)) integrations.push({ question, answer });
  }
  if (!details.length && !integrations.length) return null;
  return { details, integrations };
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
  if (carrierText) {
    kickoff.carriers = matchSystems(carrierText, CARRIERS);
    if (/\busps\b/i.test(carrierText) && !kickoff.carriers.some((name) => /stamps|usps|endicia/i.test(name))) kickoff.carriers.push("USPS");
    if (/\bendicia\b/i.test(carrierText) && !kickoff.carriers.some((name) => /endicia/i.test(name))) kickoff.carriers.push("Endicia");
  }
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
  return parts.length ? `Imported kickoff · ${parts.join(" · ")}` : "No Project Details or Integration answers were found in that workbook.";
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
      const found = currentCustomer();
      if (found) {
        const summary = applyKickoff(parsed, found.item.kickoff);
        save();
        render();
        const line = status();
        if (line) line.textContent = summary;
        return;
      }
      const draft = { warehouses: "", users: "", clients: "", apiUsers: "", notes: "", marketplaces: [], carriers: [] };
      const form = document.getElementById("new-form");
      if (form) draft.notes = String(new FormData(form).get("notes") || "");
      const summary = applyKickoff(parsed, draft);
      ["warehouses", "users", "clients", "apiUsers", "notes"].forEach((key) => {
        const input = form && form.querySelector(`[name="${key}"]`);
        if (input) input.value = draft[key] || "";
      });
      ["marketplaces", "carriers"].forEach((key) => {
        const combo = form && form.querySelector(`[data-combo="${key}"]`);
        if (combo) writeSelected(combo, draft[key]);
      });
      const line = status();
      if (line) line.textContent = summary;
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
  return `<a class="tab" href="#/customer/${encodeURIComponent(item.id)}?phase=${phase.id}" aria-selected="${phase.id === active}"><b>${esc(phase.name)}</b><span class="meta">${label}</span></a>`;
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
  const result = evaluate(item, phase.id);
  document.getElementById("rail").innerHTML = railHtml(item, phase, result);
  const updated = document.getElementById("updated-line");
  if (updated) updated.textContent = `${item.sample ? "Sample record · " : ""}Last change ${when(item.phases[phase.id].updatedAt)}`;
  document.querySelectorAll(".tab").forEach((tabEl, index) => {
    const resultForTab = evaluate(item, PHASES[index].id);
    const label = resultForTab.complete ? `${fmt(resultForTab.score)} · ${BANDS[resultForTab.band].label}` : resultForTab.answered.length ? `${resultForTab.answered.length}/${resultForTab.applicable.length} answered` : "Not started";
    tabEl.querySelector(".meta").textContent = label;
  });
}

function currentCustomer() {
  const current = route();
  if (current.name !== "customer") return null;
  const item = customerById(current.id);
  const phase = phaseById(current.phase) || PHASES[0];
  return item ? { item, phase } : null;
}

document.body.addEventListener("click", (event) => {
  const searchField = event.target.closest("[data-combo-search]");
  if (searchField) renderMenu(searchField.closest("[data-combo]"), searchField.value);
  const option = event.target.closest("[data-option], [data-add-custom], [data-remove]");
  if (option) {
    event.preventDefault();
    const combo = option.closest("[data-combo]");
    const selected = readSelected(combo);
    if (option.dataset.remove) writeSelected(combo, selected.filter((name) => name !== option.dataset.remove));
    if (option.dataset.option) {
      const name = option.dataset.option;
      const has = selected.some((item) => item.toLowerCase() === name.toLowerCase());
      writeSelected(combo, has ? selected.filter((item) => item.toLowerCase() !== name.toLowerCase()) : selected.concat(name));
    }
    if (option.dataset.addCustom) writeSelected(combo, selected.concat(option.dataset.addCustom));
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
  if (el.dataset.note) {
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
      carriers: readSelected(event.target.querySelector("[data-combo='carriers']"))
    }
  });
  if (!item.name) return;
  item.phases.early.assessor = item.engineer;
  state.customers.unshift(item);
  save();
  location.hash = `#/customer/${encodeURIComponent(item.id)}?phase=early`;
});

document.body.addEventListener("change", (event) => {
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
