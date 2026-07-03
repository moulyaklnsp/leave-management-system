import logger from "../config/logger.js";

const requestLogger = (req, res, next) => {
  logger.info(
    `${req.method} ${req.originalUrl} ${req.ip}`
  );

  next();
};

export default requestLogger;