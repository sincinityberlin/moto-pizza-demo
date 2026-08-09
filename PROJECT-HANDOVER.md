# MOTO PIZZA Berlin — Projektübergabe

**Stand:** 09.08.2026, ca. 20:35 Uhr · **Zweck:** Vollständiger Übergabestand, damit ein neuer Claude-Chat ohne Kenntnis der bisherigen Konversation nahtlos weiterarbeiten kann.

Diese Datei ist die **maßgebliche, aktuelle Quelle der Wahrheit**. `README.md` im Projektordner ist **veraltet** (beschreibt einen Stand vor mehreren Redesigns) — ignorieren. Ältere `.claude/launch.json`-Konfigurationen (siehe Abschnitt 7) sind ebenfalls teilweise veraltet — Details dort.

Dies ist eine **rein lokale Demo-Website** (nicht deployed, `<meta name="robots" content="noindex, nofollow">` gesetzt) für **MOTO PIZZA**, eine fiktive Detroit-Style-Pizzeria in Berlin. Kein Build-Step, kein Framework, kein Git-Repository — reines HTML/CSS/Vanilla-JS.

### Projektpfad (kanonisch, alles wird hier direkt bearbeitet)
```
/Users/efeelbagli/Desktop/moto-pizza-demo/
```

---

## 1. Aktueller Gesamtstatus

Die Seite ist vollständig gebaut und mehrfach live im Browser getestet (Desktop + Mobile). Die Hero-Section wurde in dieser Session mehrfach iterativ überarbeitet (siehe Abschnitt 4) und ist aktuell an einem vom Nutzer per Referenzbild vorgegebenen Zielzustand ausgerichtet. Die 10 Pizza-Produktbilder im Karussell wurden in dieser Session komplett neu freigestellt (siehe Abschnitt 6) — das war die **zuletzt abgeschlossene Aufgabe**.

**Nächster geplanter Arbeitsschritt** (vom Nutzer explizit vorgegeben, siehe Abschnitt 9) ist noch **nicht** umgesetzt.

### Dateistruktur
```
moto-pizza-demo/
├── index.html              Alle Sections, per data-section="..." markiert (522 Zeilen)
├── css/style.css            Design-Tokens (:root) oben, dann ein Block pro Section (923 Zeilen)
├── js/main.js                Eine Funktion pro Feature (476 Zeilen)
├── data/menu.js              MOTO_MENU-Array (10 Pizzen) + MOTO_INFO-Objekt (102 Zeilen)
├── serve.py                  Selbst-lokalisierender lokaler Static-Server
├── README.md                 ⚠️ VERALTET — nicht mehr 1:1 aktuell, nicht vertrauen
├── .claude/launch.json       ⚠️ Enthält einen alten, nicht mehr funktionierenden Preview-Befehl (siehe Abschnitt 7)
└── assets/
    ├── images/                Alle live genutzten Bilder (Logo, Hero-Pizza, 10× Pizza-JPG + 10× NEUE Pizza-PNG)
    ├── source/                 4 Original-Flyer-Fotos (JPG), Rohmaterial für die Pizza-Freistellung
    ├── crops/, grid/            Ältere Zwischenschritte, nicht mehr live referenziert (unkritisch, können weg)
    └── — WICHTIG: außerhalb des Projektordners liegt neues Rohmaterial, siehe Abschnitt 6.4 und 9
```

---

## 2. Branding / Design-Tokens

Alle Farben/Fonts/Spacing zentral in `css/style.css`, `:root`-Block (Zeilen 5–46).

### Markenfarben (Pink/Blau/Weiß — aus dem echten MOTO-Logo)
```css
--pink: #ec1e8d;        /* Hauptfarbe */
--pink-dim: #b8156c;
--blue: #16a3e6;         /* zweite Hauptfarbe */
--crust: #e8912c;        /* Akzent, selten genutzt */
--crust-dark: #b5641a;
--ink: #141116;          /* fast Schwarz — Basis für aktuell noch dunkle Sections */
--ink-soft: #211b22;
--cream: #fbf4ec;        /* warmes Off-White — Seiten-Grundhintergrund (body) */
--cream-dim: #f0e6da;
--white: #ffffff;
```

### NEU in dieser Session: Naturfarben-Palette für die Hero-Cartoon-Toppings
Ausdrücklich **nur** für die dekorativen Hero-Zutaten, **nie** für Branding/UI (Pink/Blau bleiben reserviert):
```css
--tomato-red: #e5432c;   --tomato-dark: #b82f1c;
--carrot-orange: #f2932e; --carrot-dark: #c96f16;
--leaf-green: #4f9d3d;    --leaf-dark: #356b28;
--pepper-yellow: #f5c518; --pepper-yellow-dark: #d9a20f;
--onion-cream: #f7ecd9;   --onion-purple: #9a6b9e;
--mush-beige: #ecdcc0;    --mush-dark: #cbb083;
--olive-dark: #3a3f2e;
--cucumber-flesh: #eaf6df; --lettuce-green: #8fce5c;
```

### Typografie
```css
--font-display: "Archivo Black", "Space Grotesk", sans-serif;  /* Headlines, Slogans, Preise */
--font-head:    "Space Grotesk", sans-serif;                    /* Nav, Labels, Buttons */
--font-body:    "Inter", sans-serif;                             /* Body-Copy */
```
Fonts über Google Fonts `<link>` geladen (kein Self-Hosting).

### Layout-Tokens
```css
--container: 1240px;
--pad: clamp(20px, 5vw, 64px);
--ease: cubic-bezier(0.16, 1, 0.3, 1);       /* Standard-Easing, überall */
--ease-bam: cubic-bezier(0.34, 1.56, 0.64, 1); /* Overshoot — Hero-Entrance-„Bam"-Effekt */
--radius: 22px;
```

### Logo & Bild-Assets
| Datei | Verwendung |
|---|---|
| `assets/images/logo.png` | Einziges Logo-Asset, transparentes PNG. Verwendet im Hero (`img.hero__logo`) und Footer (`img.footer__logo`). Weiß-Darstellung ausschließlich per CSS-Filter `brightness(0) invert(1)`. **Im Nav gibt es aktuell KEIN Logo mehr** (siehe Abschnitt 4.2 — bewusst entfernt). |
| `assets/images/hero-pizza-full.png` | Freigestelltes Pizzafoto für den Hero, 1566×947px, transparent. Lokal per PIL/Chroma-Key erstellt. |
| `assets/images/pizza-<id>.png` | **NEU in dieser Session** — freigestellte, komplette Produktbilder für das Karussell, siehe Abschnitt 6. |
| `assets/images/pizza-<id>.jpg` | Alte, teilweise gecroppte Originalbilder mit pinkem Fotohintergrund. **Noch vorhanden**, werden aktuell nur noch von der Gallery-Sektion (`renderGallery()`) und der „Warum Detroit Style?"-Sektion referenziert (dort bewusst so belassen, siehe Abschnitt 6.3). |
| `assets/images/hero-pizza.jpg` | Nicht mehr im Hero, aber weiterhin in der Detroit-Feature-Section aktiv. |
| `assets/source/`, `assets/crops/`, `assets/grid/` | Altes Rohmaterial der ursprünglichen Bildaufbereitung, nicht mehr live referenziert, unkritisch. |

### Designregeln (weiterhin gültig)
- Helle Sections (`statement`, `menu`, `order`) nutzen `--cream`/`--white` mit `--ink`-Text.
- **Dunkle Sections** (`detroit`, `about`, `gallery`, `footer`) nutzen aktuell noch `--ink`-Hintergrund mit `--cream`-Text — **soll laut Nutzer im nächsten Schritt auf Weiß umgestellt werden** (Abschnitt 9).
- Übergänge hell↔dunkel per `border-radius: 40px 40px 0 0` auf der jeweils folgenden Section.
- Große Abschluss-Statements nutzen das Muster: eine Zeile Outline-Pink, eine Zeile Outline-Blau, eine Zeile solide — via `-webkit-text-stroke` + `color: transparent`.
- Scroll-Reveal ist Standard außerhalb der Hero (siehe Abschnitt 5) — neue Textblöcke/Bilder sollten `data-reveal` bekommen.
- **Bildintegrität ist hartes Kriterium:** komplette Pizza sichtbar, alle vier Ränder erkennbar, kein Zoom, kein Crop, `object-fit: contain` wo relevant. Gilt für jedes Pizzabild auf der gesamten Seite.
- Alle Produktbilder ausschließlich vom Nutzer bereitgestellt — **nie KI-generiert**, nie extern bezogen. Freistellungen ausschließlich lokal per PIL/Python (Chroma-Key), aus Datenschutzgründen (keine Nutzerbilder an Dritte senden). Diese Regel gilt unverändert auch für die in Abschnitt 9 geplante nächste Bild-Überarbeitung.

---

## 3. Hero-Section — aktueller Stand (mehrfach iterativ überarbeitet)

Die Hero-Section war der Hauptfokus dieser Session und wurde **mehrfach** komplett überarbeitet, zuletzt auf Basis eines vom Nutzer bereitgestellten **Referenzbildes** (Poster-Layout mit dichter Zutaten-Rahmung). Der aktuelle Stand gilt als der zuletzt vom Nutzer nicht mehr beanstandete Zwischenstand — es gab jedoch **keine explizite finale Abnahme** durch den Nutzer, bevor die Session zur Pizza-Bild-Aufgabe wechselte. Im nächsten Chat ggf. kurz gegenprüfen, ob der Hero-Stand noch passt.

### 3.1 Struktur (DOM-Reihenfolge in `index.html`, Section `hero`)
```
.hero (data-section="hero")
  .hero__toppings (aria-hidden, absolut positioniert, z-index:1, hinter .hero__inner)
    18× .hero__topping--<name>  ← Cartoon-Gemüse, siehe Abschnitt 3.3
  .hero__inner (z-index:2)
    img.hero__logo               ← weißes Logo, oben mittig
    h1.hero__title
      span                        „CHEESE TO<br>THE EDGE." (weiß, solide)
      span.hero__title--outline   „CRUNCH IN<br>EVERY BITE." (Outline-Blau)
    .hero__product
      img#heroImg.hero__product-img  ← komplette Pizza, object-fit:contain
    .hero__actions
      a.btn.btn--solid.btn--big  „Speisekarte" → #menu
      a.btn.btn--ghost.btn--big  „Standorte"   → #order
  a.hero__scroll                 ← kleiner Scroll-Chevron unten mittig
```

### 3.2 Logo-Position
- Nav (`.nav`) hat **kein** Logo mehr — nur Links (Desktop) bzw. Burger (Mobile), rechtsbündig via `margin-left:auto` auf `.nav__burger` (nötig, weil ohne das Logo-Element sonst der einzige verbleibende Flex-Child links kleben würde).
- Hero-Logo sitzt oben mittig, `.hero { padding-top: 52px / 60px (≥900px) }`, `.hero__logo { margin-bottom: 34px / 46px }` — bewusst reduziertes Top-Padding + vergrößerter Logo→Slogan-Abstand, damit das Logo klar oben im „Header-Bereich" wahrgenommen wird, nicht direkt am Slogan klebt.

### 3.3 Slogan / Headline
- **Erzwungener 4-Zeilen-Umbruch** via `<br>` (nicht dem Fließtext überlassen): „CHEESE TO" / „THE EDGE." (weiß) + „CRUNCH IN" / „EVERY BITE." (Blau-Outline). Das war eine explizite Korrektur — vorher lief der Text als 1–2 natürlich umbrechende Zeilen, der Nutzer wollte exakt diese Poster-Zeilenaufteilung.
- Schriftgröße deutlich vergrößert: `clamp(3.1rem, 13vw, 5rem)` Basis, `clamp(3rem, 6.4vw, 6.8rem)` ab 900px, `clamp(2.2rem, 10.8vw, 3.1rem)` unter 600px (Mobile-Override — **Vorsicht**: zu groß gewählte Werte lassen „EVERY BITE." auf 3 statt 2 Zeilen umbrechen, das ist in dieser Session bereits einmal passiert und wieder korrigiert worden).

### 3.4 Pizza
- `assets/images/hero-pizza-full.png`, `object-fit: contain`, `max-height: 46vh` Basis / `56vh`… tatsächlich zuletzt auf `64vh` ab 900px erhöht (deutlich vergrößert gegenüber dem ursprünglichen Stand, auf Wunsch „Pizza soll eines der größten Elemente sein").
- Eigene **sehr dezente** Scroll-Parallax-Bewegung über `initHeroParallax()` (siehe Abschnitt 5), bewusst viel subtiler als die Toppings.

### 3.5 Buttons
Unverändert: „Speisekarte" (weiß gefüllt, pinker Text) + „Standorte" (transparent, weißer Rand/Text), scoped Override in `.hero__actions .btn--solid/.btn--ghost`, da die globalen `.btn`-Farben auf dem pinken Hero unsichtbar wären.

### 3.6 Cartoon-Toppings — 18 Elemente, echte Naturfarben
Größter inhaltlicher Umbau der Hero-Section in dieser Session. Liegen in `.hero__toppings`, jedes als eigenes `<div class="hero__topping hero__topping--<name>">` mit Inline-SVG (handgezeichnet, kein externes Asset) plus `data-speed/-drift/-rotate/-tilt/-scale`-Attributen für die Scroll-Parallax (siehe Abschnitt 5).

**Die 18 Elemente** (Typ, Farbe, Größentier L/M/S):
| Klasse | Motiv | Farbe | Größe |
|---|---|---|---|
| `--tomate-1` | Tomate | Rot | L |
| `--karotte-1` | Karotte | Orange + grünes Blatt | L |
| `--paprika-gruen` | Paprika | Grün | M |
| `--chili-rot-1` | Chili | Rot | M |
| `--zwiebel` | Zwiebel | Creme/Lila-Ring | S |
| `--olive-1` | Olive | Dunkelgrün/Schwarz + rotes Pimento | S |
| `--karotte-2` | Karotte (Dupl.) | Orange | L |
| `--pilz-1` | Champignon | Beige/Weiß | M |
| `--gurke-1` | Gurke | Grün/hellgrün | S |
| `--jalapeno-1` | Jalapeño | Grün, rundlicher | S |
| `--chili-gruen` | Chili | Grün | M |
| `--tomate-2` | Tomate (Dupl.) | Rot | M |
| `--pilz-2` | Champignon (Dupl.) | Beige | M |
| `--gurke-2` | Gurke (Dupl.) | Grün | M |
| `--basilikum` | Basilikumblatt | Grün | M |
| `--olive-2` | Olive (Dupl.) | Dunkelgrün | S |
| `--paprika-gelb` | Paprika | Gelb | L |
| `--salat` | Salat/Lettuce | Hellgrün | M |

Positionierung: Prozentwerte (`top/left/right/bottom`) relativ zur vollen `.hero`-Box, rahmen Logo/Slogan/Pizza auf allen Seiten ein (oben links/rechts große Elemente, seitlich vom Slogan/zwischen Slogan und Pizza mittlere/kleine Elemente, unten/seitlich der Pizza weitere). **Wichtiger gelöster Bug:** zwei Elemente (`--zwiebel`, `--olive-1`) saßen ursprünglich zu nah an der zweiten (transparenten Outline-)Slogan-Zeile und schimmerten durch die hohlen Buchstaben durch — wurden nach unten in die textfreie Lücke zwischen Slogan und Pizza verschoben (`top: 58%/60%`). Bei künftigen Positionsänderungen: **Elemente nie in die Y-Range der Outline-Textzeile legen**, da dort „durchscheinen" kann (Vollflächen-Text wie Zeile 1 ist unkritisch, da opak).

**Mobile-Reduktion** (bewusst nicht auf 5–6 reduziert, Nutzer wollte „voll und lebendig" auch auf Mobile):
- `<900px`: `--karotte-2`, `--tomate-2` ausgeblendet → 16 sichtbar.
- `<600px`: zusätzlich `--pilz-2`, `--gurke-2`, `--olive-2` ausgeblendet → 13 sichtbar.

### 3.7 Entrance-Animation (CSS-`animation-delay`, kein JS-Timing)
Läuft automatisch beim Laden, unabhängig von JS, komplett in `css/style.css` im Block `@media (prefers-reduced-motion: no-preference)`:
1. **Logo** — schneller Fade+Scale, `delay 0.05s`.
2. **Slogan zeilenweise** — `heroLineIn` mit `--ease-bam`-Overshoot, Zeile 1 `delay 0.15s`, Zeile 2 `delay 0.26s`.
3. **Pizza** — `heroPizzaIn`, fährt von unten ein, `delay 0.78s`.
4. **18 Toppings gestaffelt** — je `delay`-Schritt `+0.04s`, `1.40s` bis `2.08s`, meist von oben (`heroToppingIn`), einige explizit von links/rechts (`heroToppingInLeft/Right`, via `animation-name`-Override auf 4–5 Elementen für Abwechslung).
5. **Buttons** — zuletzt, `delay 2.4s`.

Gesamtdauer ca. **2.9s** (etwas mehr als ursprünglich vom Nutzer genannte „1,5–2,5s", bewusst akzeptiert wegen der hohen Toppings-Anzahl — dem Nutzer gegenüber transparent kommuniziert).

**Kritischer, bereits gefundener und behobener Bug:** Der Handoff von Entrance-Animation zu Scroll-Parallax (siehe Abschnitt 5) machte die Toppings kurzzeitig unsichtbar, weil beim Löschen der CSS-Animation (`el.style.animation = "none"`) die zugrunde liegende statische `opacity: 0`-Basisregel wieder griff. Fix in `js/main.js`: der `animationend`-Handler setzt jetzt explizit **zusätzlich** `el.style.opacity = "1"` mit.

### 3.8 Bekannte offene Kleinigkeiten im Hero
- Keine explizite finale Nutzer-Abnahme des aktuellen Hero-Standes (s.o.).
- Bei sehr kurzen Desktop-Viewports (~900px Höhe) muss ggf. leicht gescrollt werden, um die Buttons zu sehen — bewusster Trade-off für die vom Nutzer gewünschte größere Pizza/Headline, nicht mehr „alles im ersten Viewport ohne Scrollen" wie in früheren Session-Phasen gefordert.

---

## 4. Chronologie der Hero-Iterationen in dieser Session (zur Einordnung)

Falls der nächste Chat auf Widersprüche zwischen älteren Zwischenständen stößt: Reihenfolge der Korrekturrunden war:
1. Logo nach oben, mehr Cartoon-Toppings (5 Basis-Zutaten: Tomate/Karotte/Paprika/Chili/Zwiebel), Entrance-Animation Grundgerüst, Scroll-Parallax Grundgerüst.
2. Korrektur: Toppings hatten Marken-Farben (Pink/Blau) statt Naturfarben → auf echte Naturfarben umgestellt (siehe 3.6).
3. Nutzer schickt Referenzbild („STOP – nicht mehr frei interpretieren") → Layout so nah wie möglich am Referenzbild nachgebaut: Logo-Position, Slogan-Zeilenumbruch, Pizza-Größe, Toppings-Dichte (12 → 18 Elemente) alle daraufhin angepasst.
4. Feinkorrekturen: Mobile-Zeilenumbruch-Bug (Schrift zu groß), Text-Durchschein-Bug bei Zwiebel/Olive (zweimal aufgetreten bei unterschiedlichen Viewports, zweimal behoben).

---

## 5. Scroll-/Parallax-System (Hero) — technischer Mechanismus

Zwei unabhängige, aber koordinierte Systeme in `js/main.js`:

### 5.1 `initHeroParallax()` (Pizza, sehr dezent)
Einfacher Scroll-Listener auf `#heroImg`, `translateY` bis max. 36px über die Hero-Höhe normiert. Unverändert seit mehreren Sessions, funktioniert zuverlässig.

### 5.2 `initHeroToppingsParallax()` (18 Toppings, Kernstück)
- Liest pro `.hero__topping` die `data-speed/-drift/-rotate/-tilt/-scale`-Attribute einmalig aus.
- **Wichtig gelöstes Problem aus einer früheren Runde:** Bewegung darf NICHT relativ zur Hero-Höhe normiert werden (`scrollY / heroHeight`) — das machte den Effekt fast unsichtbar. Stattdessen: `progress = clamp(scrollY / 560, -0.4, 2.4)` — direkt an rohe Scroll-Pixel gekoppelt, dadurch schon nach wenigen hundert Pixel Scroll deutlich sichtbar.
- Pro Frame (rAF-gedrosselt): `translate3d(drift*progress, speed*progress, 0) rotate(tilt + rotate*progress) scale(1 + scale*progress)`.
- Mobile: `intensity = 0.55` (gedämpfte Bewegungsdistanz, aber weiterhin sichtbar).
- **Handoff-Mechanismus zur Entrance-Animation:** Jedes Topping bekommt einen `animationend`-Listener; erst wenn die CSS-Entrance-Animation für dieses Element fertig ist, wird `el.style.animation = "none"` gesetzt (+ `opacity:1`, siehe Bugfix 3.7) und die von da an laufend aktualisierte Inline-`transform` wird sichtbar. Vorher (während die CSS-Animation noch läuft) gewinnt die CSS-Animation im Cascade gegenüber Inline-Styles, es gibt also **keinen** Sprung beim Übergang — das `heroToppingIn`-Keyframe-Ende (`rotate(var(--rest-rot))`) ist bewusst identisch zur JS-Ruheposition bei `progress=0`.
- `prefers-reduced-motion: reduce` wird respektiert (Toppings zeigen dann nur ihre `tilt`-Rotation, keine Animation/Bewegung).

**Getestet und bestätigt funktionierend:** Vorwärts-/Rückwärts-Scroll reversibel, kein Kleben/Springen, Desktop und Mobile.

---

## 6. Pizza-Karussell / Produktbilder (zuletzt bearbeiteter Bereich, ABGESCHLOSSEN)

### 6.1 Ausgangsproblem
Die 10 Pizza-Produktbilder (`assets/images/pizza-<id>.jpg`) waren teils gecroppt/angeschnitten und hatten einen sichtbaren **pinken Fotohintergrund als Teil der JPG-Datei selbst** (nicht per CSS entfernbar). Ursache: Die Originaldateien stammen aus einem Flyer-Grid-Layout (`assets/source/*.JPG`, 4 Dateien), in dem jede der 10 Pizzen als Teil einer 2-Spalten-Tabelle abgebildet ist, umgeben von dekorativer Linien-Grafik (Icons) auf pinkem Hintergrund plus Preis-/Beschreibungstext.

### 6.2 Lösung — lokale Neu-Freistellung per Python/PIL (kein KI-Dienst)
Alle 10 Pizzen wurden in dieser Session komplett neu aus den Original-Flyer-Fotos (`assets/source/64170fe5-5e65-4c0b-98c7-88a27e105996.JPG`) zugeschnitten und freigestellt:
1. Für jede Pizza wurde eine großzügige Ausschnitt-Region im Quellbild bestimmt (die Pizza selbst ist bei 9 von 10 Fotos **vollständig mit allen vier Ecken** im Quellmaterial vorhanden — wurde vorher nur zu eng zugeschnitten).
2. **Chroma-Key-Freistellung**: Farbdistanz-Berechnung zu einem gesampelten Referenz-Pink (`RGB(217,54,112)`), weiche Alpha-Kante per Smoothstep + leichtem Gaussian-Blur.
3. **Kernproblem gelöst**: Die dekorativen weißen Linien-Icons im Flyer-Hintergrund sind farblich („weit weg von Pink") nicht von der Pizza unterscheidbar — reine Farbdistanz reichte nicht. Lösung: Ein manuell pro Pizza definiertes **Polygon/Oktagon** gattet zusätzlich, welcher Bildbereich überhaupt für Opazität in Frage kommt (schließt die Bildecken, wo die Icons sitzen, aus; die Pizza selbst liegt immer innerhalb). Kombiniert mit einer zusätzlichen „größte zusammenhängende Komponente"-Prüfung *innerhalb* des Polygons für Restfälle.
4. Auto-Trim auf den finalen Alpha-Bounding-Box (+ Padding).
5. Speicherung als **PNG mit Transparenz** unter `assets/images/pizza-<id>.png`.

Das Verarbeitungsskript liegt (nur für diese Session) unter `/private/tmp/claude-501/.../scratchpad/process_pizza.py` — **nicht** Teil des Projekts, bei Bedarf im nächsten Chat neu schreiben, falls weitere Bilder auf dieselbe Art freigestellt werden sollen (siehe Abschnitt 9, dort ist es ohnehin nicht mehr nötig, da neue, bereits vollständige Fotos vorliegen).

### 6.3 Code-Änderungen
- `js/main.js`, Funktion `initPizzaSelector()` (Karussell): Bild-Referenz von `assets/images/pizza-${p.id}.jpg` auf `assets/images/pizza-${p.id}.png` geändert.
- `js/main.js`, Funktion `renderGallery()` (Endlos-Scroll-Streifen weiter unten auf der Seite): **bewusst NICHT geändert**, bleibt bei `.jpg`. Grund: Die Gallery nutzt `object-fit: cover` für einen Foto-Streifen-Look; mit den eng freigestellten, transparenten PNGs würde `cover` wieder in die Pizza hineinzoomen/croppen (genau das ursprüngliche Problem). CSS (`css/style.css` Zeile ~884) unverändert: `.gallery__item img { object-fit: cover; }`.
- `index.html`, „Warum Detroit Style?"-Section: 3 hardcodierte Bildreferenzen (`pizza-moto.jpg`, `pizza-bighog.jpg`, `pizza-honeyinferno.jpg`) **bewusst nicht geändert** — dort ebenfalls `object-fit: cover` für bewusste Nahaufnahmen/Textur-Ausschnitte, kein Vollbild-Kriterium.
- `.selector__frame img`-CSS (Karussell) war bereits vorher korrekt (`object-fit: contain; max-width/height: 76%`) — das Problem lag ausschließlich am Bildmaterial, nicht am CSS. Keine CSS-Änderung nötig/vorgenommen.

### 6.4 Ergebnis — Stand nach Live-Verifikation im Browser (Desktop, alle 10 durchgeklickt)
| # | Pizza | Status |
|---|---|---|
| 01 | MOTO | ✅ vollständig, sauber freigestellt |
| 02 | PEPPERONI KING | ⚠️ **Bekannte Einschränkung**: Die rechte obere Ecke der Pizza ist im **Original-Flyer-Foto selbst** abgeschnitten (außerhalb des fotografierten Bereichs, nicht rekonstruierbar ohne KI-Generierung, die laut Projektregel ausgeschlossen ist). Zusätzlich war ein kleiner pinker Icon-Rest sichtbar, wurde durch engere Zuschnitts-Politur reduziert. |
| 03 | BEEF LOVER | ✅ vollständig, sauber |
| 04 | HONEY INFERNO | ✅ vollständig, sauber (Fix: angrenzendes Nachbarbild-Fragment entfernt) |
| 05 | BIG HOG | ✅ vollständig, sauber (Fix: Text-„K"-Fragment + Icon-Rest entfernt) |
| 06 | LEMON SHRIMP | ✅ vollständig, sauber (Fix: Preis-Text-Bleed entfernt) |
| 07 | CRÈME DE POULET | ✅ vollständig, sauber (Fix: Preis-Text-Bleed entfernt) |
| 08 | ROOT | ✅ vollständig, kleine Icon-Reste in den Ecken deutlich reduziert (nicht 100% restlos, aber unauffällig) |
| 09 | PLANT | ✅ vollständig, sauber (Fix: seitlicher Crop behoben) |
| 10 | FRICO | ✅ vollständig, sauber |

**Offen/nicht 100% perfekt:** #02 Pepperoni King (Foto-Materialgrenze, siehe oben) und in geringerem Maß #08 Root (minimale, kaum sichtbare Icon-Restspuren in den Bildecken). Alle anderen 8 sind vollständig sauber. Dies ist dem Nutzer gegenüber noch **nicht explizit final kommuniziert** worden — die Session wurde für diese Übergabe unterbrochen, direkt nachdem die letzte Korrekturrunde (Root/Honeyinferno/Bighog) durchgeführt und die finalen PNGs bereits ins echte Projektverzeichnis gespeichert wurden. **Ein finaler Live-Browser-Check der allerletzten Korrekturrunde (Root/Honeyinferno/Bighog-Fixes) auf Desktop UND Mobile steht noch aus** — die Dateien sind zwar korrekt gespeichert (siehe Abschnitt 8), aber der allerletzte Sichttest im Karussell speziell für diese 3 Bilder wurde durch die Übergabe-Anfrage unterbrochen.

### 6.5 Alle 10 Pizzen — Produktdaten (aus `data/menu.js`, unverändert)
| id | Name | Kategorie | Preis | Badge |
|---|---|---|---|---|
| moto | MOTO | Der Klassiker | 22,00 € | Signature |
| pepperoniking | Pepperoni King | Für Salami-Fans | 22,00 € | — |
| beeflover | Beef Lover | Herzhaft & scharf | 22,00 € | Bestseller |
| honeyinferno | Honey Inferno | Süß trifft scharf | 22,00 € | — |
| bighog | Big Hog | BBQ Deluxe | 22,00 € | — |
| lemonshrimp | Lemon Shrimp | Vom Meer | 22,00 € | — |
| cremedepoulet | Crème de Poulet | Cremig & mild | 22,00 € | — |
| root | Root | Für Pilzfans | 22,00 € | — |
| plant | Plant | Vegetarisch | 22,00 € | Veggie |
| frico | Frico | Simply cheesy | 22,00 € | — |

Jeder Eintrag hat zusätzlich `short`/`desc`. `MOTO_INFO`-Objekt (Adresse/Telefon/etc.) existiert in `data/menu.js`, wird aber weiterhin **nicht** dynamisch gerendert (Order-Section hat die Werte hart in `index.html` kodiert — unverändert seit früheren Sessions, nicht in dieser Session angefasst).

### 6.6 Karussell-Funktionalität — NICHT verändert, weiterhin wie gehabt
Swipe/Drag/Touch/Maus/Trackpad, Momentum, Snap, Infinite Loop, Pfeile, Tastatur — alles in `initPizzaSelector()`, komplett unangetastet in dieser Session (nur die Bild-Dateiendung geändert, siehe 6.3). Sollte weiterhin einwandfrei funktionieren, war aber im allerletzten Moment vor der Übergabe nicht erneut explizit re-getestet (nur die Bilddarstellung wurde geprüft, nicht Swipe-Mechanik erneut — diese war aber in keiner Weise Teil der Änderung).

---

## 7. Lokale Vorschau starten

**Einfachster Weg (funktioniert immer):**
```bash
cd ~/Desktop/moto-pizza-demo
python3 -m http.server 8843
```
Dann `http://localhost:8843` im Browser öffnen. `serve.py` im Projektordner tut dasselbe automatisch (`python3 serve.py`, lokalisiert sich selbst).

**Für Claudes `preview_start`-Tool (Browser-Pane):**
Das Sandbox-Environment hat **keinen direkten Zugriff auf `~/Desktop`**. Funktionierende Lösung in dieser Session: Projekt per `rsync` in das Scratchpad-Verzeichnis der jeweiligen Session kopieren, `.claude/launch.json` (im **Vault-Root**, `/Users/efeelbagli/Library/Mobile Documents/iCloud~md~obsidian/Documents/second-brain/second-brain/.claude/launch.json` — **nicht** im Projektordner) auf `<scratchpad>/moto-pizza-demo/serve.py` zeigen lassen, dann `preview_start`. Der Scratchpad-Pfad ist **session-spezifisch** und existiert im neuen Chat nicht mehr — im neuen Chat also neu einrichten:
1. Eigenes Scratchpad-Verzeichnis ermitteln.
2. `rsync -a --exclude '.git' ~/Desktop/moto-pizza-demo/ <scratchpad>/moto-pizza-demo/`
3. Vault-`.claude/launch.json` `runtimeArgs` auf `<scratchpad>/moto-pizza-demo/serve.py` anpassen.
4. `preview_start` mit `name: "moto-pizza-demo"`.
5. **Nach jeder Code-Änderung erneut `rsync`**, sonst arbeitet die Preview auf altem Stand.

**Bekannter Cache-Stolperstein:** `python3 -m http.server` sendet keine Cache-Control-Header. Das Browser-Pane cached CSS/JS teils hartnäckig auch nach Server-Neustart. Zuverlässiger Workaround: in einem **frischen Tab** (`tabs_create`) navigieren und danach per `javascript_tool` den `<link>`-`href` sowie ggf. das `<script src="js/main.js">` mit einem `?v=timestamp`-Query-Parameter neu setzen, um den Cache zu umgehen.

**Bekanntes Screenshot-Tool-Artefakt:** Nach mehrfachem `resize_window` auf demselben Tab kann ein Screenshot wie „in eine kleine Box oben links gequetscht" aussehen — kein echter CSS-Bug, sondern ein Tool-Rendering-Artefakt. Lösung: frischen Tab öffnen, einmal navigieren, höchstens einmal resizen, dann screenshotten.

**Port:** `8843` (durchgängig).

---

## 8. Verifikation — Dateien tatsächlich auf der Festplatte gespeichert

Zum Zeitpunkt dieser Übergabe geprüft (nicht nur Scratchpad/Preview-Kopie, sondern das **echte** Projektverzeichnis):
```
/Users/efeelbagli/Desktop/moto-pizza-demo/index.html         — 32.623 Bytes, zuletzt geändert 08.08. 23:02
/Users/efeelbagli/Desktop/moto-pizza-demo/css/style.css      — zuletzt geändert 08.08. 23:05
/Users/efeelbagli/Desktop/moto-pizza-demo/js/main.js         — zuletzt geändert 09.08. 19:22
/Users/efeelbagli/Desktop/moto-pizza-demo/assets/images/pizza-*.png  — alle 10 vorhanden, zuletzt geändert 09.08. 20:29
```
Kein Git-Repository — Versionierung erfolgt nicht, alle Änderungen sind direkt und final im Dateisystem. Es gibt **keine** Datenverluste zu befürchten, da alle Edits in dieser Session direkt mit dem `Edit`/`Write`-Tool auf `/Users/efeelbagli/Desktop/moto-pizza-demo/...` (dem echten Pfad) vorgenommen wurden — der Scratchpad-Ordner war ausschließlich eine **Kopie** für die Browser-Vorschau, niemals die primäre Arbeitskopie.

---

## 9. NÄCHSTER GEPLANTER ARBEITSSCHRITT (noch NICHT umgesetzt — nur dokumentiert)

Der Nutzer hat **neue, vollständige** Bild-Assets hochgeladen, die im nächsten Arbeitsschritt verwendet werden sollen. Diese liegen **außerhalb des Projektordners** unter:
```
/Users/efeelbagli/Desktop/Moto pizza/
```
Dort befinden sich (Stand dieser Übergabe) **17 neue Bilddateien** (JPG, UUID-Dateinamen, hochgeladen 09.08. ca. 20:20 Uhr — zu unterscheiden von den 4 älteren, bereits bekannten Flyer-Quelldateien vom 07.08., die ebenfalls noch in diesem Ordner liegen). Die neuen Dateien wurden in dieser Session **nicht mehr geöffnet/gesichtet** (Übergabe-Anweisung kam dazwischen) — sie sind laut Nutzerangabe:
- Je ein **vollständiges Original-Foto pro Pizza** (alle 10), auf denen die komplette viereckige Detroit-Pizza mit allen vier Ecken sichtbar ist (bessere Ausgangslage als die bisherigen Flyer-Crops — macht die aufwändige Polygon-Freistellungs-Methodik aus Abschnitt 6.2 voraussichtlich überflüssig, da kein Icon-/Text-Übersprechen aus einem Flyer-Grid mehr zu erwarten ist).
- **Lava Cake / Schoko-Cake**
- **Cheesecake**
- **Red Bull Blue / Juneberry**
- **Red Bull Pink / Whiteberry**
- **Limonade**
- **lila Limonade**

Die genaue Zuordnung Dateiname → Motiv ist **noch offen** und muss im nächsten Chat zuerst durch Sichtung der Bilder geklärt werden (z. B. per `Read`-Tool auf jede Datei).

### Explizit vom Nutzer vorgegebene nächste Schritte (Reihenfolge/Priorität nicht weiter spezifiziert):
1. **Alle bisherigen, teils gecroppten Pizza-Bilder auf der GESAMTEN Website** (nicht nur im 10-Pizzen-Karussell, sondern auch in Informations-/Produktbeschreibungsbereichen, also inkl. der „Warum Detroit Style?"-Section, die aktuell bewusst noch alte `.jpg`-Nahaufnahmen nutzt — hier hat sich die Vorgabe also gegenüber Abschnitt 6.3 erweitert) durch die neuen, vollständigen Original-Bilder ersetzen.
2. Dabei: komplette Pizzen sichtbar, keine Ecken abgeschnitten, Hintergründe der Produktbilder sauber entfernen → transparente Produktbilder (gleiches Qualitätskriterium wie in Abschnitt 6).
3. **Noch vorhandene dunkle Section-Hintergründe durch weiße ersetzen** — betrifft laut aktueller Codebasis (Abschnitt 2, `background: var(--ink)`) die Sections `detroit` (Zeile 666), `about` (Zeile 780), `gallery` (Zeile 880) und `footer` (Zeile 912) in `css/style.css`. **Wichtig mitdenken:** Diese Sections nutzen aktuell durchgängig `--cream`/`--white`-farbigen Text auf dunklem Grund (`color: var(--cream)` etc.) sowie Outline-Text-Effekte, die auf hellem Hintergrund farblich neu austariert werden müssen (z. B. `-webkit-text-stroke` auf Cream/Pink/Blau, `.feature__num` transparent+Outline, `.about__finale-line--fill { color: var(--blue) }` — auf Weiß ggf. andere Fill-Farbe nötig für Kontrast). Reine 1:1-Farbumkehr wird vermutlich nicht ausreichen, hier ist Sorgfalt gefragt.
4. **Neue Kategorie „Snacks"** ergänzen.
5. **Neue Kategorie „Getränke"** ergänzen (passend zu den neu hochgeladenen Red-Bull-/Limonade-Bildern).

**Ausdrücklich vom Nutzer betont:** Diese Änderungen sollten in der laufenden Session **nicht mehr** begonnen werden — sie sind für den **nächsten** Chat vorgesehen. Diese Handover-Datei dient ausschließlich der verlustfreien Übergabe.

---

## 10. Sonstiges / Technische Rahmenbedingungen (unverändert aus früheren Sessions)

- Kein Git-Repository.
- Keine externen Requests außer Google Fonts.
- `<meta name="robots" content="noindex, nofollow">` gesetzt.
- Alle Produktbilder ausschließlich vom Nutzer bereitgestellt, nie KI-generiert (harte Projektregel, gilt auch für Abschnitt 9).
- Bei Unsicherheit über den „richtigen" aktuellen Stand: **diese Datei sticht** README.md und alte `.claude/launch.json`-Konfigurationen.

---

## Kurz-Zusammenfassung für den allerersten Blick

Fertige, lokale Detroit-Style-Pizza-Demo-Website „MOTO PIZZA Berlin". Pink/Blau/Weiß-Markenwelt. Hero-Section wurde in dieser Session mehrfach an ein vom Nutzer vorgegebenes Referenzbild angeglichen: Logo oben mittig, großer 4-zeiliger Poster-Slogan, große freigestellte Pizza, 18 handgezeichnete Cartoon-Gemüse in Naturfarben rund um den Content verteilt, choreografierte Entrance-Animation (~2,9s: Logo→Slogan→Pizza→Toppings→Buttons), danach aktiver Scroll-Parallax-Effekt für alle Toppings. Das 10-Pizzen-Swipe-Karussell wurde komplett neu freigestellt (Python/PIL, lokal, kein KI-Dienst) — 8 von 10 Bildern zu 100% sauber, 2 mit kleinen, dokumentierten Einschränkungen. **Nächster Schritt** (noch nicht begonnen): neue, vollständige Bild-Assets aus `~/Desktop/Moto pizza/` (10 Pizzen + 6 Dessert/Getränke-Bilder) website-weit einbinden, dunkle Sections auf Weiß umstellen, Kategorien „Snacks" und „Getränke" ergänzen.
