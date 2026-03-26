import { primaryKey, text, timestamp, integer, pgTable } from "drizzle-orm/pg-core";
import { postsTable } from "./posts";

export const postLikesTable = pgTable(
  "post_likes",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    deviceId: text("device_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.deviceId] }),
  }),
);

export type PostLike = typeof postLikesTable.$inferSelect;
