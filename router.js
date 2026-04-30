import { createCourt, listCourts, getSlots } from "./handlers/courts.js";
import { createBooking } from "./handlers/bookings.js";

export function router(req, res) {
	const url = new URL(req.url, "http://localhost");
	const parts = url.pathname.split("/").filter(Boolean);

	const resource = parts[0];
	const id = parts[1];

	if (req.method === "GET" && resource === "courts" && !id)
		return listCourts(req, res);
	if (req.method === "POST" && resource === "courts")
		return createCourt(req, res);
	if (req.method === "GET" && resource === "courts" && id)
		return getSlots(req, res, id);
	if (req.method === "POST" && resource === "bookings")
		return createBooking(req, res);

	res.writeHead(404, { "Content-Type": "application/json" });
	res.end(JSON.stringify({ error: "Not found" }));
}
