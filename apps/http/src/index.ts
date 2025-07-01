import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createroom, getrooms, signin, signup } from "./controlller/controller";
import { authmiddleware } from "./middleware/middleware";
const app = express();
dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

app.get("/healthcheck", (req, res) => {
  res.send("working");
});

app.post("/signup", signup);
app.post("/signin", signin);
app.post("/createroom", authmiddleware, createroom);
app.get("/getrooms", getrooms);

app.listen(process.env.PORT, () => {
  console.log("connected to http");
});
