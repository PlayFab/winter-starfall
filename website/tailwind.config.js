/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/** @type {import('tailwindcss').Config} */

export default {
	content: ["./index.html", "./public/about.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			textShadow: {
				sm: "0 1px 2px var(--tw-shadow-color)",
				DEFAULT: "0 2px 4px var(--tw-shadow-color)",
				lg: "0 8px 16px var(--tw-shadow-color)",
			},
			colors: {
				html: "#FFFDEC",
				link: "#147DC4",
				"link-light": "#3894D2",
				"link-pale": "#E7F1F7",
				border: "rgb(212 212 212)",
			},
			screens: {
				xxxs: "320px",
				xxs: "390px",
				xs: "460px",
			},
			minWidth: { "popup-1": "358px", "popup-2": "430px" },
			maxWidth: {
				site: "80rem",
				editor: "95vw",
			},
			maxHeight: {
				"page-bg": "100vh",
				"playfab-activity": "40rem",
			},
			height: {
				combatActionBar: "168px",
				"page-bg": "100vh",
			},
			gridTemplateColumns: {
				"playfab-visible": "1fr 320px",
				"editor-ui": "200px 1fr",
			},
			margin: {
				"home-bg": "calc(5rem + 1px)",
			},
		},
	},
	plugins: [require("@tailwindcss/forms")],
};
