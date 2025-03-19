// import escpos from "escpos";
// import USB from "escpos-usb";

// interface OrderItem {
//   name: string;
//   quantity: number;
//   price: number;
// }

// interface Order {
//   id: string;
//   date: string;
//   items: OrderItem[];
//   total: number;
// }

// // Configure USB device with vendor ID and product ID
// const device = new USB(0x0483, 0x5743);  // VID_0483, PID_5743 for ZJ-80
// const printer = new escpos.Printer(device);

// export function printOrderSummary(order: Order) {
//   device.open((error: string) => {
//     if (error) {
//       console.error(
//         "Erreur lors de l'ouverture de la connexion USB à l'imprimante :",
//         error
//       );
//       return;
//     }

//     printer
//       .align("CT")
//       .style("B")
//       .text("RÉSUMÉ DE LA COMMANDE")
//       .text("------------------------------")
//       .align("LT")
//       .text(`ID Commande : ${order.id}`)
//       .text(`Date : ${order.date}`)
//       .text("------------------------------");

//     order.items.forEach((item) => {
//       printer.text(`${item.name} x${item.quantity} - ${item.price}HTG`);
//     });

//     printer
//       .text("------------------------------")
//       .align("RT")
//       .style("B")
//       .text(`Total : ${order.total}€`)
//       .feed(4)
//       .cut()
//       .close();
//   });
// }