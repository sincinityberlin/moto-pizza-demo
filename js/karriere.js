/* ==========================================================================
   MOTO PIZZA — Karriere page behaviour
   Only two jobs: show the picked filename next to the upload field, and make
   the submit button honest.

   The form has no action/method because this site is static (GitHub Pages) and
   there is no backend to receive an application. Rather than posting into the
   void — which would look like success to an applicant — submit is intercepted:
   the browser's own constraint validation still runs, so required fields,
   e-mail format and the consent checkbox all behave exactly as they will once
   a real endpoint exists, and then the page states plainly that dispatch is
   not set up yet. Wiring it up later means adding action/method to the <form>
   in karriere.html and deleting the preventDefault branch below.
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("applicationForm");
  if (!form) return;

  const status = document.getElementById("formStatus");
  const file = document.getElementById("f-cv");
  const hint = document.getElementById("cvHint");
  const defaultHint = hint ? hint.textContent : "";

  /* echo the chosen file back — a bare file input gives almost no feedback on
     mobile, where the native control is tiny */
  if (file && hint) {
    file.addEventListener("change", () => {
      const picked = file.files && file.files[0];
      hint.textContent = picked
        ? `Ausgewählt: ${picked.name}`
        : defaultHint;
      hint.classList.toggle("cform__hint--picked", Boolean(picked));
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    /* the form carries `novalidate` so the browser doesn't block on its own
       bubbles before we get here; reportValidity() runs the very same checks
       explicitly, which keeps required-field behaviour real and testable */
    if (!form.reportValidity()) return;

    status.hidden = false;
    status.textContent =
      "Diese Bewerbung wurde NICHT abgeschickt. Für den Empfang von Bewerbungen ist " +
      "noch kein Formular-Dienst eingerichtet — bitte kontaktiere uns bis dahin direkt.";
    status.scrollIntoView({ block: "center", behavior: "smooth" });
  });
});
