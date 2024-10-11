/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { createBrowserHistory } from "history";
import React from "react";
import { Provider } from "react-redux";
import { WcpCookiesProvider } from "./components/cookies";
import { PlayFabActivityPopup } from "./components/playfab/popup";
import { LocaleProvider } from "./locale";
import store from "./redux/store";
import { Router } from "./router";
import { initApplicationInsights } from "./shared/app-insights";
const reactPlugin = new ReactPlugin();
const browserHistory = createBrowserHistory();

initApplicationInsights({
	extensions: [reactPlugin],
	extensionConfig: {
		[reactPlugin.identifier]: { history: browserHistory },
	},
});

initializeIcons("./fluent-icons/");

export const App: React.FunctionComponent = () => {
	return (
		<Provider store={store}>
			<WcpCookiesProvider>
				<LocaleProvider>
					<Router />
					<PlayFabActivityPopup />
				</LocaleProvider>
			</WcpCookiesProvider>
		</Provider>
	);
};
