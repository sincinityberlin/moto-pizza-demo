/* ==========================================================================
   MOTO PIZZA — Dein Store (Franchise) page behaviour

   Deliberately a separate file from js/karriere.js: the careers form is live
   and working, and nothing here should be able to reach it. Own endpoint
   (/api/franchise), own Airtable table. Nothing secret lives here — the
   browser only ever talks to our own route, never to Airtable.

   Seven-step flow. Every step stays in the DOM and is only hidden, so moving
   back and forth never discards an entry and one FormData at the end still
   sees every field. Advancing validates just that step's required fields;
   submitting re-checks all of them and jumps back to the first step that
   fails, because a hidden invalid field can otherwise block a submit with no
   visible explanation.
   ========================================================================== */

const API_ENDPOINT = "/api/franchise";
/* keep in sync with MAX_DOC_BYTES in netlify/functions/franchise.js — Netlify
   caps a request at 6 MB and base64 adds ~33%, so 4 MB of file is the ceiling */
const MAX_DOC_BYTES = 4 * 1024 * 1024;

const MIME_BY_EXT = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

/* browsers often report an empty type for .doc/.docx; fall back to the
   extension so the attachment keeps its real content type in Airtable */
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
  const form = document.getElementById("franchiseForm");
  if (!form) return;

  const steps = [...form.querySelectorAll(".fstep")];
  const backBtn = document.getElementById("stepBack");
  const nextBtn = document.getElementById("stepNext");
  const submitBtn = document.getElementById("stepSubmit");
  const nowEl = document.getElementById("stepNow");
  const nameEl = document.getElementById("stepName");
  const fillEl = document.getElementById("stepFill");
  const bar = fillEl.parentElement;
  const status = document.getElementById("franchiseStatus");
  const file = document.getElementById("g-docs");
  const hint = document.getElementById("docsHint");
  const defaultHint = hint ? hint.textContent : "";

  document.getElementById("stepTotal").textContent = String(steps.length);
  let current = 0;

  const show = (kind, html) => {
    status.hidden = false;
    status.className = `career-form__status career-form__status--result career-form__status--${kind}`;
    status.innerHTML = html;
    status.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  function render(scroll) {
    steps.forEach((s, i) => { s.hidden = i !== current; });
    const step = steps[current];
    nowEl.textContent = String(current + 1);
    nameEl.textContent = step.dataset.title;
    fillEl.style.width = `${((current + 1) / steps.length) * 100}%`;
    bar.setAttribute("aria-valuenow", String(current + 1));

    backBtn.hidden = current === 0;
    const last = current === steps.length - 1;
    nextBtn.hidden = last;
    submitBtn.hidden = !last;

    if (scroll) {
      document.querySelector(".fsteps__head").scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }

  /* Validate one step only. reportValidity() on the offending field gives the
     browser's own message, which needs the field visible — it is, because we
     never leave the step we are checking. */
  function validateStep(index) {
    for (const field of steps[index].querySelectorAll("[required]")) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  }

  nextBtn.addEventListener("click", () => {
    if (!validateStep(current)) return;
    if (current < steps.length - 1) { current++; render(true); }
  });

  backBtn.addEventListener("click", () => {
    if (current > 0) { current--; render(true); }
  });

  /* the free-text box only matters when "Sonstiges" is the answer */
  const occupation = document.getElementById("g-occupation");
  const otherWrap = document.getElementById("occupationOtherWrap");
  if (occupation && otherWrap) {
    const sync = () => {
      const isOther = occupation.value === "Sonstiges";
      otherWrap.hidden = !isOther;
      if (!isOther) document.getElementById("g-occupation-other").value = "";
    };
    occupation.addEventListener("change", sync);
    sync();
  }

  /* echo the chosen file back and reject anything over the ceiling before it
     is ever encoded */
  if (file && hint) {
    file.addEventListener("change", () => {
      const picked = file.files && file.files[0];
      if (!picked) {
        hint.textContent = defaultHint;
        hint.classList.remove("cform__hint--picked", "cform__hint--error");
        return;
      }
      const tooBig = picked.size > MAX_DOC_BYTES;
      hint.textContent = tooBig
        ? `„${picked.name}“ ist ${(picked.size / 1024 / 1024).toFixed(1)} MB — bitte eine Datei bis 4 MB wählen.`
        : `Ausgewählt: ${picked.name}`;
      hint.classList.toggle("cform__hint--picked", !tooBig);
      hint.classList.toggle("cform__hint--error", tooBig);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // re-check every step; jump to the first one that fails so the user sees why
    for (let i = 0; i < steps.length; i++) {
      const bad = [...steps[i].querySelectorAll("[required]")].find((f) => !f.checkValidity());
      if (bad) {
        current = i;
        render(true);
        bad.reportValidity();
        return;
      }
    }

    const picked = file && file.files && file.files[0];
    if (picked && picked.size > MAX_DOC_BYTES) {
      show("error", "Die Datei ist zu groß (max. 4 MB). Bitte wähle eine kleinere Datei.");
      return;
    }

    submitBtn.disabled = true;
    const label = submitBtn.textContent;
    submitBtn.textContent = "Wird gesendet …";
    status.hidden = true;

    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        region: data.region,
        why: data.why,
        whyCity: data.whyCity,
        occupation: data.occupation,
        multiStore: data.multiStore,
        weeklyHours: data.weeklyHours,
        consent: Boolean(data.consent),
        address: data.address || "",
        birthdate: data.birthdate || "",
        hasLocation: data.hasLocation || "",
        locationType: data.locationType || "",
        storeSize: data.storeSize || "",
        locationDetails: data.locationDetails || "",
        storeType: data.storeType || "",
        occupationOther: data.occupationOther || "",
        job: data.job || "",
        gastro: data.gastro || "",
        gastroText: data.gastroText || "",
        entrepreneur: data.entrepreneur || "",
        entrepreneurText: data.entrepreneurText || "",
        capital: data.capital || "",
        financing: data.financing || "",
        timeline: data.timeline || "",
        interest: data.interest || "",
        copy: Boolean(data.copy),
      };
      if (picked) {
        payload.docs = {
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
          "<strong>Deine Franchise-Anfrage konnte nicht übermittelt werden.</strong><br />" +
            "Bitte versuche es in ein paar Minuten erneut oder melde dich direkt per E-Mail bei uns. " +
            "Deine Eingaben stehen noch im Formular."
        );
        return;
      }

      const reset = () => {
        form.reset();
        if (hint) { hint.textContent = defaultHint; hint.className = "cform__hint"; }
        if (otherWrap) otherWrap.hidden = true;
        current = 0;
        render(false);
      };

      if (result.attachment === "failed" || result.attachment === "too_large") {
        show(
          "partial",
          "<strong>Deine Franchise-Anfrage ist eingegangen.</strong><br />" +
            "Deine Unterlagen konnten allerdings nicht mit übertragen werden — bitte sende sie uns " +
            "kurz per E-Mail nach. Alle übrigen Angaben liegen uns vor."
        );
        reset();
        return;
      }

      show(
        "success",
        "<strong>Vielen Dank für dein Interesse an MOTO PIZZA!</strong><br />" +
          "Deine Franchise-Anfrage wurde erfolgreich übermittelt. " +
          "Wir prüfen deine Angaben und melden uns persönlich bei dir."
      );
      reset();
    } catch (err) {
      console.error(err);
      show(
        "error",
        "<strong>Verbindung fehlgeschlagen.</strong><br />" +
          "Bitte prüfe deine Internetverbindung und versuche es erneut. Deine Eingaben stehen noch im Formular."
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = label;
    }
  });

  render(false);
});
