/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// server.js
import cors from "cors";
import express from "express";
import { writeFile } from "fs";
import path from "path";

const app = express();
const PORT = 5174;
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

app.post("/api/data", (req, res) => {
	const { filename, content, isScript } = req.body;

	// Validate the incoming request data
	if (!filename || !content) {
		return res.status(400).json({ error: "Filename and content are required" });
	}

	// Define the path where the file will be written
	const filePath = path.join(__dirname, "src", isScript ? "scripts" : "data", `${filename}.json`);

	writeFile(filePath, content, err => {
		if (err) {
			return res.status(500).json({ error: "Failed to write file " + JSON.stringify(err) });
		}

		return res.status(200).json({ message: "File written successfully" });
	});
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
