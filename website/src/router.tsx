/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { useNotifications } from "./hooks/use-notifications";
import { useUpdatePlayerData } from "./hooks/use-party";
import { IndexPage } from "./pages";
import { AboutPage } from "./pages/about";
import { EditorPage } from "./pages/editor";
import { ExplorePage } from "./pages/explore";
import { NotFoundPage } from "./pages/not-found";
import { PrivacyPage } from "./pages/privacy";
import { SandboxPage } from "./pages/sandbox";
import { TermsPage } from "./pages/terms";
import { formatRoute } from "./shared/helpers";

const routeNames = {
	Index: "/",
	About: "/about",
	Privacy: "/privacy",
	Terms: "/terms",
	Explore: "/explore",
	Sandbox: "/sandbox",
	Editor: "/editor",
};

export const routes = {
	Index: () => formatRoute(routeNames.Index),
	About: () => formatRoute(routeNames.About),
	Privacy: () => formatRoute(routeNames.Privacy),
	Terms: () => formatRoute(routeNames.Terms),
	Explore: () => formatRoute(routeNames.Explore),
	Sandbox: () => formatRoute(routeNames.Sandbox),
	Editor: () => formatRoute(routeNames.Editor),
};

export const Router: React.FunctionComponent = () => {
	useUpdatePlayerData();
	useNotifications();

	return (
		<HashRouter>
			<Routes>
				<Route path="*" element={<NotFoundPage />} />
				<Route path={routeNames.Index} element={<IndexPage />} />
				<Route path={routeNames.About} element={<AboutPage />} />
				<Route path={routeNames.Privacy} element={<PrivacyPage />} />
				<Route path={routeNames.Terms} element={<TermsPage />} />
				<Route path={routeNames.Explore} element={<ExplorePage />} />
				<Route path={routeNames.Sandbox} element={<SandboxPage />} />
				<Route path={routeNames.Editor} element={<EditorPage />} />
			</Routes>
		</HashRouter>
	);
};
