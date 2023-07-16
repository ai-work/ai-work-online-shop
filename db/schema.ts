import { InferModel, relations, sql } from "drizzle-orm";
import { boolean, integer, numeric, pgEnum, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', { 
    id: serial('id').primaryKey(),
    fullName: text('full_name'),
    phone: varchar('phone', { length: 256 }),
});

export type User = InferModel<typeof users>; // return type when queried
export type NewUser = InferModel<typeof users, 'insert'>; // insert type

// declaring enum in database
export const popularityEnum = pgEnum('popularity', ['unknown', 'known', 'popular']);

export const countries = pgTable('countries', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
}, (countries) => {
    return {
        nameIndex: uniqueIndex('name_idx').on(countries.name),
    }
});

export const cities = pgTable('cities', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
    countryId: integer('country_id').references(() => countries.id),
    popularity: popularityEnum('popularity'),
});

export const stores = pgTable('stores', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
    userId: integer('user_id').references(() => users.id),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updated_at'),
});

export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    storeId: integer('store_id').references(() => stores.id), // Foreign Key to Store
    billboardId: integer('billboard_id').references(() => billboards.id),// Foreign Key to Billboard
    name: varchar('name', { length: 256 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at'),
}, (categories) => {
    return {
        storeIndex: uniqueIndex('store_idx').on(categories.storeId),
        billboardIndex: uniqueIndex('billboard_idx').on(categories.billboardId),
    }
});

export const storeToCategoriesRelations = relations(stores, ({ many }) => ({
	billboards: many(categories),
}));

export const categoriesToStoreRelations = relations(categories, ({ one }) => ({
	categoriesStore: one(stores, {
		fields: [categories.storeId],
		references: [stores.id],
	})
}));

export const billboards = pgTable('billboards', {
    id: serial('id').primaryKey(),
    storeId: integer('store_id').references(() => stores.id),
    label: varchar('name', { length: 256 }),
    imageUrl: varchar('name', { length: 256 }),
    categoryId: integer('category_id').references(() => categories.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
}, (billboards) => {
    return {
        storeIndex: uniqueIndex('store_idx').on(billboards.storeId),
    }
});

export const storeToBillboardsRelations = relations(stores, ({ many }) => ({
	billboards: many(billboards),
}));

export const billboardsToStoreRelations = relations(billboards, ({ one }) => ({
	billboardStore: one(stores, {
		fields: [billboards.storeId],
		references: [stores.id],
	}),
}));

export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    storeId: integer('store_id').references(() => stores.id), // Foreign Key to Store
    categoryId: integer('category_id').references(() => categories.id), // Foreign Key to Category
    name: varchar('name', { length: 256 }),
    price: numeric('price', { precision: 100, scale: 20 }),
    isFeatured: boolean('is_featured'),
    isArchived: boolean('is_archived').default(false),
    sizeId: integer('size_id').references(() => sizes.id), // Foreign Key to Size
    size        Size      @relation(fields: [sizeId], references: [id])
    colorId: integer('color_id').references(() => colors.id), // Foreign Key to Color
    color       Color     @relation(fields: [colorId], references: [id])
    images      Image[]   // Relation to Image model
    orderItems  OrderItem[]   // Relation to Order model
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
}, (products) => {
    return {
        storeIndex: uniqueIndex('store_idx').on(products.storeId),
        categoryIndex: uniqueIndex('category_idx').on(products.categoryId),
        storeIndex: uniqueIndex('size_idx').on(products.sizeId),
        storeIndex: uniqueIndex('color_idx').on(products.colorId),
    }
});

export const storeToProductsRelations = relations(stores, ({ many }) => ({
	storeProducts: many(products),
}));

export const categoryToProductsRelations = relations(categories, ({ many }) => ({
	categoryProducts: many(products),
}));

export const productsToCategoryRelations = relations(products, ({ one }) => ({
	productsCategory: one(categories, {
		fields: [products.categoryId],
		references: [categories.id],
	}),
}));

export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    storeId: integer('store_id').references(() => stores.id), // Foreign Key to Store
    orderItems OrderItem[] // Relation to OrderItem model
    isPaid: boolean('is_paid').default(false),
    phone: varchar('phone', { length: 32 }),
    address: varchar('address', { length: 64 })    String    @default("")
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at'),
    @@index([storeId])
});

export const storeToOrdersRelations = relations(stores, ({ many }) => ({
	storeOrders: many(orders),
}));

export const ordersToStoreRelations = relations(orders, ({ one }) => ({
	ordersStore: one(stores, {
		fields: [orders.storeId],
		references: [stores.id],
	})
}));

  // Intermediary for a many-to-many relationship
export const orderItems = pgTable('order_items', {
    id: serial('id').primaryKey(),
    orderId   String  // Foreign Key to Order
    order     Order   @relation(fields: [orderId], references: [id])
    productId String  // Foreign Key to Product
    product   Product @relation(fields: [productId], references: [id])

    @@index([orderId])
    @@index([productId])
});

export const sizes = pgTable('sizes', {
    id: serial('id').primaryKey(),
    storeId: integer('store_id').references(() => stores.id), // Foreign Key to Store
    store       Store     @relation("StoreToSize", fields: [storeId], references: [id])
    name: varchar('name', { length: 256 } ),
    value: varchar('value', { length: 256 } ),
    products    Product[] // Relation to Product model
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at'),

    @@index([storeId])
}

export const storeToSizesRelations = relations(stores, ({ many }) => ({
	storeSizes: many(sizes),
}));

export const colors = pgTable('colors', {
    id: serial('id').primaryKey(),
    storeId: integer('store_id').references(() => stores.id), // Foreign Key to Store
    store       Store    @relation("StoreToColor", fields: [storeId], references: [id])
    name: varchar('name', { length: 256 } ),
    value: varchar('value', { length: 256 } ),
    products    Product[] // Relation to Product model
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at'),

    @@index([storeId])
}

export const storeToColorsRelations = relations(stores, ({ many }) => ({
	storeColors: many(colors),
}));

export const image = pgTable('image', {
    id: serial('id').primaryKey(),
    productId: integer('product_id').references(() => products.id), // Foreign Key to Product
    product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
    url: varchar('url', { length: 256 } ),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at'),
}