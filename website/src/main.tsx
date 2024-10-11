/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app.tsx";
import "./index.css";

export const facebookAppId = "";
export const googleClientId = "";
export const microsoftClientId = "";

// Microsoft Authentication Library (MSAL) configuration
const msalInstance = new PublicClientApplication({
	auth: {
		clientId: microsoftClientId,
	},
});
await msalInstance.initialize();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<MsalProvider instance={msalInstance}>
			<App />
		</MsalProvider>
	</React.StrictMode>
);
