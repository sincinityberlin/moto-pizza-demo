/* ==========================================================================
   MOTO PIZZA — Menu data
   Edit this file to change pizzas, prices or descriptions.
   Each item: id (matches an image in assets/images/pizza-*.jpg), name,
   tag (short vibe word / category), short (one-line teaser for the pizza
   selector), desc (ingredients), badge (optional).

   Pizza prices are NOT on the items — every pizza is offered in both styles
   below at the same two prices, so the price belongs to the style, not to
   the pizza. See MOTO_PIZZA_STYLES. Snacks and drinks keep their own price.

   ALLERGEN LABELLING — read before editing `allergens`
   ---------------------------------------------------
   Source of truth for the ten pizzas is the printed MOTO PIZZA menu, which
   sets the codes as a superscript after each pizza name (e.g. BEEF LOVER
   V,Y,R,T,M). Those were transcribed verbatim, letters into `allergens` and
   digits into `additives`, in the printed order. Nothing here is inferred
   from a product name, a photo, or "what a dish like this usually contains".

   allergens:        letter codes, see the legend on allergene.html.
   allergensPending: false once the codes come from a real declaration — the
                     ten pizzas are all false because the printed menu is that
                     declaration. Still true for every item the printed menu
                     does not label, so the card shows a "noch zu bestätigen"
                     note and a blank line can never be read as "contains no
                     allergens".
   additives:        additive numbers (2 conserved / 3 antioxidant /
                     5 blackened), also straight off the printed menu.

   Still open, because the printed menu carries no codes for them: the drinks
   page lists Sanpellegrino, Red Bull and Pellegrino with no allergen or
   additive marks at all, and the Misu tiramisus replaced the printed menu's
   desserts (Cheesecake / Lavacake), so nothing on paper covers them. Their
   codes need the manufacturer's own declaration.

   One caveat worth knowing: the printed menu defines R as "Krebs- ODER
   Weichtiere" — one code for both groups. allergene.html splits them into
   R (crustaceans) and E (molluscs) per the 14-group EU scheme, so the R on
   Beef Lover is as precise as the printed source allows.
   ========================================================================== */

/* ==========================================================================
   PIZZA STYLES — single source of truth for the price boxes
   Every one of the ten pizzas is available in both styles, so the price sits
   here and not on the individual pizza. Each carousel shows the entry that
   matches it (data-style in index.html); edit a price or a line in this list
   and the boxes follow, with no change in js/main.js or css/style.css.

   Each style is sold in two forms — a whole pizza and a single slice — and
   `forms` lists them in the order they appear. A form carries its label, the
   line underneath, its price, and `variant`: the picture set the carousel
   shows while this form is chosen ("whole" or "slice"). Picking a form only
   swaps pictures and price — it is not an order or a basket.

   The slice costs 5,90 in both styles, but each form carries its own price
   so one can change without touching the other.
   ========================================================================== */
const MOTO_PIZZA_STYLES = [
  {
    id: "detroit",
    name: "Detroit Style",
    forms: [
      { variant: "whole", label: "Ganze Pizza", note: "Detroit Style · 25 × 25 cm", price: "18,90" },
      { variant: "slice", label: "Stückpizza", note: "Detroit Style · 1 Stück", price: "5,90" },
    ],
  },
  {
    id: "newyork",
    name: "New York Style",
    forms: [
      { variant: "whole", label: "Ganze Pizza", note: "New York Style · rund · 45 cm", price: "22,00" },
      { variant: "slice", label: "Stückpizza", note: "New York Style · 1 Stück", price: "5,90" },
    ],
  },
];

const MOTO_MENU = [
  {
    id: "moto",
    maxPick: true, // flagged as Max' Pick — shown by the selector panel
    name: "MOTO",
    tag: "Der Klassiker",
    short: "Der Detroit-Klassiker: würzige Peperoni-Salami trifft auf Champignons, Oliven und Paprika.",
    desc: "Peperoni-Salami, Champignons, Zwiebeln, grüne Paprika, Oliven, Parmesan & Tomatensoße",
    badge: "Signature",
    allergens: ["V", "Y"],
    allergensPending: false,
    additives: ["2", "3", "5"],
  },
  {
    id: "pepperoniking",
    name: "Pepperoni King",
    tag: "Für Salami-Fans",
    short: "Für alle, die es deftig mögen: extra viel Pepperoni-Salami auf MOTO-Käse.",
    desc: "Extra viel Pepperoni-Salami, Parmesan & Tomatensauce",
    allergens: ["V", "Y"],
    allergensPending: false,
    additives: ["2", "3"],
  },
  {
    id: "beeflover",
    // single source of truth for the current top seller: this flag drives
    // both the "Top Seller" label and where Max' Pick jumps to. Move it to
    // another pizza and both follow — nothing else needs changing.
    topSeller: true,
    name: "Beef Lover",
    tag: "Herzhaft & scharf",
    short: "Rind, Kimchi und Knoblauchsauce – herzhaft, scharf und mit koreanischem Twist.",
    desc: "Beef, Zwiebeln, Knoblauchsauce, eingelegter Kohl, Kimchi, schwarzer Sesam & Rohrzuckeressig",
    badge: "Bestseller",
    allergens: ["V", "Y", "R", "T", "M"],
    allergensPending: false,
    additives: [],
  },
  {
    id: "honeyinferno",
    name: "Honey Inferno",
    tag: "Süß trifft scharf",
    short: "Scharfe Salami und Kabanossi, gekrönt von einem Schuss scharfem Honig.",
    desc: "Pepperoni-Salami, Kabanossi, Parmesan & Tomatensauce, getoppt mit scharfem Honig",
    allergens: ["V", "Y", "S", "U"],
    allergensPending: false,
    additives: ["2", "5"],
  },
  {
    id: "bighog",
    name: "Big Hog",
    tag: "BBQ Deluxe",
    short: "Speck, Kabanossi und eine BBQ-Sauce mit Calamansi-Limette – deftig und rauchig.",
    desc: "Speckwürfel, Kabanossi, Zwiebeln, Parmesan, Calamansi-Limetten-Sauce & BIG HOG BBQ-Sauce",
    allergens: ["V", "Y", "S", "U"],
    allergensPending: false,
    additives: ["2", "3"],
  },
  {
    id: "lemonshrimp",
    name: "Lemon Shrimp",
    tag: "Vom Meer",
    short: "Scharfe Garnelen, Chiliöl und cremige Sauce Hollandaise – MOTO vom Meer.",
    desc: "Scharfe Garnelen, Parmesan, Schnittlauch, Calamansi-Limetten-Sauce, Chiliöl & Sauce Hollandaise",
    allergens: ["V", "Y", "P", "S", "X"],
    allergensPending: false,
    additives: [],
  },
  {
    id: "cremedepoulet",
    name: "Crème de Poulet",
    tag: "Cremig & mild",
    short: "Zartes Hähnchen, Crème fraîche und ein Hauch Sriracha – mild und cremig.",
    desc: "Crème fraîche, Hähnchenbruststreifen, Frühlingszwiebeln & Sriracha-Sauce",
    allergens: ["V", "Y", "S"],
    allergensPending: false,
    additives: [],
  },
  {
    id: "root",
    name: "Root",
    tag: "Für Pilzfans",
    short: "Waldig & erdig: eine Oyster-Pilzmischung auf cremiger Ricotta-Sauce.",
    desc: "Oyster-Pilzmischung, Ricotta-Sauce & Parmesan",
    allergens: ["V", "Y"],
    allergensPending: false,
    additives: [],
  },
  {
    id: "plant",
    name: "Plant",
    tag: "Vegetarisch",
    short: "Rucola, eingelegter Kohl und Knoblauchsauce – frisch, vegetarisch, würzig.",
    desc: "Rucola, eingelegter Kohl, Parmesan, Knoblauchsauce, Tomatensauce, Meersalz & schwarzer Sesam",
    badge: "Veggie",
    allergens: ["V", "Y", "M"],
    allergensPending: false,
    additives: [],
  },
  {
    id: "frico",
    name: "Frico",
    tag: "Simply cheesy",
    short: "Puristisch und ehrlich: nur MOTO-Käsemischung, Parmesan und Tomatensauce.",
    desc: "MOTO-Käsemischung, Parmesan & Tomatensauce",
    allergens: ["V", "Y"],
    allergensPending: false,
    additives: [],
  },
];

/* ==========================================================================
   MOTO MENÜS — die acht Kombi-Menüs
   Eigene Liste, bewusst getrennt von MOTO_MENU: ein Menü ist eine
   Kombination zu eigenem Preis, keine Pizza — die zehn Pizzen bleiben davon
   unberührt.

   Zu jedem Menü gehört ein fertig gestaltetes Aktionsmotiv unter `bild`.
   `bw`/`bh` sind dessen echte Pixelmasse — sie stehen als width/height im
   Markup, damit der Browser den Platz vor dem Laden kennt und nichts
   springt. Menü 7 ist als einziges nicht quadratisch, deshalb je Motiv.
   Dieses Motiv trägt Menünummer, Namen, Inhalt und Preis bereits selbst;
   die Felder hier sind die Textfassung davon — für den Bildtext, die
   Vorlesbarkeit und die schmale Bildunterschrift. Sie dürfen deshalb nie
   vom Motiv abweichen.

   `stil` unterscheidet Detroit (Menü 1–6) von New York (Menü 7–8) und wird
   als kleiner Chip ausgegeben, ohne die Sektion zu teilen.

   Reihenfolge = Anzeigereihenfolge. Leert man die Liste, rendert die Sektion
   nichts und blendet sich aus, ohne Änderung in index.html oder js/main.js.
   ========================================================================== */
const MOTO_MENUES = [
  {
    nr: 1,
    name: "MOTO Solo",
    stil: "Detroit Style · 25 × 25 cm",
    bild: "menue-1-moto-solo",
    bw: 1254, bh: 1254,
    items: ["1× Detroit Pizza 25 × 25 cm", "1× Getränk 0,33 l"],
    price: "16,90",
  },
  {
    nr: 2,
    name: "MOTO Full Tank",
    stil: "Detroit Style · 25 × 25 cm",
    bild: "menue-2-moto-full-tank",
    bw: 1254, bh: 1254,
    items: ["1× Detroit Pizza 25 × 25 cm", "1× Getränk 0,33 l", "1× MO MISU"],
    price: "20,90",
  },
  {
    nr: 3,
    name: "MOTO Double",
    stil: "Detroit Style · 25 × 25 cm",
    bild: "menue-3-moto-double",
    bw: 1254, bh: 1254,
    items: ["2× Detroit Pizza 25 × 25 cm", "2× Getränke 0,33 l"],
    price: "31,90",
  },
  {
    nr: 4,
    name: "MOTO Date Night",
    stil: "Detroit Style · 25 × 25 cm",
    bild: "menue-4-moto-date-night",
    bw: 1254, bh: 1254,
    items: ["2× Detroit Pizza 25 × 25 cm", "2× Getränke 0,33 l", "1× MO MISU"],
    price: "35,90",
  },
  {
    nr: 5,
    name: "MOTO Crew",
    stil: "Detroit Style · 25 × 25 cm",
    bild: "menue-5-moto-crew",
    bw: 1254, bh: 1254,
    items: ["3× Detroit Pizza 25 × 25 cm", "3× Getränke 0,33 l", "2× MO MISU"],
    price: "49,90",
  },
  {
    nr: 6,
    name: "MOTO Family",
    stil: "Detroit Style · 25 × 25 cm",
    bild: "menue-6-moto-family",
    bw: 1254, bh: 1254,
    items: ["4× Detroit Pizza 25 × 25 cm", "4× Getränke 0,33 l", "2× MO MISU"],
    price: "64,90",
  },
  {
    nr: 7,
    name: "NY Solo",
    stil: "New York Style · 45 cm",
    bild: "menue-7-ny-solo",
    bw: 1370, bh: 1148,
    items: ["1× New York Style Pizza 45 cm", "1× Getränk 0,33 l"],
    price: "19,90",
  },
  {
    nr: 8,
    name: "NY Full Tank",
    stil: "New York Style · 45 cm",
    bild: "menue-8-ny-full-tank",
    bw: 1254, bh: 1254,
    items: ["1× New York Style Pizza 45 cm", "2× Getränke 0,33 l", "1× MO MISU"],
    price: "24,90",
  },
];
/* id matches assets/images/snack-<id>.png. price: "" renders the
   "Preis folgt" placeholder in renderProductGrid (js/main.js) instead of
   inventing a number — swap in the real price string (e.g. "4,50") once
   Misu has one. */
const MOTO_SNACKS = [
  {
    id: "misu-lotus",
    name: "Misu",
    tag: "Lotus Tiramisu",
    desc: "Cremiges Tiramisu mit knusprigen Lotus-Keksen und Karamell.",
    price: "5,90",
    allergens: [],
    allergensPending: true,
    additives: [],
  },
  {
    id: "misu-oreo",
    name: "Misu",
    tag: "Oreo Tiramisu",
    desc: "Cremiges Tiramisu mit reichlich Oreo-Keksstückchen.",
    price: "5,90",
    allergens: [],
    allergensPending: true,
    additives: [],
  },
  {
    id: "misu-pistazie",
    name: "Misu",
    tag: "Pistazien Tiramisu",
    desc: "Cremiges Tiramisu mit gerösteten Pistazien.",
    price: "5,90",
    allergens: ["B"],
    allergensPending: true,
    additives: [],
  },
  {
    id: "misu-classic",
    name: "Misu",
    tag: "Classic Tiramisu",
    desc: "Das klassische Tiramisu — cremig und mit Kakao bestäubt.",
    price: "5,90",
    allergens: [],
    allergensPending: true,
    additives: [],
  },
  {
    id: "misu-saltedcaramel",
    name: "Misu",
    tag: "Salted Caramel & Schokolade",
    desc: "Cremiges Tiramisu mit gesalzenem Karamell und Schokolade.",
    price: "5,90",
    allergens: [],
    allergensPending: true,
    additives: [],
  },
  {
    id: "misu-dubai",
    name: "Misu",
    tag: "Dubai Schokolade",
    desc: "Cremiges Tiramisu mit Pistazie und knuspriger Kadayif-Schokolade.",
    price: "5,90",
    allergens: ["B"],
    allergensPending: true,
    additives: [],
  },
];

/* id matches assets/images/drink-<id>.png. Reihenfolge folgt der Speisekarte:
   Red Bull (3 Sorten) → San Pellegrino Aromen (4) → S.Pellegrino Sprudel. */
const MOTO_DRINKS = [
  {
    id: "redbull-classic",
    name: "Red Bull",
    tag: "Classic / Original",
    desc: "Der Original Energy Drink.",
    price: "3,90",
    deposit: "0,25",
    allergens: [],
    allergensPending: true,
    additives: [],
  },
  {
    id: "redbull-juneberry",
    name: "Red Bull",
    tag: "Juneberry",
    desc: "Erfrischender Energy Drink mit fruchtigem Juneberry-Geschmack.",
    price: "3,90",
    deposit: "0,25",
    allergens: [],
    allergensPending: true,
    additives: [],
  },
  {
    id: "redbull-whitepeach",
    name: "Red Bull",
    tag: "White Peach",
    desc: "Energy Drink mit sommerlichem Geschmack von weißem Pfirsich.",
    price: "3,90",
    deposit: "0,25",
    allergens: [],
    allergensPending: true,
    additives: [],
  },
  {
    id: "limonata",
    name: "San Pellegrino",
    tag: "Limonata",
    desc: "Italienische Sparkling-Limonade mit echtem Zitronensaft.",
    price: "3,90",
    deposit: "0,25",
    allergens: [],
    allergensPending: true,
    additives: [],
  },
  {
    id: "pompelmo",
    name: "San Pellegrino",
    tag: "Pompelmo",
    desc: "Italienische Sparkling-Limonade mit Grapefruit.",
    price: "3,90",
    deposit: "0,25",
    allergens: [],
    allergensPending: true,
    additives: [],
  },
  {
    id: "limone-menta",
    name: "San Pellegrino",
    tag: "Limone & Menta",
    desc: "Italienische Sparkling-Limonade mit Zitrone und Minze.",
    price: "3,90",
    deposit: "0,25",
    allergens: [],
    allergensPending: true,
    additives: [],
  },
  {
    id: "limonata-lila",
    name: "San Pellegrino",
    tag: "Melograno & Arancia",
    desc: "Spritzige italienische Limonade mit Granatapfel und Orange.",
    price: "3,90",
    deposit: "0,25",
    allergens: [],
    allergensPending: true,
    additives: [],
  },
  {
    id: "sprudel",
    name: "S.Pellegrino",
    tag: "Sprudel",
    desc: "Italienisches Sparkling-Mineralwasser.",
    price: "5,00",
    allergens: [],
    allergensPending: true,
    additives: [],
  },
];

const MOTO_INFO = {
  address: "Cuvrystraße 49, 10997 Berlin",
  phone: "030 000 000 00",
  site: "www.motopizza.de",
  hoursLine1: "Mo. – Do. durchgehend geöffnet",
  hoursLine2: "Fr. – So. durchgehend geöffnet",
  deliveryZip: "10101",
};
