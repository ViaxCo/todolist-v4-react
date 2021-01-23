import mongoose, { Document } from "mongoose";

// Item interface
export interface ItemDoc extends Document {
  task: string;
  completed: boolean;
}
// List interface
export interface ListDoc extends Document {
  name: string;
  items: ItemDoc[];
}
// User interface
export interface UserDoc extends Document {
  uuid: string;
  lists: ListDoc[];
}

// Item schema
const itemSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
});
// List schema
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema],
});
// User schema
const userSchema = new mongoose.Schema({
  uuid: String,
  lists: [listSchema],
});

export const Item = mongoose.model<ItemDoc>("Item", itemSchema);
export const List = mongoose.model<ListDoc>("List", listSchema);
export const User = mongoose.model<UserDoc>("User", userSchema);
