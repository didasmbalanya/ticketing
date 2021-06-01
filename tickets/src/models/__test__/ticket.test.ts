import { Ticket } from "../ticket";

it.only("implements optimistic concurrency control", async (done) => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: "vrrrrr",
    price: 10,
    userId: "123",
  });

  // save ticket to the DB
  await ticket.save();

  // fetch ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make 2 separate changes to the tickets we fetch
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save first ticket and expect it to work well
  await firstInstance!.save();

  // save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (error) {
    return done();
  }

  throw new Error("Should not reach this point");
});
