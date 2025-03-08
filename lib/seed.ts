import { prisma } from "./prisma";

// prisma/seed.ts
const exchangeRate = 138; // 1 USD = 138 HTG

const convertPrice = (usdPrice: number) =>
  parseFloat((usdPrice * exchangeRate).toFixed(2));

const menuItemsByCategory = {
  breakfast: [
    {
      name: "Pànkèt Ansyen",
      description: "Pànkèt tradisyonèl ayisyen ak siwo ak zaboka",
      price: convertPrice(3.99),
      category: "breakfast",
      available : true
    },
    {
      name: "Diri ak Pwa",
      description: "Diri kole ak pwa nwa, ak legim fre",
      price: convertPrice(2.5),
      category: "breakfast",
      available : true
    },
    {
      name: "Omelet Legim",
      description: "Omelet ak piman, zonyon, ak tomat fre",
      price: convertPrice(4.75),
      category: "breakfast",
      available : true
    },
    {
      name: "Pen Patat",
      description: "Pen patat dou ak be ak siwo kokoye",
      price: convertPrice(2.25),
      category: "breakfast",
      available : true
    },
  ],
  soups: [
    {
      name: "Soup Joumou",
      description: "Soup tradisyonèl pou jou endepandans",
      price: convertPrice(5.99),
      category: "soups",
      available : true
    },
    {
      name: "Bouyon Bef",
      description: "Bouyon vyann bef ak legim fre",
      price: convertPrice(6.5),
      category: "soups",
      available : true
    },
    {
      name: "Soup Pwa Kongo",
      description: "Soup pwa kongo ak pikliz",
      price: convertPrice(4.99),
      category: "soups",
      available : true
    },
    {
      name: "Soup Lambi",
      description: "Soup lambi ak legim wouj",
      price: convertPrice(8.75),
      category: "soups",
      available : true
    },
  ],
  pasta: [
    {
      name: "Spaghetti Kreyòl",
      description: "Spaghetti ak sos vyann ak legim",
      price: convertPrice(7.99),
      category: "pasta",
      available : true
    },
    {
      name: "Lasagna Ayisyen",
      description: "Lasagna ak vyann bef ak fromaj",
      price: convertPrice(9.5),
      category: "pasta",
      available : true
    },
    {
      name: "Macaroni Graten",
      description: "Macaroni ak sos bèchamèl ak fromaj",
      price: convertPrice(8.75),
      category: "pasta",
      available : true
    },
    {
      name: "Penne Pesto",
      description: "Penne ak sos pesto ak pistach",
      price: convertPrice(10.99),
      category: "pasta",
      available : true
    },
  ],
  sushi: [
    {
      name: "Sushi Pwason Fre",
      description: "Sushi ak pwason fre ak diri Japonè",
      price: convertPrice(15.99),
      category: "sushi",
      available : true
    },
    {
      name: "Maki Avoka",
      description: "Maki avoka ak konkonm",
      price: convertPrice(12.5),
      category: "sushi",
      available : true
    },
    {
      name: "Sashimi Tuna",
      description: "Tuna fre koupe fèy",
      price: convertPrice(20.75),
      category: "sushi",
      available : true
    },
    {
      name: "California Roll",
      description: "Krab imitasyon, avoka, ak konkonm",
      price: convertPrice(14.99),
      category: "sushi",
      available : true
    },
  ],
  main: [
    {
      name: "Griyo ak Bannann",
      description: "Vyann kochon fri ak bannann peze",
      price: convertPrice(12.99),
      category: "main",
      available : true
    },
    {
      name: "Poule en Sauce",
      description: "Poule ak sos zwazo ak champignon",
      price: convertPrice(11.5),
      category: "main",
      available : true
    },
    {
      name: "Poisson Gros Sel",
      description: "Pwason fri ak bannann ak pikliz",
      price: convertPrice(14.75),
      category: "main",
      available : true
    },
    {
      name: "Tasso Kabrit",
      description: "Kabrit griye ak diri djon djon",
      price: convertPrice(16.99),
      category: "main",
      available : true
    },
  ],
  desserts: [
    {
      name: "Dous Makòs",
      description: "Dous tradisyonèl kokoye ak nwa",
      price: convertPrice(3.99),
      category: "desserts",
      available : true
    },
    {
      name: "Pen Patat ak Lèt",
      description: "Pen patat serve ak lèt kokoye",
      price: convertPrice(4.5),
      category: "desserts",
      available : true
    },
    {
      name: "Kremas Glase",
      description: "Glace fèt ak kremas tradisyonèl",
      price: convertPrice(5.25),
      category: "desserts",
      available : true
    },
    {
      name: "Tablet Pistach",
      description: "Tablet pistach ak chokola",
      price: convertPrice(4.75),
      category: "desserts",
      available: false,
    },
  ],
  drinks: [
    {
      name: "Kremas",
      description: "Liqueur tradisyonèl ayisyen",
      price: convertPrice(6.5),
      category: "drinks",
      available : true
    },
    {
      name: "Jus Fwi Fres",
      description: "Jus fwi fre chwa jounen an",
      price: convertPrice(4.0),
      category: "drinks",
      available : true
    },
    {
      name: "Kafe Nwa",
      description: "Kafe ayisyen piman bouyi",
      price: convertPrice(2.5),
      category: "drinks",
      available : true
    },
    {
      name: "Dite Citronn",
      description: "Dite cho ak siwo citronn",
      price: convertPrice(3.0),
      category: "drinks",
      available : true
    },
  ],
  alcohol: [
    {
      name: "Rhum Barbancourt",
      description: "Rhum 5-star 8-year-old",
      price: convertPrice(15.99),
      category: "alcohol",
      available : true
    },
    {
      name: "Prestige",
      description: "Byer nasyonal Ayiti",
      price: convertPrice(5.5),
      category: "alcohol",
      available : true
    },
    {
      name: "Vin Rouge",
      description: "Vin wouj fransè",
      price: convertPrice(12.99),
      category: "alcohol",
      available : true
    },
    {
      name: "Clairin",
      description: "Tafya tradisyonèl",
      price: convertPrice(4.75),
      category: "alcohol",
      available : true
    },
  ],
};

async function main() {
  console.log("Kòmanse ensemen...");

  for (const [category, items] of Object.entries(menuItemsByCategory)) {
    console.log(`Ap ensemen ${items.length} atik ${category}...`);
    await prisma.menuItem.createMany({
      data: items.map((item) => ({
        ...item,
        available: item.available !== undefined ? item.available : true,
        createdAt: new Date(),
      })),
    });
  }

  console.log("Ensemans fini avèk siksè!");
}

main()
  .catch((e) => {
    console.error("Erè pandan ensemans:", e);
    process.exit(1);
  })
  .finally(async () => {
    // await prisma.$disconnect();
  });
