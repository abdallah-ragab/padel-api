import { readDB, writeDB } from "../storage/db.js";
import { parseBody } from "../utils/parseBody.js";

// generate slots
function generateSlots(date, openHour, closeHour) {
	const slots = [];
	for (let hour = openHour; hour < closeHour; hour++) {
		slots.push({
			start: `${date}T${String(hour).padStart(2, "0")}:00:00`,
			end: `${date}T${String(hour + 1).padStart(2, "0")}:00:00`,
		});
	}

	return slots;
}

// overlap
function overlaps(a, b) {
	return a.start < b.end && b.start < a.end;
}

// get slots
export async function getSlots(req, res, courtId) {
	const url = new URL(req.url, "http://localhost");
	const date = url.searchParams.get("date");

	if (!date) {
		res.writeHead(400, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: "date query param required" }));
		return;
	}

	const db = await readDB();
	const allSlots = generateSlots(date, 6, 23);

	const booked = db.bookings.filter(
		(b) => b.courtId === courtId && b.start.startsWith(date),
	);

	const available = allSlots.filter(
		(slot) => !booked.some((b) => overlaps(slot, b)),
	);

	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(JSON.stringify({ courtId, date, available }));
}

export async function createCourt(req, res) {
	const body = await parseBody(req);

	if (!body.name) {
		res.writeHead(400, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: "name required" }));
		return;
	}

	const db = await readDB();
	const court = {
		id: String(Date.now()),
		name: body.name,
		createdAt: new Date().toISOString(),
	};
	db.courts.push(court);
	await writeDB(db);
	res.writeHead(201, { "Content-Type": "application/json" });
	res.end(JSON.stringify(court));
}

export async function listCourts(req, res) {
	const db = await readDB();
	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(JSON.stringify(db.courts));
}
