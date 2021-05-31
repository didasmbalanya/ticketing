import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { baseRoute } from "../new";

it("returns a 404 if ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  request(app).get(`${baseRoute}/${id}`).expect(404);
});

it("returns ticket if found", async () => {
  // create ticket
  const title = "some title";
  const price = 10.0;

  const { body } = await request(app)
    .post(baseRoute)
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    });

  const ticketResponse = await request(app)
    .get(`${baseRoute}/${body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
it("", async () => {});
