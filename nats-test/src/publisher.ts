import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

// stan is just client
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const data = {
    id: "123",
    title: "fight",
    price: 20,
  };

  const publisher = new TicketCreatedPublisher(stan);

  await publisher.publish(data);
  console.log("publish siccess");
});
