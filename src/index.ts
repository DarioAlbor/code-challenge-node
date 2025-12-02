import "dotenv/config";
import express from "express";
import cors from "cors";
import apiBooksProvider from "./providers/implementations/apiBooksProvider";
import metricsHandler from "./handlers/metrics";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const booksProvider = apiBooksProvider();
const handler = metricsHandler(booksProvider);

app.get("/", handler.get);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

export { app };
