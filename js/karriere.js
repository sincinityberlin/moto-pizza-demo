/* ==========================================================================
   MOTO PIZZA — Karriere page behaviour

   Sends the application to netlify/functions/apply.js, which forwards it to
   the existing Airtable base. Nothing secret lives here: the browser only ever
   talks to our own /api/apply, never to Airtable, so no token is exposed.

   The submit path is deliberately pessimistic — a success message is shown
   only when the function confirms the record was created. Every other outcome
   (network error, function error, Airtable rejection) says so plainly, because
   an applicant who believes they applied and did not is worse off than one who
   sees an error and tries again.
   ========================================================================== */

const API_ENDPOINT = "/api/apply";
/* keep in sync with MAX_CV_BYTES in netlify/functions/apply.js — Netlify caps a
   request at 6 MB and base64 adds ~33%, so 4 MB of file is the safe ceiling */
const MAX_CV_BYTES = 4 * 1024 * 1024;

/* Browsers frequently report an empty type for .doc/.docx (and sometimes for
   files dragged in from cloud storage), which would reach Airtable as
   application/octet-stream and show up there as a typeless blob. Fall back to
   the extension so the attachment keeps its real content type. */
const MIME_BY_EXT = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

function contentTypeOf(file) {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop().toLowerCase();
  return MIME_BY_EXT[ext] || "application/octet-stream";
}

function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(new Error("read_failed"));
    r.onload = () => {
      const result = String(r.result);
      resolve(result.slice(result.indexOf(",") + 1)); // strip the data: prefix
    };
    r.readAsDataURL(file);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("applicationForm");
  if (!form) return;

  const status = document.getElementById("formStatus");
  const submit = form.querySelector(".cform__submit");
  const file = document.getElementById("f-cv");
  const hint = document.getElementById("cvHint");
  const defaultHint = hint ? hint.textContent : "";

  const show = (kind, html) => {
    status.hidden = false;
    status.className = `career-form__status career-form__status--result career-form__status--${kind}`;
    status.innerHTML = html;
    status.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  /* echo the chosen file back — a bare file input gives almost no feedback on
     mobile — and reject anything over the ceiling before it is ever encoded */
  if (file && hint) {
    file.addEventListener("change", () => {
      const picked = file.files && file.files[0];
      if (!picked) {
        hint.textContent = defaultHint;
        hint.classList.remove("cform__hint--picked", "cform__hint--error");
        return;
      }
      const tooBig = picked.size > MAX_CV_BYTES;
      hint.textContent = tooBig
        ? `„${picked.name}" ist ${(picked.size / 1024 / 1024).toFixed(1)} MB — bitte eine Datei bis 4 MB wählen.`
        : `Ausgewählt: ${picked.name}`;
      hint.classList.toggle("cform__hint--picked", !tooBig);
      hint.classList.toggle("cform__hint--error", tooBig);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    /* the form carries `novalidate` so the browser doesn't block on its own
       bubbles; reportValidity() runs the very same checks explicitly */
    if (!form.reportValidity()) return;

    const picked = file && file.files && file.files[0];
    if (picked && picked.size > MAX_CV_BYTES) {
      show("error", "Der Lebenslauf ist zu groß (max. 4 MB). Bitte wähle eine kleinere Datei.");
      return;
    }

    submit.disabled = true;
    const label = submit.textContent;
    submit.textContent = "Wird gesendet …";
    status.hidden = true;

    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        location: data.location,
        consent: Boolean(data.consent),
        address: data.address || "",
        date: data.date || "",
        motivation: data.motivation || "",
        available: data.available || "",
        unavailable: data.unavailable || "",
        hours: data.hours || "",
        shift: data.shift || "",
        age: data.age || "",
        standing: data.standing || "",
        physical: data.physical || "",
        experience: data.experience || "",
        experienceText: data.experienceText || "",
        more: data.more || "",
        copy: Boolean(data.copy),
      };
      if (picked) {
        payload.cv = {
          name: picked.name,
          type: contentTypeOf(picked),
          data: await readAsBase64(picked),
        };
      }

      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      let result = {};
      try { result = await res.json(); } catch { /* keep {} */ }

      if (!res.ok || !result.ok) {
        show(
          "error",
          "<strong>Die Bewerbung konnte nicht übermittelt werden.</strong><br />" +
            "Bitte versuche es in ein paar Minuten erneut oder schick uns deine Unterlagen direkt per E-Mail. " +
            "Deine Eingaben stehen noch im Formular."
        );
        return;
      }

      // record exists — but say so honestly if the CV did not make it
      if (result.attachment === "failed" || result.attachment === "too_large") {
        show(
          "partial",
          "<strong>Deine Bewerbung ist eingegangen.</strong><br />" +
            "Der Lebenslauf konnte allerdings nicht mit übertragen werden — bitte sende ihn uns " +
            "kurz per E-Mail nach. Alle übrigen Angaben liegen uns vor."
        );
        form.reset();
        if (hint) { hint.textContent = defaultHint; hint.className = "cform__hint"; }
        return;
      }

      show(
        "success",
        "<strong>Vielen Dank für deine Bewerbung!</strong><br />" +
          "Wir haben deine Unterlagen erhalten und melden uns zeitnah bei dir. " +
          "Eine Bestätigung geht dir per E-Mail zu."
      );
      form.reset();
      if (hint) { hint.textContent = defaultHint; hint.className = "cform__hint"; }
    } catch (err) {
      console.error(err);
      show(
        "error",
        "<strong>Verbindung fehlgeschlagen.</strong><br />" +
          "Bitte prüfe deine Internetverbindung und versuche es erneut. Deine Eingaben stehen noch im Formular."
      );
    } finally {
      submit.disabled = false;
      submit.textContent = label;
    }
  });
});
