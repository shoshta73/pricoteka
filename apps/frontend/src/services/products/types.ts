import type { Product, ProductLocation } from "@pricoteka/core";

export interface ProductsService {
  listProducts: () => Product[];
  productExists: (name: string) => boolean;
  addProduct: (product: {
    name: string;
    description: string;
    price: number;
    found_in?: ProductLocation[];
  }) => void;
}
