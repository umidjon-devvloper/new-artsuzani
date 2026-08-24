import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
   
  var _mongooseCache: MongooseCache | undefined;
}

// Serverless (Vercel) muhitida modul qayta yuklanganda ham bitta ulanish
// qayta ishlatilishi uchun global'da saqlaymiz.
const cached: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null,
};
global._mongooseCache = cached;

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  // MUHIM: promise'ni cache qilamiz. Aks holda bir vaqtda kelgan so'rovlar
  // har biri alohida ulanish ochib, Atlas connection limitini to'ldiradi.
  if (!cached.promise) {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI environment variable is not set");

    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false, // ulanmasdan turib query yuborilsa darhol xato bersin
        maxPoolSize: 10,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 10_000,
        socketTimeoutMS: 45_000,
        family: 4, // IPv6 DNS kechikishini oldini oladi
      })
      .catch((err) => {
        // Muvaffaqiyatsiz promise'ni cache'da qoldirmaymiz, keyingi urinish qayta ulanadi
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
