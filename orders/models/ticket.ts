import mongoose from "mongoose";

// An interface that describes properties required
// to create a new ticket
interface TicketAttrs {
  title: string;
  userId: string;
  price: number;
}

// An interface that describes properties
// that a ticket Document has
interface TicketDoc extends mongoose.Document {
  title: string;
  userId: string;
  price: number;
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
    userId: {
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

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };