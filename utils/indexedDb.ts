import Dexie from "dexie";

const db = new Dexie("chatDB");
db.version(1).stores({
  user: "username, publicKey, privateKey",
});

export const userTable = db.table("user");
export default db;
