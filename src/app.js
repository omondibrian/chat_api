import express, { json } from "express";

const app = express();

//import custom routes
import AuthRoutes from "./routes/auth.routes";
import cors from "cors";
import ChatsRoutes from "./routes/chat.routes";
import verify from "./middleware/verfyToken.middleware";
import { initMinIO } from "./misc/minio";
import { initMongo } from "./misc/db";
const minioBucket = "image-storage";


export async function start() {
  await initMongo();
  const minio = await initMinIO();
  app.get("/uploads/:name", async (req, res) => {
    const stream = await minio.getObject(
      minioBucket,
      decodeURIComponent(req.params.name)
    );
    stream.pipe(res);
  });
  //middlewares

  app.use(json());

  //route middleware
  app.use(cors());
  app.use("/api/user", AuthRoutes);
  app.use("/api/chats", verify, ChatsRoutes);
}
// start()
export default app;
