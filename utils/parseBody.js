export function parseBody(req) {
	return new Promise((resolve, reject) => {
		const chunks = [];

		req.on("data", (chunk) => {
			chunks.push(chunk);
		});

		req.on("end", () => {
			const raw = Buffer.concat(chunks).toString("utf8");
			if (!raw) {
				resolve({});
				return;
			}

			try {
				resolve(JSON.parse(raw));
			} catch {
				reject(new Error("Invalid JSON in request body"));
			}
		});

		req.on("error", reject);
	});
}
