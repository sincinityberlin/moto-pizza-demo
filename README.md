# MOTO PIZZA — Demo-Website (lokal, nicht veröffentlicht)

Detroit-Style-Pizza-Website für MOTO PIZZA, Berlin. Eigenständige visuelle Identität
inspiriert von der UX-Qualität von eatmunchies.de (große Typografie, große Fotos,
verspielte Micro-Interactions) — keine Munchies-Assets, Farben oder Texte übernommen.

## Ansehen

Einfach `index.html` per Doppelklick im Browser öffnen — die Seite braucht keinen
Server (keine externen Datenanfragen, nur `<script src>`/`<link>`, die auch über
`file://` funktionieren).

Für Live-Reload beim Entwickeln reicht z. B.:

```bash
cd ~/Desktop/moto-pizza-demo
python3 -m http.server 8843
```

dann `http://localhost:8843` öffnen.

## Struktur (modular, für schnelle Prompt-Änderungen)

```
index.html          Seitenstruktur, in Sektionen mit data-section="..." markiert
css/style.css        Design-Tokens oben (Farben/Fonts/Radius), danach pro Sektion
js/main.js           Ein Feature pro Funktion (Nav, Reveal, Marquee, Magnetic Buttons …)
data/menu.js         Pizza-Karte & Kontaktdaten — Inhalte hier ändern, nicht im HTML
assets/images/       Fertige Bilder (Logo + 10 Pizzen + Hero) aus deinem Flyer-Material
assets/source/       Deine 4 Original-Dateien, unangetastet
assets/crops/        Zwischenschritte beim Zuschneiden (kann gelöscht werden)
```

Beispiele für Prompts, die jetzt einfach funktionieren:
- „Ändere die Hero-Farben auf …“ → Design-Tokens in `css/style.css`
- „Füge eine neue Pizza XY hinzu“ → neuer Eintrag in `data/menu.js` + Bild in `assets/images/`
- „Der Marquee-Text soll anders lauten“ → `index.html`, Abschnitt `data-section="marquee"`

## Hinweise zu den Daten

- Alle Bilder (Logo, Hero, 10 Pizzen) stammen aus deinen 4 bereitgestellten
  Flyer-/Menü-Dateien (`assets/source/`) — es wurden keine neuen Bilder generiert.
  Die Fotos sind Ausschnitte aus einem Flyer-Layout, daher moderat in der Auflösung;
  für eine spätere Veröffentlichung empfehle ich echte Produktfotografie in hoher Auflösung.
- Telefonnummer (`030 000 000 00`) und Öffnungszeiten waren im Flyer als Platzhalter
  hinterlegt (00.00–00.00) — ich habe die Uhrzeiten durch einen generischen Platzhaltertext
  ersetzt. Bitte vor Veröffentlichung mit echten Daten ersetzen (`data/menu.js`).
- Seite ist mit `<meta name="robots" content="noindex, nofollow">` markiert und nirgends
  deployed — rein lokale Demo wie gewünscht.
