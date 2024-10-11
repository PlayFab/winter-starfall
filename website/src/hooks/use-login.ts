/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { useMsal } from "@azure/msal-react";
import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlayFabError } from "..";
import { siteSlice } from "../redux/slice-site";
import { routes } from "../router";
import { trackEvent } from "../shared/app-insights";
import { createPlayFabError } from "../shared/helpers";
import { is } from "../shared/is";
import {
	ILocalDataCinematics,
	ILocalDataEnemies,
	ILocalDataLocations,
	SEARCH_ITEMS_MAX_COUNT,
	TITLE_DATA_KEYS_ALL,
	USER_DATA_KEYS_PLAYER_ALL,
	USER_DATA_KEYS_READONLY_ALL,
} from "../shared/types";
import Strings from "../strings";
import { IFormHooks, useForm } from "./use-form";
import { IPlayFabHooks, usePlayFab } from "./use-playfab";
import { facebookAppId, googleClientId, microsoftClientId } from "../main";

export interface IRegisterFormModel {
	email: string;
	password: string;
	password_confirm: string;
}

export type LoginMethodInProgress = "email" | "microsoft" | "google" | "facebook";

interface IResults {
	data: IRegisterFormModel;
	error: PlayFabModule.IPlayFabError | undefined;
	canLoginWithMicrosoft: boolean;
	canLoginWithGoogle: boolean;
	canLoginWithFacebook: boolean;
	loginMethodInProgress: LoginMethodInProgress | undefined;

	onClearErrors: () => void;
	onLogin: () => void;
	onRegister: () => void;
	onLoginWithGoogle: () => void;
	onLoginWithFacebook: () => void;
	onLoginWithMicrosoft: () => void;
}

const loginEventCount = 7;



type Results = IResults & IFormHooks<IRegisterFormModel> & IPlayFabHooks;

// Facebook login
window.fbAsyncInit = function () {
	FB.init({
		appId: facebookAppId,
		xfbml: true,
		version: "v19.0",
	});
};

export function useLogin(): Results {
	const intl = useIntl();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { instance } = useMsal();

	const [isLoading, setIsLoading] = useState(false);
	const [googleClient, setGoogleClient] = useState<google.accounts.oauth2.TokenClient>();
	const [canLoginWithGoogle, setCanLoginWithGoogle] = useState(false);
	const canLoginWithFacebook = !is.null(facebookAppId);
	const canLoginWithMicrosoft = !is.null(microsoftClientId);
	const [loginMethodInProgress, setLoginMethodInProgress] = useState<LoginMethodInProgress | undefined>(undefined);

	const { data, onChange } = useForm<IRegisterFormModel>({ email: "", password: "", password_confirm: "" });
	const {
		error,
		setError,
		ClientLoginWithEmailAddress,
		ClientLoginWithMicrosoftAccount,
		ClientLoginWithFacebook,
		ClientLoginWithGoogleAccount,
		CloudScriptExecuteFunction,
		ClientRegisterPlayFabUser,
	} = usePlayFab();
	const { postLoginFunctions } = usePlayFabPostLoginData();

	const onError = useCallback(
		(reason: PlayFabError) => {
			setError(reason);
			setIsLoading(false);
		},
		[setError]
	);

	const onClearErrors = useCallback(() => {
		setError(undefined);
		setLoginMethodInProgress(undefined);
	}, [setError]);

	const onRegister = useCallback(() => {
		if (data.password !== data.password_confirm) {
			onError(createPlayFabError("password_confirm", intl.formatMessage({ id: Strings.error_passwords_match })));
			return;
		}

		setIsLoading(true);
		setLoginMethodInProgress("email");
		dispatch(siteSlice.actions.loginSteps(loginEventCount));

		ClientRegisterPlayFabUser({ Email: data.email, Password: data.password, RequireBothUsernameAndEmail: false })
			.then(result => {
				dispatch(siteSlice.actions.register(result));
				dispatch(siteSlice.actions.loginStepsAdvance());
				// Track signups from new users
				trackEvent({ name: "New User", properties: {} });
			})
			.then(() =>
				CloudScriptExecuteFunction({
					FunctionName: "PlayerCreated",
					GeneratePlayStreamEvent: true,
				})
			)
			.then(() => postLoginFunctions())
			.then(() => {
				setIsLoading(false);
				navigate(routes.Explore());
			})
			.catch(problem => {
				dispatch(siteSlice.actions.loginStepsReset());
				onError(problem);
			})
			.finally(() => dispatch(siteSlice.actions.loginStepsReset()));
	}, [
		data.password,
		data.password_confirm,
		data.email,
		dispatch,
		ClientRegisterPlayFabUser,
		onError,
		intl,
		CloudScriptExecuteFunction,
		postLoginFunctions,
		navigate,
	]);

	const onLogin = useCallback(() => {
		setIsLoading(true);
		setLoginMethodInProgress("email");

		dispatch(siteSlice.actions.loginSteps(loginEventCount));

		ClientLoginWithEmailAddress({ Email: data.email, Password: data.password })
			.then(result => {
				dispatch(siteSlice.actions.login(result));
				dispatch(siteSlice.actions.loginStepsAdvance());
				// Track logins from returning users
				trackEvent({ name: "Returning User", properties: {} });
			})
			.then(() => {
				return postLoginFunctions();
			})
			.then(() => {
				setIsLoading(false);
				navigate(routes.Explore());
			})
			.catch(problem => {
				dispatch(siteSlice.actions.loginStepsReset());
				onError(problem);
			})
			.finally(() => dispatch(siteSlice.actions.loginStepsReset()));
	}, [ClientLoginWithEmailAddress, data.email, data.password, dispatch, navigate, onError, postLoginFunctions]);

	const onLoginWithGoogle = useCallback(() => {
		googleClient?.requestAccessToken();
	}, [googleClient]);

	const loginWithGoogle = useCallback(
		(accessToken: string) => {
			setIsLoading(true);
			setLoginMethodInProgress("google");

			dispatch(siteSlice.actions.loginSteps(loginEventCount));

			ClientLoginWithGoogleAccount({ CreateAccount: true, AccessToken: accessToken })
				.then(result => {
					if (result.NewlyCreated) {
						dispatch(siteSlice.actions.register(result));
					} else {
						dispatch(siteSlice.actions.login(result));
					}
					dispatch(siteSlice.actions.loginStepsAdvance());

					return new Promise<PlayFabClientModels.LoginResult>(resolve => resolve(result));
				})
				.then(result => {
					if (result.NewlyCreated) {
						return CloudScriptExecuteFunction({
							FunctionName: "PlayerCreated",
							GeneratePlayStreamEvent: true,
						});
					}
				})
				.then(() => postLoginFunctions())
				.then(() => {
					setIsLoading(false);
					navigate(routes.Explore());
				})
				.catch(problem => {
					dispatch(siteSlice.actions.loginStepsReset());
					onError(problem);
				})
				.finally(() => dispatch(siteSlice.actions.loginStepsReset()));
		},
		[ClientLoginWithGoogleAccount, CloudScriptExecuteFunction, dispatch, navigate, onError, postLoginFunctions]
	);

	useEffect(() => {
		// Google login
		try {
			const client = google.accounts.oauth2.initTokenClient({
				client_id: googleClientId,
				scope: "https://www.googleapis.com/auth/userinfo.profile",
				error_callback: problem => {
					switch (problem?.type) {
						case "popup_closed":
							// Do nothing
							break;
						default:
							console.error("Google account login error", problem);
							break;
					}
				},
				callback: tokenResponse => {
					loginWithGoogle(tokenResponse.access_token);
				},
			});

			setGoogleClient(client);
			setCanLoginWithGoogle(true);
		} catch(problem) {
			console.error("Google account login error", problem);
		}
	}, [loginWithGoogle]);

	const loginWithFacebook = useCallback(
		(accessToken: string) => {
			setIsLoading(true);
			setLoginMethodInProgress("facebook");

			dispatch(siteSlice.actions.loginSteps(loginEventCount));

			ClientLoginWithFacebook({ CreateAccount: true, AccessToken: accessToken })
				.then(result => {
					if (result.NewlyCreated) {
						dispatch(siteSlice.actions.register(result));
					} else {
						dispatch(siteSlice.actions.login(result));
					}
					dispatch(siteSlice.actions.loginStepsAdvance());

					return new Promise<PlayFabClientModels.LoginResult>(resolve => resolve(result));
				})
				.then(result => {
					if (result.NewlyCreated) {
						return CloudScriptExecuteFunction({
							FunctionName: "PlayerCreated",
							GeneratePlayStreamEvent: true,
						});
					}
				})
				.then(() => postLoginFunctions())
				.then(() => {
					setIsLoading(false);
					navigate(routes.Explore());
				})
				.catch(problem => {
					dispatch(siteSlice.actions.loginStepsReset());
					onError(problem);
				})
				.finally(() => dispatch(siteSlice.actions.loginStepsReset()));
		},
		[ClientLoginWithFacebook, CloudScriptExecuteFunction, dispatch, navigate, onError, postLoginFunctions]
	);

	const onLoginWithFacebook = useCallback(() => {
		FB.login(function (response) {
			if (is.null(response.authResponse)) {
				console.error("Problem authenticating via Facebook", response.status);
			} else {
				loginWithFacebook(response.authResponse.accessToken as string);
			}
		});
	}, [loginWithFacebook]);

	const loginWithMicrosoft = useCallback(
		(idToken: string, connectionId: string) => {
			setIsLoading(true);
			setLoginMethodInProgress("microsoft");

			dispatch(siteSlice.actions.loginSteps(loginEventCount));

			ClientLoginWithMicrosoftAccount({ CreateAccount: true, IdToken: idToken, ConnectionId: connectionId })
				.then(result => {
					if (result.NewlyCreated) {
						dispatch(siteSlice.actions.register(result));
					} else {
						dispatch(siteSlice.actions.login(result));
					}
					dispatch(siteSlice.actions.loginStepsAdvance());

					return new Promise<PlayFabClientModels.LoginResult>(resolve => resolve(result));
				})
				.then(result => {
					if (result.NewlyCreated) {
						return CloudScriptExecuteFunction({
							FunctionName: "PlayerCreated",
							GeneratePlayStreamEvent: true,
						});
					}
				})
				.then(() => postLoginFunctions())
				.then(() => {
					setIsLoading(false);
					navigate(routes.Explore());
				})
				.catch(problem => {
					dispatch(siteSlice.actions.loginStepsReset());
					onError(problem);
				})
				.finally(() => dispatch(siteSlice.actions.loginStepsReset()));
		},
		[ClientLoginWithMicrosoftAccount, CloudScriptExecuteFunction, dispatch, navigate, onError, postLoginFunctions]
	);

	const onLoginWithMicrosoft = useCallback(() => {
		instance
			.loginPopup({
				scopes: ["User.Read"],
			})
			.then(
				result => {
					// ConnectionId from the Settings > Connection screen in PlayFab
					if (is.microsoftEmail(result.account.username)) {
						loginWithMicrosoft(result.idToken, "Microsoft");
					} else {
						loginWithMicrosoft(result.idToken, "MicrosoftPersonal");
					}
				},
				problem => {
					dispatch(siteSlice.actions.loginStepsReset());
					onError(problem);
				}
			)
			.catch(console.error);
	}, [dispatch, instance, loginWithMicrosoft, onError]);

	return {
		data,
		isLoading,
		error,
		loginMethodInProgress,
		canLoginWithGoogle: canLoginWithGoogle && !is.null(googleClient),
		canLoginWithFacebook,
		canLoginWithMicrosoft,
		onChange,
		onClearErrors,
		onLogin,
		onRegister,
		onLoginWithGoogle,
		onLoginWithFacebook,
		onLoginWithMicrosoft,
	};
}

export function usePlayFabPostLoginData() {
	const {
		ClientGetUserData,
		ClientGetUserReadOnlyData,
		ClientGetTitleData,
		EconomySearchItems,
		EconomyGetInventoryItems,
	} = usePlayFab();
	const dispatch = useDispatch();

	const postLoginFunctions = useCallback(() => {
		const scripts = import.meta.glob("../data/*.json", { query: "raw" });

		const loadScripts = () => {
			for (const path in scripts) {
				scripts[path]().then(mod => {
					if (path.indexOf("locations.json") !== -1) {
						dispatch(siteSlice.actions.locations(JSON.parse((mod as any).default) as ILocalDataLocations));
					}
					if (path.indexOf("enemies.json") !== -1) {
						dispatch(siteSlice.actions.enemies(JSON.parse((mod as any).default) as ILocalDataEnemies));
					}
					if (path.indexOf("cinematics.json") !== -1) {
						dispatch(
							siteSlice.actions.cinematicData(JSON.parse((mod as any).default) as ILocalDataCinematics)
						);
					}
				});
			}
		};

		return new Promise<void>((resolve, reject) => {
			ClientGetTitleData({ Keys: TITLE_DATA_KEYS_ALL })
				.then(result => {
					dispatch(siteSlice.actions.titleData(result));
					dispatch(siteSlice.actions.loginStepsAdvance());
					loadScripts();
				})
				.then(() =>
					EconomySearchItems({
						Count: SEARCH_ITEMS_MAX_COUNT,
						Filter: "type eq 'currency' or type eq 'catalogItem'",
					})
				)
				.then(result => {
					dispatch(siteSlice.actions.catalog(result.Items));
					dispatch(siteSlice.actions.loginStepsAdvance());
				})
				.then(() => EconomyGetInventoryItems({ Count: SEARCH_ITEMS_MAX_COUNT }))
				.then(result => {
					dispatch(siteSlice.actions.inventory(result.Items));
					dispatch(siteSlice.actions.loginStepsAdvance());
				})
				.then(() => ClientGetUserData({ Keys: USER_DATA_KEYS_PLAYER_ALL }))
				.then(result => {
					dispatch(siteSlice.actions.userDataPlayer(result));
					dispatch(siteSlice.actions.loginStepsAdvance());
				})
				.then(() => ClientGetUserReadOnlyData({ Keys: USER_DATA_KEYS_READONLY_ALL }))
				.then(result => {
					dispatch(siteSlice.actions.userDataReadOnly(result));
					dispatch(siteSlice.actions.loginStepsAdvance());
				})
				.then(() => {
					resolve();
				})
				.catch(problem => {
					dispatch(siteSlice.actions.loginStepsReset());
					reject(problem);
				});
		});
	}, [
		dispatch,
		ClientGetTitleData,
		EconomySearchItems,
		EconomyGetInventoryItems,
		ClientGetUserData,
		ClientGetUserReadOnlyData,
	]);

	return {
		postLoginFunctions,
	};
}
