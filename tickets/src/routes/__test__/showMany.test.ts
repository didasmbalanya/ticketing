import request from "supertest";
import { app } from "../../app";
import { baseRoute } from "../new";

const title = "some title";
const price = 10.0;

const createTicket = () => {
  return request(app).post(baseRoute).set("Cookie", global.signin()).send({
    title,
    price,
  });
};

it("can fetch a list of tickets ", async () => {
  // create ticket
  await Promise.all([createTicket(), createTicket(), createTicket()]);

  const { body } = await request(app).get(`${baseRoute}`).expect(200);
  expect(body.length).toEqual(3);
});
