import { model, Schema } from "mongoose";

const productSchema = new Schema(
  {
    image: String,
    pack: Number,
    price: Number,
    wcCode: String,
    pltCode: String,
    boxCode: String,
    ti: Number,
    hi: Number,
    upc: String,
    tag1: String,
    tag2: String,
    description: String,
    uom: String,
    availableInventory: String,
  },
  {
    timestamps: true,
  }
);

const Product = model("product", productSchema);

export default Product;
