import { TProduct, TSeller } from ".";

export type TSales = {
  _id: string;
  buyerName: string;
  price: number;
  productQuantity: number;
  productId: TProduct | null;
  soldBy: TSeller | null;
  createdAt: Date;
};

export type TSalesInfo = {
  quantity: number;
  isAvailable: boolean;
  key: string;
  price: number;
};

export type TSalesItem = {
  _id: string;
  key: string;
  name: string;
  price: number;
  quantity: number;
  brand: string;
  model: string;
  operatingSystem: string;
  screenSize: number;
  storageCapacity: string;
  releaseDate: string; // Format: YYYY-MM-DD
  img: string;
  isAvailable: boolean;
  isDeleted: boolean;
};

export type TItem = {
  key: string;
  buyerName: string;
  price: number;
  productQuantity: number;
  productId: string;
};
