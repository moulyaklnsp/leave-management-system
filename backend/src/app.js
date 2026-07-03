import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import env from "./config/env.js";
import apiLimiter from "./middleware/rateLimiter.js";
import requestLogger from "./middleware/requestLogger.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import routes from "./routes/index.js";
import { swaggerSpec } from "./swagger/swagger.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(apiLimiter);

app.use(requestLogger);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Leave Management API is running 🚀",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);
app.use(notFound);

app.use(errorHandler);

export default app;