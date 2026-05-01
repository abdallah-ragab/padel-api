import { parseBody } from "../utils/parseBody.js";
import { readDB, writeDB } from "../storage/db.js";

function overlaps(a, b) {
	return a.start < b.end && a.end > b.start;
}

function sendJSON(res, status, body) {
	res.writeHead(status, { "Content-Type": "application/json" });
	res.end(JSON.stringify(body));
}

export async function createBooking(req, res) {
	const body = await parseBody(req);
	if (!body.courtId || !body.playerName || !body.start || !body.end) {
		return sendJSON(res, 400, {
			error: "courtId, playerName, start, end required",
		});
	}

	const db = await readDB();

	const conflict = db.bookings.find(
		(b) => b.courtId === body.courtId && overlaps(body, b),
	);

	if (conflict) {
		return sendJSON(res, 409, {
			error: "Slot already booked",
			conflict: { start: conflict.start, end: conflict.end },
		});
	}

	const booking = {
		id: String(Date.now()),
		courtId: body.courtId,
		playerName: body.playerName,
		start: body.start,
		end: body.end,
		createdAt: new Date().toISOString(),
	};

	db.bookings.push(booking);
	await writeDB(db);
	return sendJSON(res, 201, booking);
}
