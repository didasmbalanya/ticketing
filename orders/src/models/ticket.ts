import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes properties required
// to create a new ticket
interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

// An interface that describes properties
// that a ticket Document has
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

// An interface that describes the properties
// that a Ticket Model has

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}): Promise<TicketDoc | null> => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ticketSchema.methods.isReserved = async function <TicketDoc>() {
  // Make sure ticket is not already reserved
  // Query to look at all orders. Find an with the ticketId above
  // and the order status is NOT cancelled.
  // if we find an order, means the ticket is resevened

  // this === ticket document
  const exisitingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.Awaiting, OrderStatus.Complete],
    },
  });

  return !!exisitingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
