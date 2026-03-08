"use server";

import dbConnect from "@/lib/connection";
import Category from "@/models/category.model";
import { OrdersModel } from "@/models/orders.model";
import Product from "@/models/product.model";

export const statistika = async () => {
  await dbConnect();

  const productlength = await Product.countDocuments();
  const categorylength = await Category.countDocuments();
  const orderslength = await OrdersModel.countDocuments();
  return {
    productlength,
    categorylength,
    orderslength,
  };
};
