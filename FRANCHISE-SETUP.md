# Franchise-Anfragen („Dein Store") → Airtable

Die Seite `dein-store.html` sendet an `/api/franchise` →
`netlify/functions/franchise.js` → Airtable-Tabelle **Franchise-Bewerbungen**.

Vollständig getrennt vom Mitarbeiter-System: eigene Seite, eigenes Skript, eigene
Function, eigene Tabelle. `apply.js`, `karriere.html` und `js/karriere.js` wurden
nicht angefasst. Token und Base werden geteilt — es ist dieselbe Base.

## 1. Environment Variables

**Neu benötigt: keine.** `AIRTABLE_TOKEN` und `AIRTABLE_BASE_ID` sind bereits
gesetzt und werden mitbenutzt.

Optional, nur falls eine Spalte anders heißt als der Default:

`AIRTABLE_FRANCHISE_TABLE` (`Franchise-Bewerbungen`) ·
`FRANCHISE_FIELD_NAME` (`Name`) · `FRANCHISE_FIELD_EMAIL` (`E-Mail`) ·
`FRANCHISE_FIELD_PHONE` (`Telefonnummer`) · `FRANCHISE_FIELD_ADDRESS` (`Adresse`) ·
`FRANCHISE_FIELD_CITY` (`Wohnort`) · `FRANCHISE_FIELD_BIRTHDATE` (`Geburtsdatum`) ·
`FRANCHISE_FIELD_REGION` (`Wunschregion`) ·
`FRANCHISE_FIELD_HAS_LOCATION` (`Standort vorhanden`) ·
`FRANCHISE_FIELD_LOCATION_TYPE` (`Standortart`) · `FRANCHISE_FIELD_STORE_SIZE` (`Storegröße`) ·
`FRANCHISE_FIELD_MULTI_STORE` (`Mehrere Standorte`) ·
`FRANCHISE_FIELD_WEEKLY_HOURS` (`Zeitliche Verfügbarkeit`) ·
`FRANCHISE_FIELD_LOCATION_DETAILS` (`Standortbeschreibung`) ·
`FRANCHISE_FIELD_STORE_TYPE` (`Vorhaben`) ·
`FRANCHISE_FIELD_JOB` (`Aktuelle Tätigkeit`) ·
`FRANCHISE_FIELD_OCCUPATION` (`Berufliche Situation`) ·
`FRANCHISE_FIELD_OCCUPATION_OTHER` (`Berufliche Situation Sonstiges`) ·
`FRANCHISE_FIELD_GASTRO` (`Gastro-Erfahrung`) ·
`FRANCHISE_FIELD_GASTRO_TEXT` (`Erfahrung Beschreibung`) ·
`FRANCHISE_FIELD_ENTREPRENEUR` (`Unternehmerische Erfahrung`) ·
`FRANCHISE_FIELD_ENTREPRENEUR_TEXT` (`Unternehmerische Erfahrung Beschreibung`) ·
`FRANCHISE_FIELD_CAPITAL` (`Eigenkapital`) · `FRANCHISE_FIELD_FINANCING` (`Zusatzfinanzierung`) ·
`FRANCHISE_FIELD_TIMELINE` (`Geplanter Start`) ·
`FRANCHISE_FIELD_WHY` (`Motivation`) · `FRANCHISE_FIELD_WHY_CITY` (`Standort-Potenzial`) · `FRANCHISE_FIELD_INTEREST` (`Interesse-Level`) · `FRANCHISE_FIELD_DOCS` (`Unterlagen`) ·
`FRANCHISE_FIELD_COPY` (`Kopie erwünscht`) ·
`FRANCHISE_FIELD_CONSENT` (`Einwilligung erteilt`) ·
`FRANCHISE_FIELD_STATUS` (`Status`) · `FRANCHISE_STATUS_NEW` (`Neu`) ·
`FRANCHISE_SET_STATUS` (`true`)

## 2. Tabelle „Franchise-Bewerbungen" anlegen

Neue Tabelle in derselben Base. Bestehende Tabellen nicht anfassen.

| Spalte | Typ |
|---|---|
| Name | Single line text |
| E-Mail | Email |
| Telefonnummer | Phone |
| Adresse | Single line text |
| Wohnort | Single line text |
| **Geburtsdatum** | **Date** (ISO, `YYYY-MM-DD`) |
| Wunschregion | Single line text |
| Standort vorhanden | Single select: `Ja` · `Nein` · `Ich bin aktuell auf Standortsuche` |
| **Standortart** | **Single select:** `Innenstadt / Highstreet` · `Einkaufszentrum` · `Food Court` · `Wohngebiet` · `Bahnhof / Verkehrslage` · `Gewerbegebiet` · `Noch offen` |
| **Storegröße** | **Single select:** `Unter 50 m²` · `50–80 m²` · `80–120 m²` · `120–180 m²` · `Über 180 m²` · `Noch offen` |
| **Mehrere Standorte** | **Single select:** `Ja, definitiv` · `Ja, wenn der erste Standort erfolgreich läuft` · `Vielleicht später` · `Nein, aktuell nur einen Standort` · `Noch offen` |
| **Zeitliche Verfügbarkeit** | **Single select:** `Unter 10 Stunden` · `10–20 Stunden` · `20–30 Stunden` · `30–40 Stunden` · `Vollzeit / 40+ Stunden` · `Ich möchte den Store durch einen Geschäftsführer betreiben lassen` |
| Standortbeschreibung | Long text |
| Vorhaben | Single select: `Einen neuen MOTO PIZZA Store eröffnen` · `Einen bestehenden Gastronomiebetrieb umwandeln` · `Noch unentschlossen` |
| Aktuelle Tätigkeit | Single line text |
| **Berufliche Situation** | **Single select:** `Angestellt` · `Selbstständig` · `Unternehmer/in` · `Investor/in` · `Gastronom/in` · `Student/in` · `Sonstiges` |
| **Berufliche Situation Sonstiges** | **Single line text** |
| Gastro-Erfahrung | Single select **(Optionen geändert):** `Keine Erfahrung` · `Unter 1 Jahr` · `1–3 Jahre` · `3–5 Jahre` · `5–10 Jahre` · `Über 10 Jahre` |
| Erfahrung Beschreibung | Long text |
| **Unternehmerische Erfahrung** | **Single select:** `Ja` · `Nein` |
| **Unternehmerische Erfahrung Beschreibung** | **Long text** |
| Eigenkapital | Single select: `Unter 25.000 €` · `25.000–50.000 €` · `50.000–100.000 €` · `100.000–150.000 €` · `150.000–250.000 €` · `Über 250.000 €` · `Möchte ich persönlich besprechen` |
| **Zusatzfinanzierung** | **Single select:** `Ja` · `Nein` · `Noch offen / muss geprüft werden` |
| Geplanter Start | Single select **(Optionen geändert):** `So schnell wie möglich` · `Innerhalb von 3 Monaten` · `In 3–6 Monaten` · `In 6–12 Monaten` · `In 12–24 Monaten` · `Noch offen` |
| Motivation | Long text |
| **Standort-Potenzial** | **Long text** |
| **Interesse-Level** | **Single select:** `Ich informiere mich zunächst` · `Ich bin interessiert` · `Ich bin sehr interessiert` · `Ich möchte konkret einen Standort eröffnen` · `Ich möchte so schnell wie möglich starten` |
| **Unterlagen** | **Attachment** |
| Kopie erwünscht | Checkbox |
| Einwilligung erteilt | Checkbox |
| **Status** | **Single select:** `Neu` · `In Prüfung` · `Kontakt aufgenommen` · `Gespräch geplant` · `Angenommen` · `Abgelehnt` |

Fett = neu oder mit geänderten Optionen gegenüber der ersten Fassung.
Die frühere Spalte `Alter` wird nicht mehr befüllt, aber auch nicht gelöscht —
sie kann bleiben oder von Hand entfernt werden.

Die Bindestriche in den Beträgen und Zeiträumen sind **Halbgeviertstriche (–)**,
kein normaler Bindestrich — sonst legt Airtable doppelte Optionen an.

Fehlt eine Spalte, geht die Anfrage trotzdem durch: Die Function entfernt den
unbekannten Wert und legt den Datensatz ohne ihn an. Welche Spalten übersprungen
wurden, steht im Netlify-Log und in der Antwort (`skippedFields`).

## 2b. Formular-Ablauf

Die Anfrage läuft über sieben Schritte (`dein-store.html`, `js/dein-store.js`).
Alle Schritte bleiben im DOM und werden nur ein-/ausgeblendet, deshalb geht beim
Vor- und Zurückspringen kein Wert verloren und ein einziges FormData am Ende
sieht jedes Feld. Weiterkommen setzt gültige Pflichtfelder des jeweiligen
Schritts voraus; beim Absenden werden alle Schritte erneut geprüft und der
erste fehlerhafte wird angesprungen.

1. Dein Wunschstandort · 2. Über dich · 3. Beruf & Erfahrung ·
4. Dein MOTO PIZZA Vorhaben · 5. Kapital & Zeitplan · 6. Motivation ·
7. Kontaktdaten & Unterlagen

## 3. Kanban-Ansicht

In der Tabelle: **Grid ▾ → Kanban → Create new view**, „Stack by" auf **Status**.
Die Spalten erscheinen in der Reihenfolge der Select-Optionen.

## 4. Automation: interne Benachrichtigung

Airtable → Automations → **When record created**, Tabelle `Franchise-Bewerbungen`
→ Action **Send email** an eure interne Adresse.

**Betreff**

```
🏪 Neue MOTO PIZZA Franchise-Bewerbung
```

**Inhalt** (Felder als Platzhalter einfügen)

```
Neue Franchise-Anfrage bei MOTO PIZZA

Name:                  {Name}
E-Mail:                {E-Mail}
Telefon:               {Telefonnummer}
Wunschstadt:           {Wunschregion}
Standort vorhanden:    {Standort vorhanden}
Gastronomie-Erfahrung: {Gastro-Erfahrung}
Eigenkapital:          {Eigenkapital}
Geplanter Start:       {Geplanter Start}

Warum MOTO PIZZA:
{Motivation}
```

Für die Datei: in der Send-email-Action unter **Attachments** das Feld
`Unterlagen` auswählen — genau wie beim Mitarbeiter-System.

## 5. Automation: Bestätigung an den Interessenten

Zweite Automation, **When record created**, mit Bedingung
`Kopie erwünscht` **is checked** → Action **Send email**, Empfänger `{E-Mail}`.

**Betreff**

```
🍕 Deine Franchise-Anfrage bei MOTO PIZZA
```

**Inhalt**

```
Hallo {Name},

vielen Dank für dein Interesse an einer Partnerschaft mit MOTO PIZZA.

Wir haben deine Franchise-Anfrage erhalten und werden deine Angaben prüfen.

Wenn dein Standort und deine Vorstellungen grundsätzlich zu unserem Konzept
passen, melden wir uns persönlich bei dir, um die nächsten Schritte zu
besprechen.

Viele Grüße

Dein MOTO PIZZA Team
```

Das Formular erfasst nur „Vor- und Nachname" in einem Feld. Soll die Anrede nur
den Vornamen enthalten, braucht es in Airtable eine Formelspalte, z. B.
`LEFT({Name}, FIND(" ", {Name} & " ") - 1)`, und im Text dann diese Spalte.

## 6. Dateiupload

Maximal **4 MB**, erlaubt sind PDF, DOC, DOCX, JPG, JPEG, PNG. Anhänge gehen an
`content.airtable.com` (nicht `api.airtable.com` — dort 404), identisch zum
Mitarbeiter-System.
