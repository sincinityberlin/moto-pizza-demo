/* ==========================================================================
   MOTO PIZZA — Franchise-Anfragen (Netlify Function)

   Deliberately a SEPARATE function from apply.js. The staff-application path
   is live and working; keeping franchise enquiries in their own file and their
   own Airtable table means nothing here can regress it. Same base, same token
   — only the table differs.

   Mirrors the proven approach in apply.js:
     1. POST https://api.airtable.com/v0/{base}/{table}          -> record
     2. POST https://content.airtable.com/v0/{base}/{rec}/{f}/uploadAttachment
   Attachments must go to content.airtable.com; api.airtable.com answers that
   route with 404. If the upload fails the record still exists, so the caller
   is told "partial", never a clean success.

   Missing columns are survivable: Airtable rejects a whole record over one
   unknown field name, so createRecord() reads the offending name out of the
   error, drops just that value and retries. An enquiry is never lost because
   a column has not been created yet.
   ========================================================================== */

const env = (key, fallback) => process.env[key] || fallback;

const FIELD = {
  name:        env("FRANCHISE_FIELD_NAME", "Name"),
  email:       env("FRANCHISE_FIELD_EMAIL", "E-Mail"),
  phone:       env("FRANCHISE_FIELD_PHONE", "Telefonnummer"),
  address:     env("FRANCHISE_FIELD_ADDRESS", "Adresse"),
  city:        env("FRANCHISE_FIELD_CITY", "Wohnort"),
  birthdate:   env("FRANCHISE_FIELD_BIRTHDATE", "Geburtsdatum"),
  region:      env("FRANCHISE_FIELD_REGION", "Wunschregion"),
  hasLocation: env("FRANCHISE_FIELD_HAS_LOCATION", "Standort vorhanden"),
  locationType:env("FRANCHISE_FIELD_LOCATION_TYPE", "Standortart"),
  storeSize:   env("FRANCHISE_FIELD_STORE_SIZE", "Storegröße"),
  locationDet: env("FRANCHISE_FIELD_LOCATION_DETAILS", "Standortbeschreibung"),
  storeType:   env("FRANCHISE_FIELD_STORE_TYPE", "Vorhaben"),
  job:         env("FRANCHISE_FIELD_JOB", "Aktuelle Tätigkeit"),
  gastro:      env("FRANCHISE_FIELD_GASTRO", "Gastro-Erfahrung"),
  gastroText:  env("FRANCHISE_FIELD_GASTRO_TEXT", "Erfahrung Beschreibung"),
  entrepreneur:env("FRANCHISE_FIELD_ENTREPRENEUR", "Unternehmerische Erfahrung"),
  entrepText:  env("FRANCHISE_FIELD_ENTREPRENEUR_TEXT", "Unternehmerische Erfahrung Beschreibung"),
  capital:     env("FRANCHISE_FIELD_CAPITAL", "Eigenkapital"),
  financing:   env("FRANCHISE_FIELD_FINANCING", "Zusatzfinanzierung"),
  timeline:    env("FRANCHISE_FIELD_TIMELINE", "Geplanter Start"),
  why:         env("FRANCHISE_FIELD_WHY", "Motivation"),
  whyCity:     env("FRANCHISE_FIELD_WHY_CITY", "Standort-Potenzial"),
  docs:        env("FRANCHISE_FIELD_DOCS", "Unterlagen"),
  copy:        env("FRANCHISE_FIELD_COPY", "Kopie erwünscht"),
  consent:     env("FRANCHISE_FIELD_CONSENT", "Einwilligung erteilt"),
  status:      env("FRANCHISE_FIELD_STATUS", "Status"),
};

const STATUS_NEW = env("FRANCHISE_STATUS_NEW", "Neu");
const SET_STATUS = process.env.FRANCHISE_SET_STATUS !== "false";
const TYPECAST = process.env.AIRTABLE_TYPECAST !== "false";
const UPLOAD_HOST = env("AIRTABLE_UPLOAD_HOST", "https://content.airtable.com");
const MAX_DOC_BYTES = 4 * 1024 * 1024;

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const clip = (v, n) => String(v ?? "").slice(0, n);

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = env("AIRTABLE_FRANCHISE_TABLE", "Franchise-Bewerbungen");

  if (!token || !baseId) {
    console.error("Missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID");
    return json(500, { error: "server_not_configured" });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "invalid_json" });
  }

  for (const key of ["name", "email", "phone", "city", "region", "why", "whyCity", "consent"]) {
    if (!body[key]) return json(400, { error: "missing_field", field: key });
  }

  const wanted = {
    [FIELD.name]: clip(body.name, 500),
    [FIELD.email]: clip(body.email, 500),
    [FIELD.phone]: clip(body.phone, 100),
    [FIELD.address]: clip(body.address, 500),
    [FIELD.city]: clip(body.city, 200),
    [FIELD.birthdate]: clip(body.birthdate, 20),
    [FIELD.region]: clip(body.region, 300),
    [FIELD.hasLocation]: clip(body.hasLocation, 100),
    [FIELD.locationType]: clip(body.locationType, 100),
    [FIELD.storeSize]: clip(body.storeSize, 100),
    [FIELD.locationDet]: clip(body.locationDetails, 100000),
    [FIELD.storeType]: clip(body.storeType, 200),
    [FIELD.job]: clip(body.job, 300),
    [FIELD.gastro]: clip(body.gastro, 20),
    [FIELD.gastroText]: clip(body.gastroText, 100000),
    [FIELD.entrepreneur]: clip(body.entrepreneur, 20),
    [FIELD.entrepText]: clip(body.entrepreneurText, 100000),
    [FIELD.capital]: clip(body.capital, 100),
    [FIELD.financing]: clip(body.financing, 100),
    [FIELD.timeline]: clip(body.timeline, 100),
    [FIELD.why]: clip(body.why, 100000),
    [FIELD.whyCity]: clip(body.whyCity, 100000),
    [FIELD.copy]: Boolean(body.copy),
    [FIELD.consent]: Boolean(body.consent),
  };
  if (SET_STATUS) wanted[FIELD.status] = STATUS_NEW;

  const fields = {};
  for (const [k, v] of Object.entries(wanted)) {
    if (v === "" || v === undefined || v === null) continue;
    fields[k] = v;
  }

  const airtable = (url, payload) =>
    fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

  async function createRecord(initial) {
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`;
    let payload = { ...initial };
    const skipped = [];

    for (let attempt = 0; attempt <= Object.keys(initial).length; attempt++) {
      const res = await airtable(url, { fields: payload, typecast: TYPECAST });
      if (res.ok) return { record: await res.json(), skipped };

      const text = await res.text();
      let message = text;
      try {
        message = JSON.parse(text)?.error?.message ?? text;
      } catch { /* keep raw text */ }
      const unknown = message.match(/Unknown field name:\s*\\?"([^"\\]+)\\?"/);
      if (res.status === 422 && unknown && unknown[1] in payload) {
        skipped.push(unknown[1]);
        delete payload[unknown[1]];
        continue;
      }
      console.error("Airtable create failed", res.status, text);
      throw new Error("airtable_create_failed");
    }
    throw new Error("airtable_create_failed");
  }

  let recordId;
  let skipped = [];
  try {
    const out = await createRecord(fields);
    recordId = out.record.id;
    skipped = out.skipped;
    if (skipped.length) {
      console.warn(
        `Diese Spalten fehlen in "${table}" und wurden uebersprungen: ${skipped.join(", ")}`
      );
    }
  } catch (err) {
    console.error("Airtable create threw", err);
    return json(502, { error: "airtable_create_failed" });
  }

  const done = (attachment) =>
    json(200, { ok: true, attachment, recordId, skippedFields: skipped });

  if (!body.docs || !body.docs.data) return done("none");

  const approxBytes = Math.floor((body.docs.data.length * 3) / 4);
  if (approxBytes > MAX_DOC_BYTES) return done("too_large");

  try {
    const res = await airtable(
      `${UPLOAD_HOST}/v0/${baseId}/${recordId}/${encodeURIComponent(FIELD.docs)}/uploadAttachment`,
      {
        contentType: body.docs.type || "application/octet-stream",
        file: body.docs.data,
        filename: body.docs.name || "unterlagen",
      }
    );
    if (!res.ok) {
      console.error("Airtable upload failed", res.status, await res.text());
      return done("failed");
    }
  } catch (err) {
    console.error("Airtable upload threw", err);
    return done("failed");
  }

  return done("ok");
};
