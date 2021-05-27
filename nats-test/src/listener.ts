import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

// [ 'stanClient', 'msg', 'subscription' ]

stan.on("connect", () => {
  console.log("Listener connected to nats");

  stan.on("close", () => {
    console.log("NAT connection close");
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("sccounting-service");

  // Quegroup is used to identify similar instances of the listener
  // So that the instances don't all recieve the message
  // Only one replica recieves the event
  const subscription = stan.subscribe(
    "ticket:create",
    "listenerQueueGroup",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Recieved event #${msg.getSequence()} with data ${data}`);
    }

    msg.ack();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
