import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const liveGameState = sqliteTable("live_game_state", {
  room: text("room").primaryKey(),
  payload: text("payload").notNull(),
  updatedAt: integer("updated_at").notNull(),
});
