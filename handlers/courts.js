export function createCourt(req, res) {
	res.writeHead(201, { "Content-Type": "application/json" });
	res.end(JSON.stringify({ message: "createCourt works" }));
}

export function listCourts(req, res) {
	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(JSON.stringify([{ id: "1", name: "Test Court" }]));
}

export function getSlots(req, res, id) {
	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(
		JSON.stringify({
			courtId: id,
			slots: [],
		}),
	);
}
