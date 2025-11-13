import morgan from "morgan";
import logger from "../utils/logger.js";

const stream = { write: (message) => logger.http(message.trim()) };
const skip = () => process.env.NODE_ENV === "test";
export default morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);