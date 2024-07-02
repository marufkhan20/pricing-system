import { model, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    name: String,
    orderFileName: String,
    path: String,
    createdDate: Date,
    products: [],
    freightRate: Number,
    commission1: Number,
    commission2: Number,
    markUp: Number,
  },
  {
    timestamps: true,
  }
);

const Order = model("order", orderSchema);

export default Order;
