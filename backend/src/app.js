import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { Logger } from "./controllers/log.controller.js";
const app = express();
app.use(morgan(':remote-addr - :method - :url - :status - :res[content-length] - :response-time ms', { stream: { write: (message) => Logger(message) } }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);

export default app;
