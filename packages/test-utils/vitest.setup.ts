import { resolve } from "path";
import { startServer } from "./src/msw/server";

const SWAGGER_PATH = resolve(__dirname, "./swaggerApi.json");

startServer(SWAGGER_PATH, "http://localhost:8080");
