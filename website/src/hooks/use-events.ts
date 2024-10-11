/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Dispatch } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { siteSlice } from "../redux/slice-site";
import { is } from "../shared/is";
import {
	CinematicEventButtonActionType,
	CinematicEventSpeaker,
	ICinematicEventButtonAction,
	SEARCH_ITEMS_MAX_COUNT,
} from "../shared/types";
import { ICloudScriptRequest, usePlayFab } from "./use-playfab";

interface IResults {
	onRunActions: (sequential?: boolean) => void;
}

export function useCinematicEventActions(actions: ICinematicEventButtonAction[]): IResults {
	const dispatch = useDispatch();
	const {
		setError,
		ClientGetUserReadOnlyData,
		CloudScriptExecuteFunction,
		ClientGetUserData,
		EconomyGetInventoryItems,
	} = usePlayFab();

	const onRunActions = useCallback(
		(sequential?: boolean) => {
			runCinematicEventActions(
				dispatch,
				actions,
				setError,
				ClientGetUserReadOnlyData,
				ClientGetUserData,
				CloudScriptExecuteFunction,
				EconomyGetInventoryItems,
				sequential
			);
		},
		[
			dispatch,
			actions,
			setError,
			ClientGetUserReadOnlyData,
			ClientGetUserData,
			CloudScriptExecuteFunction,
			EconomyGetInventoryItems,
		]
	);

	return {
		onRunActions,
	};
}

export function runCinematicEventActions(
	dispatch: Dispatch<any>,
	actions: ICinematicEventButtonAction[],
	setError: (error: PlayFabModule.IPlayFabError | undefined) => void,
	ClientGetUserReadOnlyData: (
		request: PlayFabClientModels.GetUserDataRequest
	) => Promise<PlayFabClientModels.GetUserDataResult>,
	ClientGetUserData: (
		request: PlayFabClientModels.GetUserDataRequest
	) => Promise<PlayFabClientModels.GetUserDataResult>,
	CloudScriptExecuteFunction: (
		request: ICloudScriptRequest
	) => Promise<PlayFabCloudScriptModels.ExecuteFunctionResult>,
	EconomyGetInventoryItems: (
		request: PlayFabEconomyModels.GetInventoryItemsRequest
	) => Promise<PlayFabEconomyModels.GetInventoryItemsResponse>,
	sequential = false
): Promise<any> {
	let result = Promise.resolve();

	if (sequential) {
		const allEventActions = actions.map(action => {
			if (is.array(action)) {
				return () => {
					(action as unknown as ICinematicEventButtonAction[]).forEach(subaction =>
						handleAction(
							dispatch,
							subaction,
							setError,
							ClientGetUserReadOnlyData,
							ClientGetUserData,
							CloudScriptExecuteFunction,
							EconomyGetInventoryItems
						)
					);
				};
			}

			return () =>
				handleAction(
					dispatch,
					action,
					setError,
					ClientGetUserReadOnlyData,
					ClientGetUserData,
					CloudScriptExecuteFunction,
					EconomyGetInventoryItems
				);
		});

		allEventActions.forEach(promiseLike => {
			result = result.then(promiseLike);
		});
	} else {
		actions.forEach(action =>
			handleAction(
				dispatch,
				action,
				setError,
				ClientGetUserReadOnlyData,
				ClientGetUserData,
				CloudScriptExecuteFunction,
				EconomyGetInventoryItems
			)
		);
	}
	return result;
}

function handleAction(
	dispatch: Dispatch<any>,
	action: ICinematicEventButtonAction,
	setError: (error: PlayFabModule.IPlayFabError | undefined) => void,
	ClientGetUserReadOnlyData: (
		request: PlayFabClientModels.GetUserDataRequest
	) => Promise<PlayFabClientModels.GetUserDataResult>,
	ClientGetUserData: (
		request: PlayFabClientModels.GetUserDataRequest
	) => Promise<PlayFabClientModels.GetUserDataResult>,
	CloudScriptExecuteFunction: (
		request: ICloudScriptRequest
	) => Promise<PlayFabCloudScriptModels.ExecuteFunctionResult>,
	EconomyGetInventoryItems: (
		request: PlayFabEconomyModels.GetInventoryItemsRequest
	) => Promise<PlayFabEconomyModels.GetInventoryItemsResponse>
): Promise<any> {
	return new Promise((resolve, reject) => {
		switch (action.type) {
			case CinematicEventButtonActionType.ChangeCinematic:
				resolve(dispatch(siteSlice.actions.exploreCinematicSet(action.value)));
				break;
			case CinematicEventButtonActionType.LocationAdd:
				resolve(dispatch(siteSlice.actions.exploreLocationAdd(action.value)));
				break;
			case CinematicEventButtonActionType.LocationRemove:
				resolve(dispatch(siteSlice.actions.exploreLocationRemove(action.value)));
				break;
			case CinematicEventButtonActionType.LocationSet:
				resolve(dispatch(siteSlice.actions.exploreLocationSet(action.value)));
				break;
			case CinematicEventButtonActionType.AreaSet:
				resolve(dispatch(siteSlice.actions.exploreAreaSet(action.value)));
				break;
			case CinematicEventButtonActionType.GetReadOnlyData:
				resolve(
					ClientGetUserReadOnlyData({ Keys: action.value.split(",") })
						.then(data => {
							dispatch(siteSlice.actions.userDataReadOnly(data));
							resolve(true);
						})
						.catch(problem => {
							setError(problem);
							reject(problem);
						})
				);
				break;
			case CinematicEventButtonActionType.GetWriteableData:
				resolve(
					ClientGetUserData({ Keys: action.value.split(",") })
						.then(data => dispatch(siteSlice.actions.userDataPlayer(data)))
						.catch(problem => {
							setError(problem);
							reject(problem);
						})
				);
				break;
			case CinematicEventButtonActionType.CloudScript:
				resolve(
					CloudScriptExecuteFunction({
						FunctionName: action.value as any,
						FunctionParameter: action.argument,
					}).catch(problem => {
						setError(problem);
						reject(problem);
					})
				);
				break;
			case CinematicEventButtonActionType.Delay:
				setTimeout(() => resolve(true), parseInt(action.value));
				break;
			case CinematicEventButtonActionType.GetInventory:
				resolve(
					EconomyGetInventoryItems({ Count: SEARCH_ITEMS_MAX_COUNT })
						.then(data => dispatch(siteSlice.actions.inventory(data.Items)))
						.catch(problem => {
							setError(problem);
							reject(problem);
						})
				);
				break;
			case CinematicEventButtonActionType.AddGuest:
				resolve(dispatch(siteSlice.actions.guestAdd(parseInt(action.value) as CinematicEventSpeaker)));
				break;
			case CinematicEventButtonActionType.RemoveGuest:
				resolve(dispatch(siteSlice.actions.guestRemove(parseInt(action.value) as CinematicEventSpeaker)));
				break;
			case CinematicEventButtonActionType.UpdateWriteableData:
				resolve(dispatch(siteSlice.actions.save()));
				break;
			case CinematicEventButtonActionType.CinematicProgressionClear:
				resolve(dispatch(siteSlice.actions.cinematicProgressionClear(action.value)));
				break;
			case CinematicEventButtonActionType.TheEnd:
				resolve(dispatch(siteSlice.actions.isTheEnd(true)));
				break;
			default:
				resolve(true);
				break;
		}
	});
}
