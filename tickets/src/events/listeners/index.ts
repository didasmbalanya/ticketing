import { natsWrapper } from "../../nats-wrapper"
import { OrderCancelledListener } from "./order-cancelled-listener"


export const startEventListeners = () => {
  new OrderCancelledListener(natsWrapper.client).listen()
  new OrderCancelledListener(natsWrapper.client).listen()
}