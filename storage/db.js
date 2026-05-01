import { readFile, writeFile } from "node:fs/promises";
const DB_PATH = "./data/db.json";

export async function readDB() {
	try {
		const raw = await readFile(DB_PATH, "utf-8");
		return JSON.parse(raw);
	} catch (err) {
		if (err.code === "ENOENT") {
			return { courts: [], bookings: [] };
		}
		throw err;
	}
}

export async function writeDB(data) {
	await writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}
