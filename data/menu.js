/* ==========================================================================
   MOTO PIZZA — Menu data
   Edit this file to change pizzas, prices or descriptions.
   Each item: id (matches an image in assets/images/pizza-*.jpg), name,
   tag (short vibe word / category), short (one-line teaser for the pizza
   selector), desc (ingredients), price, badge (optional).
   ========================================================================== */

const MOTO_MENU = [
  {
    id: "moto",
    name: "MOTO",
    tag: "Der Klassiker",
    short: "Der Detroit-Klassiker: würzige Peperoni-Salami trifft auf Champignons, Oliven und Paprika.",
    desc: "Peperoni-Salami, Champignons, Zwiebeln, grüne Paprika, Oliven, Parmesan & Tomatensoße",
    price: "22,00",
    badge: "Signature",
  },
  {
    id: "pepperoniking",
    name: "Pepperoni King",
    tag: "Für Salami-Fans",
    short: "Für alle, die es deftig mögen: extra viel Pepperoni-Salami auf MOTO-Käse.",
    desc: "Extra viel Pepperoni-Salami, Parmesan & Tomatensauce",
    price: "22,00",
  },
  {
    id: "beeflover",
    name: "Beef Lover",
    tag: "Herzhaft & scharf",
    short: "Rind, Kimchi und Knoblauchsauce – herzhaft, scharf und mit koreanischem Twist.",
    desc: "Beef, Zwiebeln, Knoblauchsauce, eingelegter Kohl, Kimchi, schwarzer Sesam & Rohrzuckeressig",
    price: "22,00",
    badge: "Bestseller",
  },
  {
    id: "honeyinferno",
    name: "Honey Inferno",
    tag: "Süß trifft scharf",
    short: "Scharfe Salami und Kabanossi, gekrönt von einem Schuss scharfem Honig.",
    desc: "Pepperoni-Salami, Kabanossi, Parmesan & Tomatensauce, getoppt mit scharfem Honig",
    price: "22,00",
  },
  {
    id: "bighog",
    name: "Big Hog",
    tag: "BBQ Deluxe",
    short: "Speck, Kabanossi und eine BBQ-Sauce mit Calamansi-Limette – deftig und rauchig.",
    desc: "Speckwürfel, Kabanossi, Zwiebeln, Parmesan, Calamansi-Limetten-Sauce & BIG HOG BBQ-Sauce",
    price: "22,00",
  },
  {
    id: "lemonshrimp",
    name: "Lemon Shrimp",
    tag: "Vom Meer",
    short: "Scharfe Garnelen, Chiliöl und cremige Sauce Hollandaise – MOTO vom Meer.",
    desc: "Scharfe Garnelen, Parmesan, Schnittlauch, Calamansi-Limetten-Sauce, Chiliöl & Sauce Hollandaise",
    price: "22,00",
  },
  {
    id: "cremedepoulet",
    name: "Crème de Poulet",
    tag: "Cremig & mild",
    short: "Zartes Hähnchen, Crème fraîche und ein Hauch Sriracha – mild und cremig.",
    desc: "Crème fraîche, Hähnchenbruststreifen, Frühlingszwiebeln & Sriracha-Sauce",
    price: "22,00",
  },
  {
    id: "root",
    name: "Root",
    tag: "Für Pilzfans",
    short: "Waldig & erdig: eine Oyster-Pilzmischung auf cremiger Ricotta-Sauce.",
    desc: "Oyster-Pilzmischung, Ricotta-Sauce & Parmesan",
    price: "22,00",
  },
  {
    id: "plant",
    name: "Plant",
    tag: "Vegetarisch",
    short: "Rucola, eingelegter Kohl und Knoblauchsauce – frisch, vegetarisch, würzig.",
    desc: "Rucola, eingelegter Kohl, Parmesan, Knoblauchsauce, Tomatensauce, Meersalz & schwarzer Sesam",
    price: "22,00",
    badge: "Veggie",
  },
  {
    id: "frico",
    name: "Frico",
    tag: "Simply cheesy",
    short: "Puristisch und ehrlich: nur MOTO-Käsemischung, Parmesan und Tomatensauce.",
    desc: "MOTO-Käsemischung, Parmesan & Tomatensauce",
    price: "22,00",
  },
];

const MOTO_SNACKS = [
  {
    id: "lavacake",
    name: "Chocolate Lavacake",
    tag: "Mit flüssigem Kern",
    desc: "Mit flüssigem Kern und echter belgischer Schokolade.",
    price: "2,99",
  },
  {
    id: "cheesecake",
    name: "New York Cheesecake",
    tag: "Klassisch",
    desc: "Rundes Törtchen aus Frischkäsecreme auf zerkrümeltem Kuchenboden.",
    price: "2,99",
  },
];

/* id matches assets/images/drink-<id>.png. Reihenfolge folgt der Speisekarte:
   Red Bull (3 Sorten) → San Pellegrino Aromen (7) → San Pellegrino Sprudel/Still. */
const MOTO_DRINKS = [
  {
    id: "redbull-classic",
    name: "Red Bull",
    tag: "Classic / Original",
    desc: "Der Original Energy Drink.",
    price: "5,00",
  },
  {
    id: "redbull-juneberry",
    name: "Red Bull",
    tag: "Juneberry",
    desc: "Erfrischender Energy Drink mit fruchtigem Juneberry-Geschmack.",
    price: "5,00",
  },
  {
    id: "redbull-whitepeach",
    name: "Red Bull",
    tag: "White Peach",
    desc: "Energy Drink mit sommerlichem Geschmack von weißem Pfirsich.",
    price: "5,00",
  },
  {
    id: "aranciata",
    name: "San Pellegrino",
    tag: "Aranciata",
    desc: "Italienische Sparkling-Limonade mit echter Orange.",
    price: "5,00",
  },
  {
    id: "limonata",
    name: "San Pellegrino",
    tag: "Limonata",
    desc: "Italienische Sparkling-Limonade mit echtem Zitronensaft.",
    price: "5,00",
  },
  {
    id: "aranciata-rossa",
    name: "San Pellegrino",
    tag: "Aranciata Rossa",
    desc: "Italienische Sparkling-Limonade mit Blutorange.",
    price: "5,00",
  },
  {
    id: "pompelmo",
    name: "San Pellegrino",
    tag: "Pompelmo",
    desc: "Italienische Sparkling-Limonade mit Grapefruit.",
    price: "5,00",
  },
  {
    id: "limone-menta",
    name: "San Pellegrino",
    tag: "Limone & Menta",
    desc: "Italienische Sparkling-Limonade mit Zitrone und Minze.",
    price: "5,00",
  },
  {
    id: "limonata-lila",
    name: "San Pellegrino",
    tag: "Melograno & Arancia",
    desc: "Spritzige italienische Limonade mit Granatapfel und Orange.",
    price: "5,00",
  },
  {
    id: "ciliegia-limone",
    name: "San Pellegrino",
    tag: "Ciliegia & Limone",
    desc: "Italienische Sparkling-Limonade mit Kirsche und Zitrone.",
    price: "5,00",
  },
  {
    id: "sprudel",
    name: "S.Pellegrino",
    tag: "Sprudel",
    desc: "Italienisches Sparkling-Mineralwasser.",
    price: "5,00",
  },
  {
    id: "still",
    name: "Acqua Panna",
    tag: "Still",
    desc: "Stilles Mineralwasser aus der Toskana.",
    price: "5,00",
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
