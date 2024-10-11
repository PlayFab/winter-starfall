/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayFabError } from "..";
import { AppState } from "../redux/reducer";
import { playfabSlice } from "../redux/slice-playfab";
import { siteSlice } from "../redux/slice-site";
import { trackEvent } from "../shared/app-insights";
import { createPlayFabError, formatPlayFabNon200Error } from "../shared/helpers";
import { is } from "../shared/is";
import { SEARCH_ITEMS_MAX_COUNT } from "../shared/types";

export interface IPlayFabHooks {
	error?: PlayFabError;
	isLoading: boolean;
}

type CloudScriptFunctions = "PlayerCreated" | "CombatVictory" | "SellItem" | "ResetPlayer" | "ProgressCheckpoint";

export interface ICloudScriptRequest extends PlayFabCloudScriptModels.ExecuteFunctionRequest {
	FunctionName: CloudScriptFunctions;
}

export function usePlayFab() {
	const [error, setError] = useState<PlayFabError>();
	const [isLoading, setIsLoading] = useState(false);
	const titleId = useSelector((state: AppState) => state.site.titleId);
	const dispatch = useDispatch();

	useEffect(() => {
		PlayFab.settings.titleId = titleId;
	}, [titleId]);

	const startRequest = useCallback(
		(api: string, title: string, request: PlayFabModule.IPlayFabRequestCommon): number => {
			setError(undefined);
			setIsLoading(true);
			const date = new Date().getTime();
			dispatch(playfabSlice.actions.addRequest({ api, title, date, request }));

			return date;
		},
		[dispatch]
	);

	const endRequest = useCallback(
		(date: number, result: PlayFabModule.IPlayFabResultCommon, problem: PlayFabModule.IPlayFabError) => {
			setIsLoading(false);
			dispatch(playfabSlice.actions.setResult({ date, problem, result }));
		},
		[dispatch]
	);

	const catchRequest = useCallback((reject: (reason: any) => void, reason: any) => {
		setIsLoading(false);
		reject(reason);
	}, []);

	const ClientLoginWithEmailAddress = useCallback(
		(request: PlayFabClientModels.LoginWithEmailAddressRequest): Promise<PlayFabClientModels.LoginResult> => {
			const date = startRequest("ClientApi", "LoginWithEmailAddress", request);

			return new Promise((resolve, reject) => {
				PlayFab.ClientApi.LoginWithEmailAddress(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const ClientLoginWithMicrosoftAccount = useCallback(
		(request: PlayFabClientModels.LoginWithOpenIdConnectRequest): Promise<PlayFabClientModels.LoginResult> => {
			const date = startRequest("ClientApi", "LoginWithOpenIdConnect", request);

			return new Promise((resolve, reject) => {
				PlayFab.ClientApi.LoginWithOpenIdConnect(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	interface IClientLoginWithGoogleAccountProps extends PlayFabClientModels.LoginWithGoogleAccountRequest {
		AccessToken: string;
	}

	const ClientLoginWithGoogleAccount = useCallback(
		(request: IClientLoginWithGoogleAccountProps): Promise<PlayFabClientModels.LoginResult> => {
			const date = startRequest("ClientApi", "LoginWithGoogleAccount", request);

			return new Promise((resolve, reject) => {
				PlayFab.ClientApi.LoginWithGoogleAccount(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const ClientLoginWithFacebook = useCallback(
		(request: PlayFabClientModels.LoginWithFacebookRequest): Promise<PlayFabClientModels.LoginResult> => {
			const date = startRequest("ClientApi", "LoginWithFacebook", request);

			return new Promise((resolve, reject) => {
				PlayFab.ClientApi.LoginWithFacebook(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const ClientRegisterPlayFabUser = useCallback(
		(
			request: PlayFabClientModels.RegisterPlayFabUserRequest
		): Promise<PlayFabClientModels.RegisterPlayFabUserResult> => {
			const date = startRequest("ClientApi", "RegisterPlayFabUser", request);

			return new Promise((resolve, reject) => {
				PlayFab.ClientApi.RegisterPlayFabUser(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const ClientGetTitleData = useCallback(
		(request: PlayFabClientModels.GetTitleDataRequest): Promise<PlayFabClientModels.GetTitleDataResult> => {
			const date = startRequest("ClientApi", "GetTitleData", request);

			return new Promise((resolve, reject) => {
				PlayFab.ClientApi.GetTitleData(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const ClientGetTitleNews = useCallback(
		(request: PlayFabClientModels.GetTitleNewsRequest): Promise<PlayFabClientModels.GetTitleNewsResult> => {
			const date = startRequest("ClientApi", "GetTitleNews", request);

			return new Promise((resolve, reject) => {
				PlayFab.ClientApi.GetTitleNews(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const ClientGetUserData = useCallback(
		(request: PlayFabClientModels.GetUserDataRequest): Promise<PlayFabClientModels.GetUserDataResult> => {
			const date = startRequest("ClientApi", "GetUserData", request);

			return new Promise((resolve, reject) => {
				PlayFab.ClientApi.GetUserData(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const ClientUpdateUserData = useCallback(
		(request: PlayFabClientModels.UpdateUserDataRequest): Promise<PlayFabClientModels.UpdateUserDataResult> => {
			const date = startRequest("ClientApi", "UpdateUserData", request);

			return new Promise((resolve, reject) => {
				PlayFab.ClientApi.UpdateUserData(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const ClientUpdateUserTitleDisplayName = useCallback(
		(
			request: PlayFabClientModels.UpdateUserTitleDisplayNameRequest
		): Promise<PlayFabClientModels.UpdateUserTitleDisplayNameResult> => {
			const date = startRequest("ClientApi", "UpdateUserTitleDisplayName", request);

			return new Promise((resolve, reject) => {
				PlayFab.ClientApi.UpdateUserTitleDisplayName(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const ClientGetPlayerProfile = useCallback(
		(request: PlayFabClientModels.GetPlayerProfileRequest): Promise<PlayFabClientModels.GetPlayerProfileResult> => {
			const date = startRequest("ClientApi", "GetPlayerProfile", request);

			return new Promise((resolve, reject) => {
				PlayFab.ClientApi.GetPlayerProfile(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const ClientGetUserReadOnlyData = useCallback(
		(request: PlayFabClientModels.GetUserDataRequest): Promise<PlayFabClientModels.GetUserDataResult> => {
			const date = startRequest("ClientApi", "GetUserReadOnlyData", request);

			return new Promise((resolve, reject) => {
				PlayFab.ClientApi.GetUserReadOnlyData(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const ClientGetStatistics = useCallback(
		(
			request: PlayFabClientModels.GetPlayerStatisticsRequest
		): Promise<PlayFabClientModels.GetPlayerStatisticsResult> => {
			const date = startRequest("ClientApi", "GetPlayerStatistics", request);

			return new Promise((resolve, reject) => {
				PlayFab.ClientApi.GetPlayerStatistics(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const EconomyGetItem = useCallback(
		(request: PlayFabEconomyModels.GetItemRequest): Promise<PlayFabEconomyModels.GetItemResponse> => {
			const date = startRequest("EconomyApi", "GetItem", request);

			return new Promise((resolve, reject) => {
				PlayFab.EconomyApi.GetItem(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const EconomyGetItems = useCallback(
		(request: PlayFabEconomyModels.GetItemsRequest): Promise<PlayFabEconomyModels.GetItemsResponse> => {
			const date = startRequest("EconomyApi", "GetItems", request);

			return new Promise((resolve, reject) => {
				PlayFab.EconomyApi.GetItems(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const EconomyGetInventoryItems = useCallback(
		(
			request: PlayFabEconomyModels.GetInventoryItemsRequest
		): Promise<PlayFabEconomyModels.GetInventoryItemsResponse> => {
			const date = startRequest("EconomyApi", "GetInventoryItems", request);

			return new Promise((resolve, reject) => {
				PlayFab.EconomyApi.GetInventoryItems(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					// Run this recursively if there's a continuation token
					if (is.null(result.data.ContinuationToken)) {
						return resolve(result.data);
					}

					EconomyGetInventoryItems({
						...request,
						ContinuationToken: result.data.ContinuationToken,
					})
						.then(recursiveData => {
							resolve({
								...result.data,
								Items:
									result.data.Items?.concat(
										recursiveData.Items as PlayFabEconomyModels.InventoryItem[]
									) || [],
							});
						})
						.catch(reason => {
							catchRequest(reject, reason);
						});
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const EconomySearchItems = useCallback(
		(request: PlayFabEconomyModels.SearchItemsRequest): Promise<PlayFabEconomyModels.SearchItemsResponse> => {
			const date = startRequest("EconomyApi", "SearchItems", request);

			return new Promise((resolve, reject) => {
				PlayFab.EconomyApi.SearchItems(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					// Run this recursively if there's a continuation token
					if (is.null(result.data.ContinuationToken)) {
						return resolve(result.data);
					}

					EconomySearchItems({
						...request,
						ContinuationToken: result.data.ContinuationToken,
					})
						.then(recursiveData => {
							resolve({
								...result.data,
								Items:
									result.data.Items?.concat(
										recursiveData.Items as PlayFabEconomyModels.InventoryItem[]
									) || [],
							});
						})
						.catch(reason => {
							catchRequest(reject, reason);
						});
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const EconomyPurchaseItems = useCallback(
		(
			request: PlayFabEconomyModels.PurchaseInventoryItemsRequest
		): Promise<PlayFabEconomyModels.PurchaseInventoryItemsResponse> => {
			const date = startRequest("EconomyApi", "PurchaseInventoryItems", request);

			return new Promise((resolve, reject) => {
				PlayFab.EconomyApi.PurchaseInventoryItems(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						return reject(problem);
					}

					if (result.code !== 200) {
						return reject(formatPlayFabNon200Error(result));
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	const CloudScriptExecuteFunction = useCallback(
		(request: ICloudScriptRequest): Promise<PlayFabCloudScriptModels.ExecuteFunctionResult> => {
			const date = startRequest("CloudScriptApi", "ExecuteFunction", request);

			return new Promise((resolve, reject) => {
				PlayFab.CloudScriptApi.ExecuteFunction(request, (result, problem) => {
					endRequest(date, problem, result);

					if (!is.null(problem)) {
						setError(problem);
						return reject(problem);
					}

					if (result.code !== 200) {
						const error = formatPlayFabNon200Error(result);
						setError(error);
						return reject(error);
					}

					if (!is.null(result.data.FunctionResult?.errorMessage)) {
						const error = createPlayFabError(
							result.data.FunctionName,
							result.data.FunctionResult?.errorMessage
						);
						setError(error);
						return reject(error);
					}

					if (request.FunctionName === "ProgressCheckpoint") {
						// Track when users have reached a new checkpoint
						trackEvent(
							{ name: "Checkpoint reached" },
							{ checkpoint: request.FunctionParameter.checkpoint }
						);
					}

					return resolve(result.data);
				}).catch(reason => {
					catchRequest(reject, reason);
				});
			});
		},
		[catchRequest, endRequest, startRequest]
	);

	return {
		ClientGetPlayerProfile,
		ClientGetStatistics,
		ClientGetTitleData,
		ClientGetTitleNews,
		ClientGetUserData,
		ClientGetUserReadOnlyData,
		ClientLoginWithEmailAddress,
		ClientLoginWithMicrosoftAccount,
		ClientLoginWithFacebook,
		ClientLoginWithGoogleAccount,
		ClientRegisterPlayFabUser,
		ClientUpdateUserData,
		ClientUpdateUserTitleDisplayName,
		CloudScriptExecuteFunction,
		EconomyGetInventoryItems,
		EconomyGetItem,
		EconomyGetItems,
		EconomyPurchaseItems,
		EconomySearchItems,
		error,
		isLoading,
		setError,
	};
}

export function useRefreshPlayerData() {
	const { EconomyGetInventoryItems, ClientGetStatistics, isLoading, error } = usePlayFab();
	const dispatch = useDispatch();

	const refreshPlayerData = useCallback(() => {
		return new Promise<void>((resolve, reject) => {
			EconomyGetInventoryItems({ Count: SEARCH_ITEMS_MAX_COUNT })
				.then(data => {
					dispatch(siteSlice.actions.inventory(data.Items));
				})
				.then(() => ClientGetStatistics({}))
				.then(data => {
					dispatch(siteSlice.actions.statistics(data.Statistics));
				})
				.then(() => {
					resolve();
				})
				.catch(reject);
		});
	}, [ClientGetStatistics, EconomyGetInventoryItems, dispatch]);

	return {
		refreshPlayerData,
		isLoading,
		error,
	};
}
