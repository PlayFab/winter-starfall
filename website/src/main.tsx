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
export const googleClientId = "1006886579566-psdcimf1u3qbsl7rb9doof62ob0eq8ot.apps.googleusercontent.com";
export const microsoftClientId = "d406de5e-eaa5-4c0a-aa64-bded00ce2b93";

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
