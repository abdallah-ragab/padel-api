export function createBooking(req, res) {
	res.writeHead(201, { "Content-Type": "application/json" });
	res.end(JSON.stringify({ message: "createBooking works" }));
}
