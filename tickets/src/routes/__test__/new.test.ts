import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { baseRoute } from "../new";

it("has a route handler for /api/tickets for post requests", async () => {
  const response = await request(app).post(baseRoute).send({});

  expect(response.status).not.toEqual(404);
});
it("can only be accessed if the user is signed in", async () => {
  await request(app).post(baseRoute).send({}).expect(401);
});

it("returns a status other than 401 for a signed in user", async () => {
  const response = await request(app)
    .post(baseRoute)
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error when given an invalid title", async () => {
  await request(app)
    .post(baseRoute)
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(422);

  await request(app)
    .post(baseRoute)
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(422);
});

it("returns an error when given an invalid price", async () => {
  await request(app)
    .post(baseRoute)
    .set("Cookie", global.signin())
    .send({
      title: "adfasfsdfdsf",
      price: -10,
    })
    .expect(422);

  await request(app)
    .post(baseRoute)
    .set("Cookie", global.signin())
    .send({
      title: "asdadadasd",
    })
    .expect(422);
});

it("creates a ticket with invalid input", async () => {
  const title = "test title";
  const price = 10.0;
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const response = await request(app)
    .post(baseRoute)
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    });

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);

  expect(response.status).toEqual(201);

  expect(response.body.title).toEqual(title);
  expect(response.body.price).toEqual(price);
  expect(response.body.id).toBeDefined();
});
