export type TProduct = {
  _id: string;
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

export type TProductItem = {
  _id: string;
  key: string;
  name: string;
  price: number;
  quantity: number;
  brand: string;
  model: string;
  operatingSystem: string;
  screenSize: string;
  storageCapacity: string;
  releaseDate: string; // Format: YYYY-MM-DD
  img: string;
  isAvailable: boolean;
  isDeleted: boolean;
};

export type TUpdateProductModalProps = {
  productId: string;
  productInfo: {
    name: string;
    price: number;
    quantity: number;
    releaseDate: string;
    model: string;
    operatingSystem: string;
    screenSize: string;
    storageCapacity: string;
    img: string;
    brand: string;
    isAvailable: boolean;
  };
};
