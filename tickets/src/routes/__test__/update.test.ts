import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { baseRoute } from "../new";
import { natsWrapper } from "../../nats-wrapper";

const title = "asadad";
const price = 10.0;
const id = new mongoose.Types.ObjectId().toHexString();
it("returns 404 if the provided id does not exist", async () => {
  await request(app)
    .put(`${baseRoute}/${id}`)
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(404);
});
it("returns a 401 if the user is not allowed", async () => {
  const response = await request(app)
    .post(baseRoute)
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    });

  await request(app)
    .put(`${baseRoute}/${response.body.id}`)
    .send({
      title,
      price,
    })
    .expect(401);
});
it("returns a 401 is the user does not own the ticket", async () => {
  const response = await request(app)
    .post(baseRoute)
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    });

  await request(app)
    .put(`${baseRoute}/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(401);
});
it("returns 422 for invalid title or price", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(baseRoute)
    .set("Cookie", cookie)
    .send({
      title,
      price,
    });

  await request(app)
    .put(`${baseRoute}/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price,
    })
    .expect(422);

  await request(app)
    .put(`${baseRoute}/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title,
      price: -10,
    })
    .expect(422);
});
it("updates when provided valid inputs", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(baseRoute)
    .set("Cookie", cookie)
    .send({
      title,
      price,
    });

  await request(app)
    .put(`${baseRoute}/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price,
    })
    .expect(200);

  const ticketResponse = await request(app).get(
    `${baseRoute}/${response.body.id}`
  );

  expect(ticketResponse.body.title).toEqual("new title");
});

it("publishes an event", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(baseRoute)
    .set("Cookie", cookie)
    .send({
      title,
      price,
    });

  await request(app)
    .put(`${baseRoute}/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
