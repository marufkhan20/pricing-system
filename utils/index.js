import csv from "csv-parser";
import fs from "fs";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";

export const readCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};

export const getProducts = async ({
  customer,
  freightRate,
  commission1,
  commission2,
  markUp,
}) => {
  const products = await Product.find();
  const selectedProducts = [];

  // get customer
  const customerData = await Customer.findById(customer);

  products?.forEach((product) => {
    const {
      _id,
      image,
      wcCode,
      pltCode,
      boxCode,
      price,
      ti,
      hi,
      description,
      upc,
      pack,
      tag1,
      tag2,
      uom,
      availableInventory,
    } = product || {};

    // calculate base unit price
    let baseUnitPrice = 0;
    let baseUnitModifier = customerData?.baseUnitModifier;

    if (baseUnitModifier && baseUnitModifier?.includes("-")) {
      baseUnitModifier = baseUnitModifier?.replace("-", "");

      baseUnitPrice = Number(price) - Number(baseUnitModifier);
    } else if (baseUnitModifier && baseUnitModifier?.includes("+")) {
      baseUnitModifier = baseUnitModifier?.replace("+", "");

      baseUnitPrice = Number(price) + Number(baseUnitModifier);
    } else {
      baseUnitPrice = Number(price);
    }

    const casesPerPallet = Number(ti) * Number(hi);

    // commission 1 per unit
    let commission1PerUnit =
      Number(baseUnitPrice) * (Number(commission1) / 100);

    commission1PerUnit = Math.ceil(commission1PerUnit * 100) / 100;

    // commission per case
    let commission1PerCase = commission1PerUnit * Number(pack);

    commission1PerCase = Math.ceil(commission1PerCase * 100) / 100;

    // commission 2 per unit
    let commission2PerUnit =
      Number(baseUnitPrice) * (Number(commission2) / 100);

    commission2PerUnit = Math.ceil(commission2PerUnit * 100) / 100;

    // commission 2 per case
    let commission2PerCase = commission2PerUnit * Number(pack);

    commission2PerCase = Math.ceil(commission2PerCase * 100) / 100;

    // const markUpUnit = Number(baseUnitPrice) * (Number(markUp) / 100);

    // freight per case
    let freightPerCase = Number(freightRate) / casesPerPallet;

    freightPerCase = Math.ceil(freightPerCase * 100) / 100;

    // freight per unit
    let freightPerUnit = Number(freightPerCase) / Number(pack);

    freightPerUnit = Math.ceil(freightPerUnit * 100) / 100;

    // mark up unit
    let markUpUnit =
      (Number(baseUnitPrice) +
        commission1PerUnit +
        commission2PerUnit +
        freightPerUnit) *
      (Number(markUp) / 100);

    markUpUnit = Math.ceil(markUpUnit * 100) / 100;

    // mark up case
    let markUpCase = markUpUnit * Number(pack);

    markUpCase = Math.ceil(markUpCase * 100) / 100;

    // unit
    let unit =
      commission1PerUnit +
      commission2PerUnit +
      freightPerUnit +
      markUpUnit +
      Number(baseUnitPrice);

    unit = Number((Math.ceil(unit * 20) / 20).toFixed(2));

    // ((2.00 * commission1) + (2.00 * commission2) + 2.00)) * markup
    const caseNo = unit * Number(pack);

    const productObj = {
      _id,
      tag1,
      tag2,
      image,
      pack,
      wcCode,
      pltCode,
      boxCode,
      ti,
      hi,
      description,
      unit: `$ ${unit?.toFixed(2)}`,
      case: `$ ${caseNo?.toFixed(2)}`,
      casesPerPallet,
      upc,
      freightPerUnit: `$ ${freightPerUnit?.toFixed(2)}`,
      freightPerCase: `$ ${freightPerCase?.toFixed(2)}`,
      commission1PerUnit: `$ ${commission1PerUnit?.toFixed(2)}`,
      commission1PerCase: `$ ${commission1PerCase?.toFixed(2)}`,
      commission2PerUnit: `$ ${commission2PerUnit?.toFixed(2)}`,
      commission2PerCase: `$ ${commission2PerCase?.toFixed(2)}`,
      markUpUnit: `$ ${markUpUnit?.toFixed(2)}`,
      markUpCase: `$ ${markUpCase?.toFixed(2)}`,
      uom,
      availableInventory,
    };
    selectedProducts.push(productObj);
  });

  return selectedProducts;
};

export const formatInventoryNumber = (number) => {
  const truncatedNumber = Math.floor(number);
  return truncatedNumber.toLocaleString();
};
