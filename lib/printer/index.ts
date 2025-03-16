import escpos from "escpos";
import escposNetwork from "escpos-network";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
}

// Configure network device with printer's IP and port
const device = new escposNetwork("192.168.1.100", 9100);
const printer = new escpos.Printer(device);

/**
 * Imprime le résumé d'une commande.
 * @param {Object} order - La commande à imprimer.
 * @param {string} order.id - L'identifiant de la commande.
 * @param {string} order.date - La date de la commande.
 * @param {Array} order.items - Liste des articles (chaque article doit contenir name, quantity et price).
 * @param {number} order.total - Le total de la commande.
 */
export function printOrderSummary(order: Order) {
  device.open((error: string) => {
    if (error) {
      console.error(
        "Erreur lors de l'ouverture de la connexion réseau à l'imprimante :",
        error
      );
      return;
    }

    printer
      .align("CT")
      .style("B")
      .text("RÉSUMÉ DE LA COMMANDE")
      .text("------------------------------")
      .align("LT")
      .text(`ID Commande : ${order.id}`)
      .text(`Date : ${order.date}`)
      .text("------------------------------");

    // Parcours et impression de chaque article
    order.items.forEach((item) => {
      printer.text(`${item.name} x${item.quantity} - ${item.price}HTG`);
    });

    printer
      .text("------------------------------")
      .align("RT")
      .style("B")
      .text(`Total : ${order.total}€`)
      .feed(4)
      .cut()
      .close();
  });
}
