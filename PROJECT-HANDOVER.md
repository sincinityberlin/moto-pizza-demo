# MOTO PIZZA — Projektübergabe

**Stand:** 18.08.2026 · **Letzter Commit:** `0376ead` auf `main` · Working Tree sauber

Diese Datei ist die **maßgebliche Quelle der Wahrheit**. `README.md` ist veraltet — ignorieren.
Ergänzend: `AIRTABLE-SETUP.md` (Mitarbeiter-System) und `FRANCHISE-SETUP.md` (Franchise-System).

---

## 1. Projekt in einem Satz

Detroit-Style-Pizzeria-Website „MOTO PIZZA Berlin" — reines HTML/CSS/Vanilla-JS ohne Build-Step,
plus zwei serverseitige Netlify Functions, die Bewerbungen in Airtable schreiben.

### Pfade und Adressen

| | |
|---|---|
| Projektordner | `/Users/efeelbagli/Desktop/moto-pizza-demo/` |
| GitHub | `https://github.com/sincinityberlin/moto-pizza-demo` (Branch `main`) |
| GitHub Pages (Altbestand) | `https://sincinityberlin.github.io/moto-pizza-demo/` — **statisch, ohne Functions** |
| Netlify (produktiv) | vom Nutzer verbunden; **nur dort funktionieren die Formulare** |
| Originalmaterial | `/Users/efeelbagli/Desktop/Moto pizza/` (Speisekarten-Fotos, Logos, Produktbilder) |

> **Wichtig:** Auf GitHub Pages existiert `/api/*` nicht. Formulartests **immer** über die Netlify-Adresse.

### Deployment

```
git add -A && git commit -m "..." && git push origin main
```
Netlify deployt automatisch. GitHub Pages ebenfalls (statischer Teil, ~30–50 s).

### Lokale Vorschau

`serve.py` im Projektordner (`python3 -m http.server 8843` tut es auch).
Für Claudes Browser-Pane: Projekt nach `<scratchpad>/moto-pizza-demo/` rsyncen,
Port in `serve.py` setzen, Vault-`.claude/launch.json` anpassen, dann `preview_start`.

---

## 2. Dateien

```
moto-pizza-demo/
├── index.html              524 Z. — Startseite (Hero, Karussell, Snacks, Getränke, Detroit, About, Order)
├── karriere.html           230 Z. — Mitarbeiterbewerbung          ← LIVE, NICHT ANFASSEN
├── dein-store.html         366 Z. — Franchise, 7-Schritt-Flow
├── faq.html                120 Z. — 14 Fragen, natives <details>-Accordion
├── allergene.html           88 Z. — Legende aller 14 EU-Allergene + Zusatzstoffe
├── css/style.css          1693 Z. — EIN Stylesheet für alles
├── js/main.js              571 Z. — Startseite (Karussell, Parallax, Reveal, Nav)
├── js/karriere.js          189 Z. — Mitarbeiterbewerbung          ← LIVE, NICHT ANFASSEN
├── js/dein-store.js        275 Z. — Franchise inkl. Step-Logik
├── data/menu.js            313 Z. — 10 Pizzen, 6 Misu, 8 Getränke, Allergene, MOTO_INFO
├── netlify.toml                   — publish ".", functions-Ordner, 2 Redirects
├── netlify/functions/
│   ├── apply.js            230 Z. — /api/apply    → Airtable „Mitarbeiter-Bewerbungen"  ← NICHT ANFASSEN
│   └── franchise.js        214 Z. — /api/franchise → Airtable „Franchise-Bewerbungen"
├── AIRTABLE-SETUP.md              — Env Vars + Spalten Mitarbeiter
├── FRANCHISE-SETUP.md             — Env Vars + Spalten + E-Mail-Vorlagen Franchise
└── assets/
    ├── images/   Pizzen, Misu, Getränke, Logos
    ├── fonts/    AdelleSansARA (8 Schnitte), Good Times, Archivo Black
    └── source|crops|grid/  Altbestand, nicht live referenziert
```

---

## 3. Design-System (unverändert lassen)

**Farben** (`:root` in `css/style.css`): `--pink #ec1e8d` · `--blue #16a3e6` · `--ink #141116`
· `--cream #fbf4ec` · `--cream-dim #f0e6da` · `--crust #e8912c` · `--white #ffffff`

**Schriften:** Good Times = `--font-display`/`--font-head` (Headlines, Nav, Buttons, Preise)
· AdelleSansARA = `--font-body` · Archivo Black nur für 4 Outline-Zeilen. Alle lokal, keine Google Fonts.

**MOTO-Wortmarke:** „MOTO" erscheint überall als SVG-Logotype (`<symbol id="moto-wordmark">`
in `index.html`), nie als getippter Text. viewBox `0 0 422 100`, Strichstärke 17.54,
Aspekt 4.22, Höhe `0.737em`. „MOTOR CITY"/„Motoren" bleiben bewusst normaler Text.

**Obere Navigation:** über dem pinken Hero **weiß**, ab `.is-scrolled` (cremefarbener
Hintergrund) **dunkel**. Menü: Menu · Über uns · Standort · FAQ · Karriere · Dein Store ·
Allergene. Umschaltpunkt Burger↔Leiste bei 900 px.

---

## 4. Fertige Bereiche der Website

- **Startseite:** Hero mit 20 Motor-Icons (Parallax + Entrance), Marquee, Statement,
  Pizza-Karussell (10 Pizzen, Swipe/Momentum/Infinite Loop), Snacks (6 Misu-Sorten),
  Getränke (8), Detroit-Story, About, Galerie, Standort
- **Allergene:** Kürzel bei jedem Produkt + eigene Legendenseite. Die 10 Pizzen tragen die
  Werte der **gedruckten Speisekarte** (Foto in `~/Desktop/Moto pizza/`, Datei
  `64170fe5-…JPG`). Misu und Getränke: `allergensPending: true` → Hinweis „noch zu bestätigen",
  weil die Papierkarte dafür keine Kürzel führt.
- **FAQ:** 14 Fragen. Drei Antworten bewusst neutral, weil die Fakten fehlen:
  **Zahlungsmöglichkeiten, Vorbestellen, Vor-Ort-Essen.**
- **Misu:** neues „MO misu"-Logo überall (Section-Logo + alle 6 Produktfotos).
  „Salted Caramel Variante 2" wurde vollständig entfernt.

---

## 5. Mitarbeiter-Bewerbungssystem — LIVE UND FUNKTIONIERT

`karriere.html` → `js/karriere.js` → `POST /api/apply` → `netlify/functions/apply.js`
→ Airtable **„Mitarbeiter-Bewerbungen"**.

21 Formularfelder, 6 Pflicht (name, email, phone, position, location, consent).
Status wird auf **„Neu"** gesetzt. Standort-Dropdown enthält genau **`Berlin- Alexanderplatz`**
(Bindestrich, dann Leerzeichen — zeichengenau, sonst legt Airtable eine Dublette an).

**Feldzuordnung:** name→Name · email→E-Mail · phone→Telefonnummer · position→Position
· location→Standort · address→Adresse · date→Bewerbungsdatum · motivation→Motivation
· available→Verfügbarkeit · unavailable→Nicht verfügbar · hours→Wochenstunden
· shift→Bevorzugte Arbeitszeiten · age→Mindestens 18 · standing→Stehend arbeiten
· physical→Körperliche Arbeit · experience→Gastro-Erfahrung · experienceText→Berufserfahrung
· more→Sonstiges · copy→Kopie erwünscht · consent→Einwilligung erteilt
· Lebenslauf → Attachment-Spalte **„Lebenslauf / Dokumente"** · Bewerbungsart → „Mitarbeiter-Bewerbung"

**Airtable-Automationen (vom Nutzer eingerichtet, laufen):** Status-Workflow
Neu → In Prüfung → Angenommen/Abgelehnt und die zugehörigen E-Mails.

---

## 6. Franchise-System „Dein Store" — Code fertig, Airtable offen

`dein-store.html` → `js/dein-store.js` → `POST /api/franchise` → `netlify/functions/franchise.js`
→ Airtable **„Franchise-Bewerbungen"** (eigene Tabelle, strikt getrennt).

### 7-Schritt-Flow

Alle Schritte bleiben im DOM und werden nur ein-/ausgeblendet → **kein Datenverlust** beim
Vor-/Zurückspringen; ein einziges FormData am Ende sieht jedes Feld. Weiterkommen erfordert
gültige Pflichtfelder des aktuellen Schritts; beim Absenden werden alle Schritte erneut
geprüft und der erste fehlerhafte angesprungen. Fortschrittsanzeige „x von 7" + Balken.

### Vollständiges Feldmapping (30 Felder, 11 Pflicht)

| Schritt | Formularfeld | Pflicht | Airtable-Spalte |
|---|---|---|---|
| 1 Dein Wunschstandort | region | ✔ | Wunschregion |
| | hasLocation | | Standort vorhanden |
| | locationType | | Standortart |
| | storeSize | | Storegröße |
| | locationDetails | | Standortbeschreibung |
| 2 Über dich | city | ✔ | Wohnort |
| | birthdate | | Geburtsdatum |
| 3 Beruf & Erfahrung | occupation | ✔ | Berufliche Situation |
| | job | | Aktuelle Tätigkeit |
| | occupationOther | | Berufliche Situation Sonstiges |
| | gastro | | Gastro-Erfahrung |
| | entrepreneur | | Unternehmerische Erfahrung |
| | gastroText | | Erfahrung Beschreibung |
| | entrepreneurText | | Unternehmerische Erfahrung Beschreibung |
| 4 Vorhaben | storeType | | Vorhaben |
| | multiStore | ✔ | Mehrere Standorte |
| | weeklyHours | ✔ | Zeitliche Verfügbarkeit |
| 5 Kapital & Zeitplan | capital | | Eigenkapital |
| | timeline | | Geplanter Start |
| | financing | | Zusatzfinanzierung |
| 6 Motivation | interest | | Interesse-Level |
| | why | ✔ | Motivation |
| | whyCity | ✔ | Standort-Potenzial |
| 7 Kontakt & Unterlagen | name | ✔ | Name |
| | email | ✔ | E-Mail |
| | phone | ✔ | Telefonnummer |
| | address | | Adresse |
| | docs | | **Unterlagen** (Attachment) |
| | copy | | Kopie erwünscht |
| | consent | ✔ | Einwilligung erteilt |
| automatisch | — | | Status = `Neu` |

`occupationOther` erscheint im Formular nur, wenn `occupation = "Sonstiges"`.

---

## 7. Technik: Airtable-Anbindung

**Beide Systeme teilen sich Token und Base**, nur die Tabelle unterscheidet sich.

### Environment Variables in Netlify

**Gesetzt und funktionierend — NICHT ändern:** `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`

Alle Spaltennamen haben Defaults (siehe `AIRTABLE-SETUP.md` / `FRANCHISE-SETUP.md`) und sind
per `AIRTABLE_FIELD_*` bzw. `FRANCHISE_FIELD_*` überschreibbar. **Keine neuen Env Vars nötig.**

### Zwei Airtable-Aufrufe je Anfrage

1. Datensatz: `POST https://api.airtable.com/v0/{base}/{table}` mit `typecast: true`
2. Anhang: `POST https://content.airtable.com/v0/{base}/{recordId}/{feld}/uploadAttachment`
   mit `{contentType, file (base64), filename}`

> **`api.airtable.com` beantwortet die Upload-Route mit 404.** Anhänge laufen ausschließlich
> über `content.airtable.com`. Das war ein realer Bug und ist behoben.

### Robustheit gegen fehlende Spalten

Airtable weist einen **kompletten** Datensatz zurück, sobald er eine unbekannte Spalte enthält.
Beide Functions lesen den Spaltennamen aus `UNKNOWN_FIELD_NAME`, entfernen **nur diesen Wert**
und versuchen es erneut. Ergebnis: Eine Bewerbung geht auch dann durch, wenn Spalten fehlen.
Übersprungene Spalten stehen im Netlify-Log und in der Antwort (`skippedFields`).
Sobald eine Spalte angelegt ist, landet ihr Wert automatisch dort — ohne Deploy.

### Upload-Grenzen

**4 MB**, geprüft im Browser *und* serverseitig. Grund: Netlify begrenzt eine Anfrage auf 6 MB,
Base64 vergrößert um ~33 %; Airtables eigenes Limit (5 MB) ist das großzügigere.
Erlaubt: PDF, DOC, DOCX, JPG, JPEG, PNG. Fehlt der Browser-MIME-Typ (häufig bei DOC/DOCX),
wird er aus der Dateiendung abgeleitet.
**Bei Änderung müssen `MAX_*_BYTES` in Frontend UND Function gemeinsam angepasst werden.**

### Rückmeldungen im Browser

| Antwort | Anzeige |
|---|---|
| `ok:true, attachment:"ok"/"none"` | grün-blaue Erfolgsmeldung |
| `ok:true, attachment:"failed"/"too_large"` | orange: „Anfrage eingegangen, Unterlagen nicht übertragen" |
| alles andere | pink: Fehler, **niemals** falscher Erfolg, Eingaben bleiben erhalten |

---

## 8. E-Mail-Funktionen

**Alle E-Mails laufen über Airtable-Automationen, nicht über Code.** Die Functions schreiben
nur den Datensatz; die Automation versendet.

- **Mitarbeiter:** eingerichtet und funktionierend (Nutzer).
- **Franchise:** **noch NICHT eingerichtet.** Fertige Vorlagen (Betreff + Text + Platzhalter)
  stehen in `FRANCHISE-SETUP.md` Abschnitt 4 und 5:
  - intern „🏪 Neue MOTO PIZZA Franchise-Bewerbung", Datei über *Attachments → Unterlagen*
  - Bestätigung „🍕 Deine Franchise-Anfrage bei MOTO PIZZA", Bedingung `Kopie erwünscht is checked`
  - Hinweis: Für „Hallo [Vorname]" braucht es eine Formelspalte
    `LEFT({Name}, FIND(" ", {Name} & " ") - 1)` — das Formular erfasst nur den vollen Namen.

---

## 9. Tests und Ergebnisse

**Mitarbeiter-System:** live vom Nutzer bestätigt — Bewerbungen landen in Airtable,
Status-Workflow und E-Mails laufen. Upload nach dem Host-Fix ebenfalls.

**Franchise-Function gegen Airtable-Mock (echte Base nie berührt):**
26 Prüfungen bestanden — 29 Werte + Status in *einem* Datensatz, alle neuen Felder,
„Sonstiges"-Freitext, eigene Tabelle, Upload über `content.airtable.com` in „Unterlagen",
alle 11 Pflichtfelder blockieren einzeln, >4 MB abgewiesen, fehlende Spalte übersprungen,
kein Token in der Antwort, GET → 405.

**Franchise im Browser:** alle 7 Schritte durchlaufen, Balken 14,3 %→100 %, „Weiter" ohne
Pflichtfeld blockiert, von Schritt 7 zurück auf 1 alle 13 geprüften Werte erhalten,
bedingtes Feld erscheint nur bei „Sonstiges", Absenden ohne Schritt-7-Pflichtfelder blockiert,
29 Felder an `/api/franchise`. Mobile 375 px einspaltig, kein Overflow. Keine Konsolenfehler.

**Regression nach jeder Änderung geprüft:** Karriere behält 38/18 px Abstände und blaue
Sektionstitel (Franchise-CSS ist auf `.page-franchise` gescopet und leakt nicht),
sendet unverändert an `/api/apply`. Startseite: 10 Pizzen, 6 Snacks, 8 Getränke,
16 Karussell-Slides, 20 Hero-Icons, 8 Wortmarken.

**NICHT getestet (technisch unmöglich ohne Zugang):** echter Airtable-Eintrag der
Franchise-Anfrage, Datei in Airtable, beide Franchise-E-Mails.

---

## 10. Behobene Fehler (nicht erneut einbauen)

| Fehler | Ursache | Fix |
|---|---|---|
| Lebenslauf kam nicht in Airtable an | Upload ging an `api.airtable.com` → 404 | `content.airtable.com` |
| Nav brach bei 900 px zweizeilig um | 5. Link + CTA passten nicht | CTA entfernt, `white-space: nowrap` |
| „Zurück"/„Absenden" auf Schritt 1 sichtbar | `.btn{display:inline-flex}` schlägt `[hidden]` | `.page-franchise .fsteps__nav [hidden]{display:none}` |
| Datumsfeld 2 px höher als Nachbarfeld | native Mindesthöhe | `appearance:none; min-height:0` |
| „BEWERBUNGSFORMULAR" lief bei 375 px über | langes unteilbares Wort | kleinerer clamp + `hyphens:auto` |
| Retry bei fehlender Spalte griff nicht | Regex auf JSON-Rohtext (escapte Quotes) | erst `JSON.parse`, dann `error.message` |

### Arbeitsumgebung-Eigenheiten (kein Website-Bug)

- `scroll-behavior: smooth` → für Screenshots `window.scrollTo({behavior:'instant'})`,
  sonst wirkt die Seite leer. Screenshots sind bei sehr hohem `scrollY` unzuverlässig →
  Abschnitte darüber temporär im DOM ausblenden.
- Browser cached CSS/JS aggressiv → nach Änderungen Preview-Server auf **neuem Port** starten.
- Der lokale `python3 http.server` kann kein POST → `501` beim Absenden ist erwartet und
  genau der getestete Fehlerfall.

---

## 11. Was NICHT verändert werden darf

1. `netlify/functions/apply.js` · `js/karriere.js` · `karriere.html`
2. Airtable-Tabelle „Mitarbeiter-Bewerbungen" und ihre Automationen
3. `AIRTABLE_TOKEN` und `AIRTABLE_BASE_ID`
4. Bestehende Airtable-Spalten löschen oder umbenennen
5. Bestehende Route `/api/apply` in `netlify.toml`
6. Design-System: Farben, Schriften, MOTO-Wortmarke, Nav-Verhalten
7. Startseite, Speisekarte, Allergene, FAQ, Standort
8. Regel: CSS für die Franchise-Seite **immer** auf `.page-franchise` scopen — `.cform*`
   ist mit der Karriere-Seite geteilt
9. Keine Secrets ins Frontend oder Repo (`.env` ist in `.gitignore`)

---

## 12. Offene Arbeiten

### Blockierend für den Franchise-Livegang (nur der Nutzer kann das)

1. **5 Airtable-Spalten anlegen** in „Franchise-Bewerbungen":
   Berufliche Situation · Berufliche Situation Sonstiges · Mehrere Standorte ·
   Zeitliche Verfügbarkeit · Interesse-Level
2. **2 Spalten um Optionen ergänzen:** Gastro-Erfahrung (6 Erfahrungsstufen statt Ja/Nein) ·
   Geplanter Start (`In 3–6 Monaten`, `In 6–12 Monaten`, `In 12–24 Monaten`)
   → vollständige Typen und Optionen: `FRANCHISE-SETUP.md` Abschnitt 2
3. **Kanban-Ansicht** nach Status anlegen
4. **Beide E-Mail-Automationen** einrichten (Vorlagen liegen bereit)
5. **Ende-zu-Ende-Test** über die Netlify-Adresse mit Datei

### Inhaltlich offen

- FAQ: Zahlungsmöglichkeiten, Vorbestellen, Vor-Ort-Essen — Antworten fehlen
- Misu (6 Sorten) und Getränke (8): Allergene brauchen Herstellerdeklaration
- Kimchi bei „Beef Lover": Papierkarte nennt `R` = „Krebs- ODER Weichtiere", die Website
  trennt R/E — welches zutrifft, ist offen
- Telefonnummer und Öffnungszeiten auf der Website sind Platzhalter

### Optional

- Standort-Dropdown Karriere: nur `Berlin- Alexanderplatz`; Cuvrystraße könnte ergänzt werden
- `README.md` ist veraltet

---

## 13. Exakter nächster Schritt

**Auf den Nutzer warten**, bis die 5 Franchise-Spalten und die 2 Optionslisten in Airtable
angelegt sind. Danach:

1. Ende-zu-Ende-Test über die Netlify-Adresse: `/dein-store.html` vollständig ausfüllen,
   PDF < 4 MB anhängen, absenden
2. Erwartet: grün-blaue Bestätigung; Datensatz in „Franchise-Bewerbungen" mit Status „Neu"
   und Datei in „Unterlagen"
3. Bei orangefarbener Meldung: Netlify → Functions → `franchise` → Logs prüfen
   (dort steht der Airtable-Statuscode samt Fehlertext und welche Spalten übersprungen wurden)
4. Erst danach die beiden E-Mail-Automationen scharf schalten und gegentesten

**Keine Code-Änderungen nötig, bevor dieser Test gelaufen ist.**
