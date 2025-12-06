import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";

const app = express();
const port = config.port;

initDB();

// parser
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World to next level!");
});



app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
