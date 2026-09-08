# MOTO PIZZA — Projektübergabe

**Stand:** 09.09.2026 · **Live auf motopizza.de:** `327805a` · Working Tree sauber

> **Zuerst Abschnitt 15 lesen.** Er beschreibt den aktuellen, live geprüften Stand.
> Danach Abschnitt 14 — er gilt weiterhin für Netlify, die Karussells und die
> Stückpizza-Bilder, ist aber bei der Angebotssektion überholt: die dort beschriebenen
> MOTO DEALS gibt es nicht mehr, an ihrer Stelle stehen die MOTO MENÜS aus Abschnitt 15.
> Die Abschnitte 1–13 stammen vom 18.08.2026 und bleiben nur als Historie erhalten;
> die dort genannten Commits und Menü-Beschreibungen sind überholt. Für Karriere-,
> Franchise- und Airtable-Themen sind sie weiterhin gültig.

`README.md` ist veraltet — ignorieren.
Ergänzend: `AIRTABLE-SETUP.md` (Mitarbeiter-System) und `FRANCHISE-SETUP.md` (Franchise-System).

---

## 1. Projekt in einem Satz

Detroit-Style-Pizzeria-Website „MOTO PIZZA Berlin" — reines HTML/CSS/Vanilla-JS ohne Build-Step,
plus zwei serverseitige Netlify Functions, die Bewerbungen in Airtable schreiben.

### Pfade und Adressen

| | |
|---|---|
| Projektordner | `/Users/efeelbagli/Desktop/moto/moto-pizza-demo/` |
| GitHub | `https://github.com/sincinityberlin/moto-pizza-demo` (Branch `main`) |
| GitHub Pages (Altbestand) | `https://sincinityberlin.github.io/moto-pizza-demo/` — **statisch, ohne Functions** |
| Netlify (produktiv) | vom Nutzer verbunden; **nur dort funktionieren die Formulare** |
| Originalmaterial | `/Users/efeelbagli/Desktop/moto/Moto pizza/` (Speisekarten-Fotos, Logos, Produktbilder, Aktionsmotive) |

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

---

## 14. AKTUELLER STAND — live geprüft am 08.09.2026

**Live auf motopizza.de:** Commit `e76fdaf`. Dessen Inhalt ist identisch mit dem
freigegebenen `68b1313`; `e76fdaf` ist ein leerer Commit ohne Dateiänderung, der nur
den Netlify-Build ausgelöst hat.

### 14.1 Netlify — wieder funktionsfähig

Der **Personal Plan ist aktiv**, Production-Deployments laufen wieder. Ein Deploy ist
etwa 12 Sekunden nach dem Push live.

Vorgeschichte, damit sie sich nicht wiederholt: Zwischen dem 07. und 08.09. baute
Netlify nicht mehr. Vier Commits (`e3d6ec3`, `d4c81e4`, `b639c5f`, `68b1313`) lagen auf
GitHub und wurden nicht veröffentlicht; motopizza.de lieferte über zwei Tage unverändert
`965633d`. Ursache war das **erschöpfte Build-Kontingent**.

**Wichtig für den nächsten solchen Fall:** Netlify holt übersprungene Commits nach dem
Aufladen **nicht selbsttätig nach**. Es braucht einen neuen Auslöser — entweder im
Dashboard unter *Deploys → Trigger deploy → Clear cache and deploy site*, oder ein
leerer Commit (`git commit --allow-empty`), der nichts am Inhalt ändert.

Zur Diagnose taugt weder der Umweg über GitHub-Webhooks (Netlify hängt als GitHub-App
dran, `/hooks` ist leer) noch über Commit-Status (Netlify schreibt für dieses Repo
keine). Aussagekräftig ist nur der direkte Vergleich der ausgelieferten Datei, etwa
`curl -s https://motopizza.de/js/main.js | wc -c` gegen die lokale Größe. Query-Strings
brechen den Netlify-CDN-Cache **nicht**.

### 14.2 Was die Speisekarte seit dem 18.08. bekommen hat

- **Zwei Karussells**: Detroit Style (eckig, 25 × 25 cm) und New York Style (rund, 45 cm),
  beide mit denselben zehn Pizzen aus `MOTO_MENU`. Es ist dieselbe Funktion
  `initPizzaSelector()`, zweimal mit eigener Konfiguration aufgerufen — jeder Aufruf hält
  seinen Zustand in der eigenen Closure, deshalb sind die beiden unabhängig.
- **Style-Überschriften** über beiden Karussells, gemeinsame Klasse `style-head`.
- **Umschalter „Ganze Pizza / Stückpizza"** je Karussell. Die beiden Preiskästen *sind*
  der Umschalter; ein zusätzliches Bedienelement wäre doppelt gewesen. Der Klick tauscht
  nur `src` und `alt` der vorhandenen Slides — `pos` bleibt unangetastet, deshalb springt
  nichts. Standard: Ganze Pizza.
- **Preise** in `MOTO_PIZZA_STYLES` (`data/menu.js`): Detroit ganz 18,90 €, New York ganz
  22,00 €, Stück 5,90 € in beiden Styles.
- **MAX' PICK und TOP SELLER** in beiden Karussells, datengetrieben über die Flaggen
  `maxPick` und `topSeller`. Max' Pick springt über `goToData()` zum Top Seller — derselbe
  Weg wie die Pfeile, deshalb erscheint Top Seller auch beim normalen Blättern.
- ~~**MOTO DEALS** mit sechs Karten: drei Detroit, drei New York, je 6,90 €.~~
  **Überholt am 09.09.2026** — vollständig ersetzt durch die MOTO MENÜS, siehe Abschnitt 15.
- **Vorladen** der Stückbilder: einmal ruhig eine Sekunde nach `load`, zusätzlich sobald
  jemand den Umschalter ansteuert. Gemessen sind nach dem Klick alle Slides sofort da.

### 14.3 Die 20 Stückpizza-Bilder

`assets/images/slice-<id>.png` (Detroit) und `slice-ny-<id>.png` (New York), je zehn.
Quelle sind echte Stück-Fotos aus `~/Desktop/moto/Moto pizza/`; die Originale dort sind
unangetastet.

**Nicht erneut „optimieren" oder neu freistellen — der Stand ist freigegeben.**

**Nachtrag 08.09.2026, Commit `c5c0239`:** An einigen Konturen standen noch helle
Reste des Studiohintergrunds. Getrennt wird seither über das **Verhältnis** von
Kanalspanne zu Helligkeit statt über die absolute Sättigung — gemessen liegt der
Schatten bei 6 %, die Kruste bei 18 %, und das bleibt auch dort gültig, wo der
Schatten zur Auflagekante hin dunkler wird und eine absolute Schwelle ihn für Pizza
hält. Entfernt wird davon nur, was mit dem Bildrand zusammenhängt, damit helle
Stellen mitten auf der Pizza (Parmesan, Ricotta, helle Sauce) unberührt bleiben.
Helle Randpixel über alle 20 Bilder: von 4.017 auf 31. Leinwand, Flächennormierung
und Mittelpunkt sind dabei unverändert geblieben.

Wie sie entstanden sind, falls es je wiederholt werden muss:

1. **Freigestellt** wird über die Pizza, nicht über den Hintergrund. Der Weg über den
   Hintergrund scheitert am Studioschatten: er ist neutral wie der Hintergrund, seine
   weiche Auslaufkante aber texturiert — je nach Kriterium bleibt ein grauer Saum stehen
   oder heller Käse am Slice-Rand wird weggeschnitten. Die Pizza ist dagegen eindeutig:
   entweder farbig (Kruste, Sauce, Belag) oder hell **und** texturiert (Käse, Ricotta).
   Gemessen liegt die lokale Standardabweichung des Hintergrunds bei 0,7, die der
   Pizzaoberfläche bei 15,6.
2. **Kantenreinigung.** Die Weichzeichnung der Maske macht Pixel außerhalb der Kontur
   halbtransparent — das sind Hintergrund und Schatten, daher der helle Saum. Die weiche
   Kante sitzt deshalb auf echtem Pizzarand, und die Farbe der Randpixel kommt aus sechs
   Pixel Tiefe. Mit der Farbe direkt vom Rand bleibt der Saum bestehen, dort liegen schon
   Mischpixel (gemessen 255, 255, 250).
3. **Einheitliche Leinwand** 1500 × 1000 für alle 20, skaliert über die **Fläche** der
   Pizza statt über die Bounding-Box — ein Dreieck und ein Quadrat mit gleich hoher Box
   wirken sonst unterschiedlich groß. Flächenabweichung über alle 20: unter 0,2 %.

Weil die Einheitlichkeit damit in den Dateien liegt, braucht das CSS **keine Sonderregel
pro Variante**. Eine frühere Lösung über `--bild-max-h` wurde wieder entfernt; sie darf
nicht zurückkommen.

### 14.4 Live-Prüfung am 08.09.2026

Auf motopizza.de selbst geprüft, nicht lokal:

| Prüfpunkt | Ergebnis |
|---|---|
| Alle vier Kombinationen, je 10 Slides | **40 / 40 fehlerfrei** |
| Zuordnung Pizza 01 → Stück 01 | durchgehend korrekt |
| Detroit Stückpizza, gerenderte Bildbox | 654 × 436 bei allen zehn |
| New York Stückpizza, gerenderte Bildbox | 704 × 469 bei allen zehn |
| Alle 40 Karussellbilder | HTTP 200, keins fehlt |
| Kaputte Bilder | 0 |
| Helle Ränder / abgeschnittene Pizzen | keine, auf Pink und auf Blau geprüft |
| Horizontaler Overflow Desktop + Mobile | 0 |
| Konsolenfehler | keine |

### 14.5 Nicht verändern

Detroit- und New-York-Karussell samt Bewegung, Pfeilen, Loop, Easing und Nummerierung ·
die 20 Stückbilder und die 20 Ganzpizza-Bilder · Namen, Zutaten, Allergene, Reihenfolge ·
alle Preise · MAX' PICK und TOP SELLER · MOTO MENÜS (Abschnitt 15) · Dessert · Getränke · Galerie ·
Navigation · Hero · die Marquee-Zeile „FRISCH AUS DEM DURCHLAUFOFEN".

### 14.6 Arbeitsweise, die sich bewährt hat

Lokale Vorschau nach jeder CSS- oder JS-Änderung auf einem **neuen Port** starten, sonst
liefert der Browser Zwischenstände aus dem Cache. Deployt wird ausschließlich über
`git push origin main`; Netlify baut selbst.

---

## 15. AKTUELLER STAND — live geprüft am 09.09.2026

**Live auf motopizza.de:** Commit `327805a` „MOTO DEALS durch die acht MOTO Menues ersetzt".
Vorgänger: `c5c0239` (Kantenkorrektur der Stückbilder, 20-%-Eröffnungsdeal aus der Hero
entfernt) und `e76fdaf`. Working Tree sauber, `main` und `origin/main` gleichauf.

Deployment lief über den bestehenden Weg: `git push origin main`, Netlify baut selbst.
Die neue Fassung war rund 20 Sekunden nach dem Push ausgeliefert. An Deployment-Konfiguration,
Branches, Domain und DNS wurde nichts geändert.

### 15.1 Die MOTO-MENÜS-Sektion

Steht zwischen Speisekarte und Dessert — **exakt an der Stelle der früheren MOTO DEALS**.
Reihenfolge der Seite: `#menu` → `#menues` → `#snacks` (Dessert / MO MISU) → `#drinks` → …

Aufbau: Eyebrow-Pille „DEIN MOTO · DEIN MENÜ", Titel **MOTO** (pink) **MENÜS** (blau),
Unterzeile „Mehr MOTO. Mehr Geschmack.", darunter der Menü-Carousel mit Zähler 01/08 und
acht Punkten. Sektionsgrund, Typografie und die gestrichelten Bögen sind dieselben wie
zuvor bei den Deals, damit die Sektion an ihrem Platz nicht wie ein Fremdkörper wirkt.

### 15.2 Die acht Menüs — Reihenfolge, Preise, Bilddateien

Reihenfolge in `MOTO_MENUES` (`data/menu.js`) = Anzeigereihenfolge.

| Nr | Name | Inhalt | Preis | Bilddatei in `assets/images/` |
|---|---|---|---|---|
| 1 | MOTO Solo | 1× Detroit Pizza 25 × 25 cm + 1× Getränk 0,33 l | ab 16,90 € | `menue-1-moto-solo.png` |
| 2 | MOTO Full Tank | 1× Detroit Pizza + 1× Getränk + 1× MO MISU | ab 20,90 € | `menue-2-moto-full-tank.png` |
| 3 | MOTO Double | 2× Detroit Pizza + 2× Getränke | ab 31,90 € | `menue-3-moto-double.png` |
| 4 | MOTO Date Night | 2× Detroit Pizza + 2× Getränke + 1× MO MISU | ab 35,90 € | `menue-4-moto-date-night.png` |
| 5 | MOTO Crew | 3× Detroit Pizza + 3× Getränke + 2× MO MISU | ab 49,90 € | `menue-5-moto-crew.png` |
| 6 | MOTO Family | 4× Detroit Pizza + 4× Getränke + 2× MO MISU | ab 64,90 € | `menue-6-moto-family.png` |
| **7** | **NY Solo** | 1× New York Style Pizza 45 cm + 1× Getränk | ab 19,90 € | `menue-7-ny-solo.png` |
| **8** | **NY Full Tank** | 1× New York Style Pizza 45 cm + 2× Getränke + 1× MO MISU | ab 24,90 € | `menue-8-ny-full-tank.png` |

Menü 1–6 sind Detroit Style (25 × 25 cm), **Menü 7 und 8 New York Style (45 cm, rund)**.
Der Unterschied erscheint als kleiner Chip in der Bildunterschrift; es bleibt **eine**
gemeinsame Sektion, keine zweite New-York-Sektion.

Die Motive kamen fertig gestaltet vom Nutzer aus `~/Desktop/moto/Moto pizza/` (dort unter
UUID-Namen abgelegt, siehe unten) und wurden **byte-identisch** ins Projekt kopiert —
nichts generiert, freigestellt, zugeschnitten oder umkodiert. **Sie sind final und dürfen
nicht bearbeitet werden.**

| im Projekt | Original im Quellordner |
|---|---|
| `menue-1-moto-solo.png` | `5DAA11CD-DD68-46C3-BBA5-34ADE31B5065.PNG` |
| `menue-2-moto-full-tank.png` | `F6AD58BF-A4D1-40AB-85C7-C39AC531E342.PNG` |
| `menue-3-moto-double.png` | `33B91065-0BAD-44E6-B624-2B5C3B16A084.PNG` |
| `menue-4-moto-date-night.png` | `ACF6A3F0-CD8B-41EE-89B7-59664F1A4C39.PNG` |
| `menue-5-moto-crew.png` | `C5DC9DE3-9817-4ACB-8B5E-DD9C6C66A887.PNG` |
| `menue-6-moto-family.png` | `18CF95B4-3867-4362-92FE-7A4937AC24AF.PNG` |
| `menue-7-ny-solo.png` | `05A9E18E-FD7D-41D5-A336-940CAA914D73.PNG` |
| `menue-8-ny-full-tank.png` | `9095E32A-D071-4941-BC78-6F01F27EFA25.PNG` |

Sieben Motive sind 1254 × 1254 px, **Menü 7 als einziges 1370 × 1148 px**. Die echten Maße
stehen als `bw`/`bh` in den Daten und als `width`/`height` im Markup, damit der Browser den
Platz vor dem Laden kennt. Zusammen wiegen die acht rund 19 MB; sie laden verzögert
(`loading="lazy"`), die Startseite wird davon nicht langsamer. Eine WebP-Fassung wäre etwa
zehnmal kleiner, wurde aber bewusst **nicht** erzeugt, weil die Motive final sind.

### 15.3 Entfernt: MOTO DEALS

Vollständig entfernt, nicht versteckt und nicht deaktiviert:

- `index.html`: die gesamte `<section class="deals" id="deals">`
- `data/menu.js`: die Liste `MOTO_DEALS` (sechs Einträge à 6,90 €)
- `js/main.js`: `initDeals()` samt Aufruf
- `css/style.css`: der komplette `.deals` / `.deal-card`-Block
- `assets/images/`: die sechs Bilder `deal-frico.png`, `deal-pepperoniking.png`,
  `deal-beeflover.png`, `deal-ny-frico.png`, `deal-ny-pepperoniking.png`,
  `deal-ny-beeflover.png` (zusammen rund 9,6 MB)

Im Code gibt es keine Restklasse und keinen Restverweis mehr; live liefern alle sechs
Bildpfade HTTP 404. **Die Dateien stecken weiterhin in der Git-Historie** (bis `c5c0239`)
und wären über `git checkout c5c0239 -- assets/images/deal-...` zurückholbar.

### 15.4 Wie der Carousel funktioniert

Derselbe Transport wie zuvor bei den Deals: **CSS `scroll-snap`**, keine Bibliothek.
Wischen, Trägheit, Trackpad, Shift-Wheel, Pfeiltasten und Scrollbar kommen damit vom
Browser, und weil die Karten *innerhalb* der Bahn scrollen, kann die Seite selbst nie eine
Querscrollbar bekommen.

Ein Unterschied zu den Deals: dort lagen mehrere Karten nebeneinander und die Bahn rastete
**links** ein. Ein Menü ist ein ganzes Werbemotiv und bekommt die Bühne für sich — die
Karten rasten deshalb **mittig** ein (`scroll-snap-align: center`), links und rechts schauen
die Nachbarn an. Damit auch die erste und die letzte Karte in die Mitte fahren können, ist
das seitliche Polster der Bahn `max(var(--pad), (100% − var(--karte)) / 2)`.

Zwei Fallen, die dabei aufgetreten sind und nicht zurückkehren dürfen:

1. **`--karte` muss absolut sein, nicht in Prozent.** Das mittige Polster wird aus dieser
   Breite berechnet; eine Prozentangabe löst sich gegen die dadurch bereits verkleinerte
   Innenbreite auf — die Karte schrumpft sich selbst. Gemessen kamen so 240 px statt
   560 px heraus. Deshalb `vw` mit `min()`: 72vw mobil, `min(58vw, 470px)` ab 620 px,
   `min(56vw, 560px)` ab 900 px, `min(48vw, 680px)` ab 1180 px.
2. **Position über `getBoundingClientRect()`, nicht über `offsetLeft`.** `offsetLeft` zählt
   ab dem positionierten Vorfahren und weiß nichts von der Scrollposition der Bahn; die
   Mitte läge je nach Scrollstand woanders. Der Versatz zwischen Kartenmitte und Bahnmitte
   ist dagegen immer genau die Strecke, die noch zu scrollen ist.

Kein Autoplay. Die Fokuskarte ist ab 900 px leicht vergrößert (`scale(1)` gegen `0.94`),
bei `prefers-reduced-motion` entfällt jede Transition.

### 15.5 Warum die Motive nie beschnitten werden

Die Motive tragen MOTO-Logo, Menünummer, Namen, Produkte, Preis und Kleingedrucktes
bereits selbst. Die Karte gibt deshalb **nur die Breite** vor, die Höhe folgt dem
Seitenverhältnis des Bildes (`width: 100%; height: auto`). Kein `object-fit: cover`, kein
festes `aspect-ratio` — sonst würde Menü 7 als einziges nicht quadratisches Motiv entweder
beschnitten oder mit Balken versehen. Geprüft: dargestelltes und natürliches
Seitenverhältnis stimmen bei allen acht überein.

Darunter steht bewusst nur **eine schmale Zeile** (Nummer, Name, Stil, Preis). Alles
Weitere ein zweites Mal danebenzuschreiben hätte die Sektion nur zugestellt. Der
Alternativtext des Bildes nennt dagegen den vollen Inhalt, damit Vorlesen und Bildausfall
dieselbe Information liefern wie das Motiv.

### 15.6 Live-Prüfung am 09.09.2026

Auf motopizza.de selbst geprüft, nicht lokal:

| Prüfpunkt | Ergebnis |
|---|---|
| Sektion `#menues` vorhanden, `#deals` verschwunden | ✓ |
| Acht Menüs, Reihenfolge, Namen, Preise, Bilddateien | **8 / 8 korrekt** |
| Menü 7 = NY Solo, Menü 8 = NY Full Tank | ✓ |
| Die acht Motive live gegen die lokalen Dateien (MD5) | **8 / 8 byte-identisch** |
| Alle acht Bilder geladen | ✓ |
| Alte `deal-*.png` | **6 × HTTP 404** |
| `MOTO_DEALS` in den Live-Daten | nicht mehr vorhanden |
| Desktop 1440 / Tablet 834 / Mobile 390 — Kartenbreite | 680 / 470 / 281 px |
| Pfeil rechts bis 08/08, dort deaktiviert | ✓ auf allen drei |
| Pfeil links zurück auf 01/08, dort deaktiviert | ✓ auf allen drei |
| Punkt 7 springt exakt auf NY Solo | ✓ Abweichung 0 px |
| Karten überlappen | nein |
| Horizontaler Seiten-Overflow | 0, auch bei 320 px |
| Konsolenfehler | keine |
| Beide Pizza-Karussells und Dessert weiterhin da | ✓ |

### 15.7 Nicht verändern

Zusätzlich zu Abschnitt 14.5:

Die acht Aktionsmotive — **weder bearbeiten, freistellen, zuschneiden, umkodieren noch
ersetzen** · Reihenfolge, Namen, Inhalte und Preise der acht Menüs · die Position der
Sektion zwischen Speisekarte und Dessert · die mittige Rastung und die absolute
Kartenbreite (siehe die beiden Fallen in 15.4) · dass Höhe dem Bildseitenverhältnis folgt.

Die MOTO-MENÜS-Sektion ist **eine** Sektion. Menü 7 und 8 bekommen keine eigene.
