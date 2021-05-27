import nats from "node-nats-streaming";

console.clear();

// stan is just client
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    id: "123",
    title: "fight",
    price: 20,
  });

  stan.publish("ticket:create", data, (err, guid) => {
    if (err) {
      console.log("\n\n>>>>>>>>>>>>>>>>>>>>>>>> err <<<<<<<<<<<<<<<<<<<<<\n\n");
      console.log(err);
      console.log("\n\n>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<\n\n");
    } else {
      console.log(
        "\n\n>>>>>>>>>>>>>>>>>>>>>>>> guid <<<<<<<<<<<<<<<<<<<<<\n\n"
      );
      console.log(guid);
      console.log("\n\n>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<\n\n");
    }
  });
});
