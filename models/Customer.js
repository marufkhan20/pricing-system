import { model, Schema } from "mongoose";

const customerSchema = new Schema(
  {
    name: String,
    freightRate: Number,
    markUp: Number,
    commission1: Number,
    commission2: Number,
    baseUnitModifier: String,
  },
  {
    timestamps: true,
  }
);

const Customer = model("customer", customerSchema);

export default Customer;
