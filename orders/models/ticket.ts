import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

// An interface that describes properties required
// to create a new ticket
interface TicketAttrs {
  title: string;
  price: number;
}

// An interface that describes properties
// that a ticket Document has
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

// An interface that describes the properties
// that a Ticket Model has

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
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
        delete ret.__v;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
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
