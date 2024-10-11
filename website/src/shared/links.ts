/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { is } from "./is";

export const links = {
	microsoft: "https://www.microsoft.com/",
	playfab: "https://www.playfab.com/",
	documentation: "https://learn.microsoft.com/en-us/gaming/playfab/",
	blog: "https://blog.playfab.com/blog",
	forums: "https://community.playfab.com/",
	facebook: "https://www.facebook.com/playfabnetwork",
	twitter: "http://twitter.com/AzurePlayFab",
	linkedIn: "https://www.linkedin.com/company/3641570",
	youtube: "http://youtube.com/user/playfabnetwork",
	contactUs: "https://playfab.com/contact/",
	github: "https://github.com/PlayFab/winter-starfall",
	githubPlayFab: "https://github.com/PlayFab",
	discord: "https://discord.gg/msftgamedev",
	titleOverviewDashboard: (titleId: string) => `https://developer.playfab.com/en-us/${titleId}/dashboard`,
	playerOverview: (titleId: string, playerId: string) =>
		`https://developer.playfab.com/en-us/r/t/${titleId}/players/${playerId}/overview`,
	apiDocumentation: (api: string | undefined, title: string | undefined) => {
		if (is.null(api) || is.null(title)) {
			return links.documentation;
		}

		const start = "https://learn.microsoft.com/en-us/rest/api/playfab/";
		const end = "?view=playfab-rest";
		let middle = "";
		switch (api) {
			case "ClientApi":
				switch (title) {
					case "LoginWithEmailAddress":
						middle = "client/authentication/login-with-email-address";
						break;
					case "LoginWithGoogleAccount":
						middle = "client/authentication/login-with-google-account";
						break;
					case "LoginWithFacebook":
						middle = "client/authentication/login-with-facebook";
						break;
					case "RegisterPlayFabUser":
						middle = "client/authentication/register-playfab-user";
						break;
					case "GetTitleData":
						middle = "client/title-wide-data-management/get-title-data";
						break;
					case "GetTitleNews":
						middle = "client/title-wide-data-management/get-title-news";
						break;
					case "GetUserData":
						middle = "client/player-data-management/get-user-data";
						break;
					case "UpdateUserData":
						middle = "client/player-data-management/update-user-data";
						break;
					case "UpdateUserTitleDisplayName":
						middle = "client/account-management/update-user-title-display-name";
						break;
					case "GetPlayerProfile":
						middle = "client/account-management/get-player-profile";
						break;
					case "GetUserReadOnlyData":
						middle = "client/player-data-management/get-user-read-only-data";
						break;
					case "GetPlayerStatistics":
						middle = "client/player-data-management/get-player-statistics";
						break;
				}
				break;
			case "EconomyApi":
				switch (title) {
					case "GetItem":
						middle = "economy/catalog/get-item";
						break;
					case "GetItems":
						middle = "economy/catalog/get-items";
						break;
					case "GetInventoryItems":
						middle = "economy/inventory/get-inventory-items";
						break;
					case "SearchItems":
						middle = "economy/catalog/search-items";
						break;
					case "PurchaseInventoryItems":
						middle = "economy/inventory/purchase-inventory-items";
						break;
				}
				break;
			case "CloudScriptApi":
				switch (title) {
					case "ExecuteFunction":
						middle = "cloudscript/server-side-cloud-script/execute-function";
						break;
				}
				break;
		}

		return start + middle + end;
	},
};
