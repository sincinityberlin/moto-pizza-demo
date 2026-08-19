/* ==========================================================================
   MOTO PIZZA — Bewerbungseingang (Netlify Function)

   Sits between the careers form and the existing Airtable base
   ("Mitarbeiter-Bewerbungen"). Runs server-side so AIRTABLE_TOKEN never
   reaches the browser — that is the whole reason this function exists. The
   token is read from the environment and is never echoed back in a response,
   not even on error; Airtable's own error text goes to the server log only.

   Two calls to Airtable, because the API cannot take a file while creating a
   record:
     1. POST /v0/{base}/{table}                                -> record
     2. POST /v0/{base}/{recordId}/{field}/uploadAttachment    -> CV
   If step 2 fails the record still exists, so the caller is told "partial"
   rather than "ok" and the page says so instead of claiming a clean success.

   MISSING COLUMNS ARE SURVIVABLE. Airtable rejects an entire record if it
   carries one unknown field name, which would mean a single not-yet-created
   column silently costs you every application. Instead createRecord() reads
   the field name out of Airtable's UNKNOWN_FIELD_NAME error, drops just that
   one value and retries. The applicant still gets through, the skipped
   columns are logged, and the moment you add a column in Airtable its value
   starts landing there — no deploy, no code change.
   ========================================================================== */

const env = (key, fallback) => process.env[key] || fallback;

/* Columns confirmed to exist in the base. */
const FIELD = {
  name:        env("AIRTABLE_FIELD_NAME", "Name"),
  email:       env("AIRTABLE_FIELD_EMAIL", "E-Mail"),
  phone:       env("AIRTABLE_FIELD_PHONE", "Telefonnummer"),
  status:      env("AIRTABLE_FIELD_STATUS", "Status"),
  position:    env("AIRTABLE_FIELD_POSITION", "Position"),
  kind:        env("AIRTABLE_FIELD_KIND", "Bewerbungsart"),
  location:    env("AIRTABLE_FIELD_LOCATION", "Standort"),
  cv:          env("AIRTABLE_FIELD_CV", "Lebenslauf / Dokumente"),
  /* Columns for the remaining form fields. Create them in Airtable under
     exactly these names — or point the env var at whatever you called them.
     Until a column exists its value is skipped, not lost in a failed record. */
  address:     env("AIRTABLE_FIELD_ADDRESS", "Adresse"),
  date:        env("AIRTABLE_FIELD_DATE", "Bewerbungsdatum"),
  motivation:  env("AIRTABLE_FIELD_MOTIVATION", "Motivation"),
  available:   env("AIRTABLE_FIELD_AVAILABLE", "Verfügbarkeit"),
  unavailable: env("AIRTABLE_FIELD_UNAVAILABLE", "Nicht verfügbar"),
  hours:       env("AIRTABLE_FIELD_HOURS", "Wochenstunden"),
  shift:       env("AIRTABLE_FIELD_SHIFT", "Bevorzugte Arbeitszeiten"),
  age:         env("AIRTABLE_FIELD_AGE", "Mindestens 18"),
  standing:    env("AIRTABLE_FIELD_STANDING", "Stehend arbeiten"),
  physical:    env("AIRTABLE_FIELD_PHYSICAL", "Körperliche Arbeit"),
  experience:  env("AIRTABLE_FIELD_EXPERIENCE", "Gastro-Erfahrung"),
  expText:     env("AIRTABLE_FIELD_EXPERIENCE_TEXT", "Berufserfahrung"),
  more:        env("AIRTABLE_FIELD_MORE", "Sonstiges"),
  copy:        env("AIRTABLE_FIELD_COPY", "Kopie erwünscht"),
  consent:     env("AIRTABLE_FIELD_CONSENT", "Einwilligung erteilt"),
};

const STATUS_NEW = env("AIRTABLE_STATUS_NEW", "Neu");
const SET_STATUS = process.env.AIRTABLE_SET_STATUS !== "false";
const KIND_VALUE = env("AIRTABLE_KIND_VALUE", "Mitarbeiter-Bewerbung");
/* typecast lets Airtable coerce values into select/date/checkbox columns. Set
   AIRTABLE_TYPECAST=false to require exact matches instead — stricter, but a
   single typo in an option then rejects the record. */
const TYPECAST = process.env.AIRTABLE_TYPECAST !== "false";

/* Attachment uploads do NOT run on api.airtable.com — that host answers this
   route with 404 NOT_FOUND. They go to content.airtable.com instead. Record
   creation above stays on api.airtable.com, which is correct and working.
   Verified against both hosts: api -> 404, content -> 401 (route exists,
   only auth missing). */
const UPLOAD_HOST = env("AIRTABLE_UPLOAD_HOST", "https://content.airtable.com");

/* Netlify caps a synchronous function request at 6 MB and base64 inflates a
   file by ~33%, so 4 MB of raw file is the safe ceiling (Airtable's own limit,
   5 MB, is the looser one). Keep in sync with MAX_CV_BYTES in js/karriere.js. */
const MAX_CV_BYTES = 4 * 1024 * 1024;

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
  const table = env("AIRTABLE_TABLE", "Mitarbeiter-Bewerbungen");

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

  // mirror of the form's own required set — never trust the client alone
  for (const key of ["name", "email", "phone", "position", "location", "consent"]) {
    if (!body[key]) return json(400, { error: "missing_field", field: key });
  }

  // every form field goes in; blanks are dropped so empty cells stay empty
  const wanted = {
    [FIELD.name]: clip(body.name, 500),
    [FIELD.email]: clip(body.email, 500),
    [FIELD.phone]: clip(body.phone, 100),
    [FIELD.position]: clip(body.position, 200),
    [FIELD.location]: clip(body.location, 200),
    [FIELD.kind]: KIND_VALUE,
    [FIELD.address]: clip(body.address, 500),
    [FIELD.date]: clip(body.date, 20),
    [FIELD.motivation]: clip(body.motivation, 100000),
    [FIELD.available]: clip(body.available, 100000),
    [FIELD.unavailable]: clip(body.unavailable, 100000),
    [FIELD.hours]: clip(body.hours, 100),
    [FIELD.shift]: clip(body.shift, 200),
    [FIELD.age]: clip(body.age, 20),
    [FIELD.standing]: clip(body.standing, 20),
    [FIELD.physical]: clip(body.physical, 20),
    [FIELD.experience]: clip(body.experience, 20),
    [FIELD.expText]: clip(body.experienceText, 100000),
    [FIELD.more]: clip(body.more, 100000),
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

  /* Create the record, dropping any column the base does not have yet and
     retrying, so one missing column can never cost a whole application. */
  async function createRecord(initial) {
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`;
    let payload = { ...initial };
    const skipped = [];

    for (let attempt = 0; attempt <= Object.keys(initial).length; attempt++) {
      const res = await airtable(url, { fields: payload, typecast: TYPECAST });
      if (res.ok) return { record: await res.json(), skipped };

      const text = await res.text();
      /* parse before matching: in the raw body the quotes around the field
         name are backslash-escaped, so a regex over the JSON string never
         matches. error.message has them unescaped. */
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
      const err = new Error("airtable_create_failed");
      err.status = res.status;
      throw err;
    }
    throw new Error("airtable_create_failed");
  }

  // ---- 1. create the record ------------------------------------------------
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

  // ---- 2. attach the CV, if one was sent -----------------------------------
  if (!body.cv || !body.cv.data) return done("none");

  const approxBytes = Math.floor((body.cv.data.length * 3) / 4);
  if (approxBytes > MAX_CV_BYTES) return done("too_large");

  try {
    const res = await airtable(
      `${UPLOAD_HOST}/v0/${baseId}/${recordId}/${encodeURIComponent(FIELD.cv)}/uploadAttachment`,
      {
        contentType: body.cv.type || "application/octet-stream",
        file: body.cv.data,
        filename: body.cv.name || "lebenslauf",
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
