/* ==========================================================================
   MOTO PIZZA — Bewerbungseingang (Netlify Function)

   Sits between the careers form and the existing Airtable base. Runs
   server-side so AIRTABLE_TOKEN never reaches the browser — that is the whole
   reason this function exists. The token is read from the environment and is
   never echoed back in a response, not even in an error.

   Two calls to Airtable, because the API cannot take a file while creating a
   record:
     1. POST /v0/{base}/{table}                      -> creates the record
     2. POST /v0/{base}/{recordId}/{field}/uploadAttachment  -> adds the CV
   If step 2 fails the record still exists, so the caller is told
   "partial" rather than "ok" and the page says so instead of claiming a clean
   success.

   Field names are environment-driven. The defaults below are plausible German
   column names, NOT verified against the live base — set the matching env vars
   if the real columns differ, no code change needed.
   ========================================================================== */

const FIELD = {
  name:     process.env.AIRTABLE_FIELD_NAME     || "Name",
  email:    process.env.AIRTABLE_FIELD_EMAIL    || "E-Mail",
  phone:    process.env.AIRTABLE_FIELD_PHONE    || "Telefon",
  position: process.env.AIRTABLE_FIELD_POSITION || "Position",
  location: process.env.AIRTABLE_FIELD_LOCATION || "Standort",
  status:   process.env.AIRTABLE_FIELD_STATUS   || "Status",
  cv:       process.env.AIRTABLE_FIELD_CV       || "Lebenslauf",
};

const STATUS_NEW = process.env.AIRTABLE_STATUS_NEW || "Neu";
/* set AIRTABLE_SET_STATUS=false when the base already defaults new rows to
   "Neu" — then this function leaves the column alone and cannot collide with
   the existing automation */
const SET_STATUS = process.env.AIRTABLE_SET_STATUS !== "false";

/* Netlify caps a synchronous function request at 6 MB, and base64 inflates a
   file by ~33%. 4 MB of raw file is the largest that reliably fits; Airtable's
   own attachment ceiling (5 MB) is the looser of the two. Keep this in sync
   with MAX_CV_BYTES in js/karriere.js. */
const MAX_CV_BYTES = 4 * 1024 * 1024;

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE || "Mitarbeiter-Bewerbungen";

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

  // same required set the form enforces client-side — never trust that alone
  for (const key of ["name", "email", "phone", "position", "location", "consent"]) {
    if (!body[key]) return json(400, { error: "missing_field", field: key });
  }

  const fields = {
    [FIELD.name]: String(body.name).slice(0, 500),
    [FIELD.email]: String(body.email).slice(0, 500),
    [FIELD.phone]: String(body.phone).slice(0, 100),
    [FIELD.position]: String(body.position).slice(0, 200),
    [FIELD.location]: String(body.location).slice(0, 200),
  };
  if (SET_STATUS) fields[FIELD.status] = STATUS_NEW;

  const airtable = (url, payload) =>
    fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

  // ---- 1. create the record ------------------------------------------------
  let recordId;
  try {
    const res = await airtable(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,
      { fields, typecast: true }
    );
    if (!res.ok) {
      // log the detail server-side; the browser only learns that it failed
      console.error("Airtable create failed", res.status, await res.text());
      return json(502, { error: "airtable_create_failed" });
    }
    recordId = (await res.json()).id;
  } catch (err) {
    console.error("Airtable create threw", err);
    return json(502, { error: "airtable_unreachable" });
  }

  // ---- 2. attach the CV, if one was sent -----------------------------------
  if (!body.cv || !body.cv.data) {
    return json(200, { ok: true, attachment: "none", recordId });
  }

  const approxBytes = Math.floor((body.cv.data.length * 3) / 4);
  if (approxBytes > MAX_CV_BYTES) {
    return json(200, { ok: true, attachment: "too_large", recordId });
  }

  try {
    const res = await airtable(
      `https://api.airtable.com/v0/${baseId}/${recordId}/${encodeURIComponent(FIELD.cv)}/uploadAttachment`,
      {
        contentType: body.cv.type || "application/octet-stream",
        file: body.cv.data,
        filename: body.cv.name || "lebenslauf",
      }
    );
    if (!res.ok) {
      console.error("Airtable upload failed", res.status, await res.text());
      return json(200, { ok: true, attachment: "failed", recordId });
    }
  } catch (err) {
    console.error("Airtable upload threw", err);
    return json(200, { ok: true, attachment: "failed", recordId });
  }

  return json(200, { ok: true, attachment: "ok", recordId });
};
