/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import React from "react";
import { createRoot } from "react-dom/client";
import "react-h5-audio-player/lib/styles.css";
import { App } from "./app.tsx";
import "./index.css";

export const facebookAppId = "";
export const googleClientId = "233912236857-1cun0htjdjbufm7tgq6afevb0mv9qjq1.apps.googleusercontent.com";
export const microsoftClientId = "8315e44b-c619-4608-a162-15ca52e83e72";

// Microsoft Authentication Library (MSAL) configuration
const msalInstance = new PublicClientApplication({
	auth: {
		clientId: microsoftClientId,
	},
});
await msalInstance.initialize();

createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<MsalProvider instance={msalInstance}>
			<App />
		</MsalProvider>
	</React.StrictMode>
);
