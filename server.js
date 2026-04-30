import http from "node:http";
import { router } from "./router.js";

const server = http.createServer((req, res) => {
	router(req, res);
});

server.listen(3000, () => {
	console.log("Padel API running on http://localhost:3000");
});
