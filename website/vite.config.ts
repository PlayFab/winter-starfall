import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		hmr: false,
	},
	build: {
		chunkSizeWarningLimit: 2000,
		target: "esnext",
	},
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				theme_color: "#fff",
				background_color: "#fff",
				name: "Winter Starfall",
				short_name: "Winter Starfall",
				orientation: "portrait",
				display: "standalone",
				description: "PlayFab demo game showcasing Economy v2, Azure Functions, and more",
				icons: [
					{
						src: "https://www.winterstarfall-unofficial.com/assets/pwa/manifest-icon-512.maskable.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "https://www.winterstarfall-unofficial.com/assets/pwa/manifest-icon-192.maskable.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "any",
					},
				],
			},
		}),
	],
});
