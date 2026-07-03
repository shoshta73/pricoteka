import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const stores = sqliteTable("stores", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const offices = sqliteTable("offices", {
  id: text("id").primaryKey(),
  storeId: text("store_id")
    .notNull()
    .references(() => stores.id),
  name: text("name").notNull(),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
});

export const productOffices = sqliteTable("product_offices", {
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  officeId: text("office_id")
    .notNull()
    .references(() => offices.id),
});
