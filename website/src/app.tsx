/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { initializeIcons } from "@fluentui/font-icons-mdl2";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { cookie } from "./components/cookies";
import { PlayFabActivityPopup } from "./components/playfab/popup";
import { LocaleProvider } from "./locale";
import store from "./redux/store";
import { Router } from "./router";
import { initApplicationInsights, unloadApplicationInsights } from "./shared/app-insights";

initializeIcons("./fluent-icons/");

export const App: React.FunctionComponent = () => {
	useEffect(() => {
		cookie.init(initApplicationInsights, unloadApplicationInsights);
	}, []);

	return (
		<Provider store={store}>
			<LocaleProvider>
				<Router />
				<PlayFabActivityPopup />
			</LocaleProvider>
		</Provider>
	);
};
