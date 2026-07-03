import app from "./app.js";
import env from "./config/env.js";
import logger from "./config/logger.js";
import prisma from "./config/prisma.js";

async function startServer() {
  try {
    await prisma.$connect();

    logger.info("Database connected successfully.");

    app.listen(env.PORT, () => {
      logger.info(
        `Server running on http://localhost:${env.PORT}`
      );
    });
  } catch (error) {
    logger.error(error.message);

    process.exit(1);
  }
}

startServer();