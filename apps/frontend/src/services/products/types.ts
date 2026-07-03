import type { v1 } from "@pricoteka/core";

export interface ProductLocation {
  store_id?: string;
  office_id: string;
}

export interface ProductsService {
  listProducts: () => v1.Product[];
  productExists: (name: string) => boolean;
  addProduct: (product: {
    name: string;
    description: string;
    price: number;
    found_in?: ProductLocation[];
  }) => void;
}
