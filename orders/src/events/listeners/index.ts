import { natsWrapper } from "../../nats-wrapper"
import { TicketCreatedListener } from "./ticket-created-listener"
import { TicketUpdatedListener } from "./ticket-updated-listener"

export const startEventListeners = () => {
  new TicketCreatedListener(natsWrapper.client).listen()
  new TicketUpdatedListener(natsWrapper.client).listen()
}