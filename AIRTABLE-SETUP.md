# Bewerbungsformular → Airtable

Die Karriere-Seite sendet an `/api/apply` → `netlify/functions/apply.js` → Airtable.
Der Token liegt ausschließlich in den Netlify-Environment-Variables und erreicht
weder den Browser noch dieses Repository.

## 1. Environment Variables (Netlify → Site configuration → Environment variables)

**Pflicht:**

| Variable | Wert |
|---|---|
| `AIRTABLE_TOKEN` | Personal Access Token, Scope `data.records:write`, Rolle *Base editor*, nur diese Base |
| `AIRTABLE_BASE_ID` | beginnt mit `app…`, aus der Airtable-URL |

**Optional** — nur setzen, wenn eine Spalte anders heißt als der Default:

`AIRTABLE_TABLE` (`Mitarbeiter-Bewerbungen`) ·
`AIRTABLE_FIELD_NAME` (`Name`) · `AIRTABLE_FIELD_EMAIL` (`E-Mail`) ·
`AIRTABLE_FIELD_PHONE` (`Telefonnummer`) · `AIRTABLE_FIELD_STATUS` (`Status`) ·
`AIRTABLE_FIELD_POSITION` (`Position`) · `AIRTABLE_FIELD_KIND` (`Bewerbungsart`) ·
`AIRTABLE_FIELD_LOCATION` (`Standort`) · `AIRTABLE_FIELD_CV` (`Lebenslauf / Dokumente`) ·
`AIRTABLE_FIELD_ADDRESS` (`Adresse`) · `AIRTABLE_FIELD_DATE` (`Bewerbungsdatum`) ·
`AIRTABLE_FIELD_MOTIVATION` (`Motivation`) · `AIRTABLE_FIELD_AVAILABLE` (`Verfügbarkeit`) ·
`AIRTABLE_FIELD_UNAVAILABLE` (`Nicht verfügbar`) · `AIRTABLE_FIELD_HOURS` (`Wochenstunden`) ·
`AIRTABLE_FIELD_SHIFT` (`Bevorzugte Arbeitszeiten`) · `AIRTABLE_FIELD_AGE` (`Mindestens 18`) ·
`AIRTABLE_FIELD_STANDING` (`Stehend arbeiten`) · `AIRTABLE_FIELD_PHYSICAL` (`Körperliche Arbeit`) ·
`AIRTABLE_FIELD_EXPERIENCE` (`Gastro-Erfahrung`) · `AIRTABLE_FIELD_EXPERIENCE_TEXT` (`Berufserfahrung`) ·
`AIRTABLE_FIELD_MORE` (`Sonstiges`) · `AIRTABLE_FIELD_COPY` (`Kopie erwünscht`) ·
`AIRTABLE_FIELD_CONSENT` (`Einwilligung erteilt`)

Verhalten: `AIRTABLE_STATUS_NEW` (`Neu`) · `AIRTABLE_SET_STATUS` (`true`) ·
`AIRTABLE_KIND_VALUE` (`Mitarbeiter-Bewerbung`) · `AIRTABLE_TYPECAST` (`true`)

## 2. Spalten in „Mitarbeiter-Bewerbungen"

Bereits vorhanden: Name · E-Mail · Telefonnummer · Status · Position ·
Bewerbungsart · Standort · Lebenslauf / Dokumente (Attachment)

Noch anzulegen, damit kein Formularfeld verloren geht:

| Spaltenname | Airtable-Typ |
|---|---|
| Adresse | Single line text |
| Bewerbungsdatum | Date (ISO, `YYYY-MM-DD`) |
| Motivation | Long text |
| Verfügbarkeit | Long text |
| Nicht verfügbar | Long text |
| Wochenstunden | Single line text |
| Bevorzugte Arbeitszeiten | Single line text |
| Mindestens 18 | Single select (`Ja` / `Nein`) |
| Stehend arbeiten | Single select (`Ja` / `Nein`) |
| Körperliche Arbeit | Single select (`Ja` / `Nein`) |
| Gastro-Erfahrung | Single select (`Ja` / `Nein`) |
| Berufserfahrung | Long text |
| Sonstiges | Long text |
| Kopie erwünscht | Checkbox |
| Einwilligung erteilt | Checkbox |

**Fehlt eine Spalte, geht die Bewerbung trotzdem durch.** Die Funktion entfernt
den unbekannten Wert und legt den Datensatz ohne ihn an — statt dass Airtable
die komplette Bewerbung ablehnt. Welche Spalten übersprungen wurden, steht im
Netlify-Function-Log und in der API-Antwort (`skippedFields`). Sobald eine
Spalte existiert, landet ihr Wert automatisch dort — ohne Deploy.

## 3. Auswahlfelder

Die Werte werden zeichengenau geschrieben und müssen zu den Optionen passen:

- **Standort:** `Berlin- Alexanderplatz`
- **Position:** `Küche` · `Service` · `Vorbereitung / Prep` · `Spülküche` · `Sonstiges`
- **Bewerbungsart:** `Mitarbeiter-Bewerbung`
- **Status:** `Neu`

`AIRTABLE_TYPECAST=true` lässt Airtable fehlende Optionen selbst anlegen. Wer das
nicht will, setzt die Variable auf `false` — dann muss jede Option exakt existieren.

## 4. Dateigröße

Maximal **4 MB** pro Lebenslauf. Grund: Netlify begrenzt eine Anfrage auf 6 MB und
Base64 vergrößert die Datei um rund ein Drittel; Airtables eigene Grenze (5 MB) ist
die großzügigere. Das Formular prüft das schon vor dem Absenden.
Ändert sich das, müssen `MAX_CV_BYTES` in `js/karriere.js` **und** in
`netlify/functions/apply.js` gemeinsam angepasst werden.
