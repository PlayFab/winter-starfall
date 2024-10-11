/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IContextualMenuItem } from "@fluentui/react";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlayFabError } from "..";
import { AppState } from "../redux/reducer";
import { playfabSlice } from "../redux/slice-playfab";
import { siteSlice } from "../redux/slice-site";
import { routes } from "../router";
import { is } from "../shared/is";
import Strings from "../strings";
import { usePlayFab } from "./use-playfab";
import { usePopups } from "./use-popups";

interface IResults {
	canSeePartyTab: boolean;
	error: PlayFabError | undefined;
	isLoading: boolean;
	isResetPopupVisible: boolean;
	isTitleNewsPopupVisible: boolean;
	onHideResetPopup: () => void;
	onHideTitleNewsPopup: () => void;
	onResetPlayer: () => void;
	playerNavigation: IContextualMenuItem[];
	isPlayFabActivityVisible: boolean;
	setIsPlayFabActivityVisible: (isVisible: boolean) => void;
}

const reset = "reset";
const news = "news";

export function useHeader(): IResults {
	const intl = useIntl();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { show, hide, isVisible } = usePopups();
	const { CloudScriptExecuteFunction, isLoading, error, setError } = usePlayFab();

	const canSeePartyTab = !is.null(
		useSelector((state: AppState) => state.site.userDataReadOnly.completed.checkpoints)?.find(c => c === "party")
	);
	const isPlayFabActivityVisible = useSelector((state: AppState) => state.playfab.isVisible);
	const lastSaved = useSelector((state: AppState) => state.site.lastSavedPlayerData);
	const loginProgress = useSelector((state: AppState) => state.site.loginProgress);
	const playFabId = useSelector((state: AppState) => state.site.playFabId);
	const isInCombat = !is.null(useSelector((state: AppState) => state.site.combatSaveParty.characters));
	const [hasSaved, setHasSaved] = useState(false);
	const [counter, setCounter] = useState(0);

	const savedDate = useMemo(() => new Date(lastSaved), [lastSaved]);
	const hasSavedLessThanAMinuteAgo = new Date().getTime() - savedDate.getTime() < 1000 * 60;
	const isSignedIn = !is.null(playFabId) && is.null(loginProgress);
	const canSave = !isInCombat && isSignedIn && !hasSavedLessThanAMinuteAgo;

	const onClearPlayFabId = useCallback(() => {
		dispatch(siteSlice.actions.logout());
		dispatch(playfabSlice.actions.clearHistory());
		dispatch(playfabSlice.actions.isVisible(false));
		navigate(routes.Index());
	}, [dispatch, navigate]);

	const onResetPlayer = useCallback(() => {
		CloudScriptExecuteFunction({
			FunctionName: "ResetPlayer",
		})
			.then(() => CloudScriptExecuteFunction({ FunctionName: "PlayerCreated" }))
			.then(() => {
				onClearPlayFabId();
			})
			.catch(setError);
	}, [CloudScriptExecuteFunction, onClearPlayFabId, setError]);

	const onHideResetPopup = useCallback(() => {
		hide(reset);
	}, [hide]);

	const onHideTitleNewsPopup = useCallback(() => {
		hide(news);
	}, [hide]);

	const onSave = useCallback(() => {
		if (!canSave) {
			return;
		}

		dispatch(siteSlice.actions.save());
		setHasSaved(true);
	}, [canSave, dispatch]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setCounter(counter + 1);
		}, 1000);
		return () => clearTimeout(timeout);
	}, [counter]);

	useEffect(() => {
		if (!hasSaved) {
			return;
		}

		const timeout = setTimeout(() => {
			setHasSaved(false);
		}, 2000);

		return () => clearTimeout(timeout);
	}, [hasSaved]);

	let saveText = intl.formatMessage({ id: Strings.saved_time_ago }, { time: moment(savedDate).fromNow() });
	let saveIcon = "Save";
	let saveDisabled = false;

	if (hasSaved) {
		saveIcon = "Checkmark";
		saveDisabled = true;
	}

	if (!canSave) {
		saveText = intl.formatMessage({ id: Strings.saved_time_ago_disabled });
		saveDisabled = true;
	}

	if (isInCombat) {
		saveText = intl.formatMessage({ id: Strings.saved_time_ago_disabled_combat });
		saveDisabled = true;
	}

	const playerNavigation = useMemo<IContextualMenuItem[]>(() => {
		return [
			{
				key: "save-icon",
				text: saveText,
				iconProps: { iconName: saveIcon },
				disabled: saveDisabled,
				onClick: () => onSave(),
			},
			{
				key: "news",
				text: intl.formatMessage({ id: Strings.nav_news }),
				onClick: () => show(news),
				iconProps: { iconName: "News" },
			},
			{
				key: "reset",
				text: "Reset player",
				onClick: () => show(reset),
				iconProps: { iconName: "EraseTool" },
			},
			{
				key: "logout",
				text: intl.formatMessage({ id: Strings.logout }),
				onClick: () => onClearPlayFabId(),
				iconProps: { iconName: "SignOut" },
			},
		];
	}, [intl, onClearPlayFabId, onSave, saveDisabled, saveIcon, saveText, show]);

	const setIsPlayFabActivityVisible = useCallback(
		(isVisible: boolean) => {
			dispatch(playfabSlice.actions.isVisible(isVisible));
		},
		[dispatch]
	);

	return {
		canSeePartyTab,
		error,
		isLoading,
		isPlayFabActivityVisible,
		isResetPopupVisible: isVisible(reset),
		isTitleNewsPopupVisible: isVisible(news),
		onHideResetPopup,
		onHideTitleNewsPopup,
		onResetPlayer,
		playerNavigation,
		setIsPlayFabActivityVisible,
	};
}
