const express = require("express");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes.js");
const cookieParser = require("cookie-parser");
const { Logger } = require("./controllers/log.controller.js");
import helmet from "helmet";

const app = express();
app.use(helmet());

app.use(
  morgan(
    ":remote-addr - :method - :url - :status - :res[content-length] - :response-time ms",
    {
      stream: {
        write: (message) => {
          console.log(message);
          Logger(message);
        },
      },
    }
  )
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);

module.exports = app;
