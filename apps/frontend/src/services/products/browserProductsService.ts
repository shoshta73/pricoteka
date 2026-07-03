import type { v1 } from "@pricoteka/core";
import { v4 as uuidv4 } from "uuid";

import type { ProductsService } from "@/services/products/types";

interface BrowserProductsServiceOptions {
  getProducts: () => v1.Product[];
  setProducts: (products: v1.Product[]) => void;
}

export function createBrowserProductsService({ getProducts, setProducts }: BrowserProductsServiceOptions): ProductsService {
  const service: ProductsService = {
    listProducts: () => getProducts(),
    productExists: (name) => {
      const products = getProducts();
      for (const product of products) {
        if (product.name === name) {
          return true;
        }
      }

      return false;
    },
    addProduct: ({ name, description, price, found_in = [] }) => {
      const products = getProducts();
      if (service.productExists(name)) {
        return;
      }

      const newProduct: v1.Product = {
        id: uuidv4(),
        name,
        description,
        price,
        found_in,
      };
      setProducts([...products, newProduct]);
    },
  };

  return service;
}
