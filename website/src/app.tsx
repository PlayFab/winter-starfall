/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { initializeIcons } from "@fluentui/font-icons-mdl2";
import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { cookie } from "./components/cookies";
import { PlayFabActivityPopup } from "./components/playfab/popup";
import { LocaleProvider } from "./locale";
import { AppState } from "./redux/reducer";
import { siteSlice } from "./redux/slice-site";
import store from "./redux/store";
import { Router } from "./router";
import { initApplicationInsights } from "./shared/app-insights";

initializeIcons("./fluent-icons/");

export const App: React.FunctionComponent = () => {
	return (
		<Provider store={store}>
			<AppWithApplicationInsights />
		</Provider>
	);
};

const AppWithApplicationInsights: React.FunctionComponent = () => {
	const dispatch = useDispatch();
	const doesUserAcceptAnalytics = useSelector((state: AppState) => state.site.doesUserAcceptAnalytics);

	useEffect(() => {
		if (!doesUserAcceptAnalytics) {
			return;
		}

		initApplicationInsights();
	}, [doesUserAcceptAnalytics]);

	useEffect(() => {
		cookie.setReduxStore((isRequired: boolean) => {
			dispatch(siteSlice.actions.doesUserAcceptAnalytics(isRequired));
		});
	}, [dispatch]);

	return (
		<LocaleProvider>
			<Router />
			<PlayFabActivityPopup />
		</LocaleProvider>
	);
};
