/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../redux/reducer";
import { siteSlice } from "../redux/slice-site";
import { is } from "../shared/is";
import {
	CinematicEventButtonActionType,
	CinematicEventSpeaker,
	CinematicEventType,
	ICinematic,
	ICinematicEventButton,
} from "../shared/types";
import { runCinematicEventActions } from "./use-events";
import { usePlayFab } from "./use-playfab";

interface IResults {
	isLoading: boolean;
	cinematic: ICinematic | undefined;
	canSkipCinematic: boolean;

	onSkipCinematic: () => void;
}

// Cinematics are skippable if they have a button with one action that points to the next cinematic
function isCinematicSkippable(cinematic: ICinematic | undefined): boolean {
	return (
		cinematic?.events?.some(
			event =>
				event.type === CinematicEventType.Button &&
				(event as ICinematicEventButton).actions.every(
					action => action.type === CinematicEventButtonActionType.ChangeCinematic
				)
		) || false
	);
}

export function useCinematic(fileName: string, cinematicId: string): IResults {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(true);
	const [cinematics, setCinematics] = useState<ICinematic[]>([]);

	// START Watch conditions
	const fishingStoreContents = useSelector((state: AppState) => state.site.stores).find(s =>
		s.AlternateIds?.find(a => a.Value === "fishing-store")
	)?.ItemReferences;
	const playerInventoryItemIds = useSelector((state: AppState) => state.site.inventory).map(i => i.Id);
	const fishingStoreBuySomething = fishingStoreContents?.some(f => is.inArray(playerInventoryItemIds, f.Id));
	const didNadiaSurviveLastBattle = !is.null(
		useSelector((state: AppState) => state.site.userDataReadOnly.party.characters).find(
			c => c.id === CinematicEventSpeaker.Nadia && c.hp > 0
		)
	);
	const hasRescuedEveryoneFromWesternSongForest = useSelector((state: AppState) =>
		[
			CinematicEventSpeaker.Anais,
			CinematicEventSpeaker.Lochan,
			CinematicEventSpeaker.Ronald,
			CinematicEventSpeaker.Shazim,
		].every(guest => state.site.userDataPlayer.party.guests?.includes(guest))
	);
	// END Watch conditions

	const {
		setError,
		ClientGetUserReadOnlyData,
		CloudScriptExecuteFunction,
		ClientGetUserData,
		EconomyGetInventoryItems,
	} = usePlayFab();

	useEffect(() => {
		const scripts = import.meta.glob("../scripts/*.json", { query: "raw" });

		if (is.null(fileName)) {
			return;
		}

		for (const path in scripts) {
			scripts[path]().then(mod => {
				if (path.indexOf(`/${fileName}.json`) !== -1) {
					setCinematics(JSON.parse((mod as any).default) as ICinematic[]);
					setIsLoading(false);
					return;
				}
			});
		}
	}, [cinematicId, fileName]);

	const cinematic = cinematics?.find(c => c.id === cinematicId);

	const canSkipCinematic = useMemo(() => {
		if (cinematicId === "intro-village-1") {
			return false;
		}

		if (!isCinematicSkippable(cinematic)) {
			return false;
		}

		return true;
	}, [cinematic, cinematicId]);

	const onSkipCinematic = useCallback(() => {
		let canSkip = true;
		let nextCinematicId: string | undefined = cinematicId;

		while (canSkip) {
			const nextCinematic = cinematics?.find(c => c.id === nextCinematicId);

			canSkip = isCinematicSkippable(nextCinematic);

			if (!canSkip) {
				break;
			}

			// Get the next cinematic id from the "value" property of that event action
			nextCinematicId = (
				nextCinematic?.events.find(e => e.type === CinematicEventType.Button) as ICinematicEventButton
			)?.actions.find(action => action.type === CinematicEventButtonActionType.ChangeCinematic)?.value;

			if (is.null(nextCinematicId)) {
				throw new Error(`Could not find the next cinematic id from ID ${nextCinematic?.id}`);
			}
		}

		dispatch(siteSlice.actions.exploreCinematicSet(nextCinematicId));
	}, [cinematicId, cinematics, dispatch]);

	useEffect(() => {
		if (is.null(cinematic?.watch)) {
			return;
		}

		cinematic?.watch?.forEach(watch => {
			switch (watch.condition) {
				case "fishingStoreBuySomething":
					if (fishingStoreBuySomething) {
						runCinematicEventActions(
							dispatch,
							watch.actions,
							setError,
							ClientGetUserReadOnlyData,
							ClientGetUserData,
							CloudScriptExecuteFunction,
							EconomyGetInventoryItems
						);
					}
					break;
				case "hasRescuedEveryoneFromWesternSongForest":
					if (hasRescuedEveryoneFromWesternSongForest) {
						runCinematicEventActions(
							dispatch,
							watch.actions,
							setError,
							ClientGetUserReadOnlyData,
							ClientGetUserData,
							CloudScriptExecuteFunction,
							EconomyGetInventoryItems
						);
					} else {
						runCinematicEventActions(
							dispatch,
							watch.failure!,
							setError,
							ClientGetUserReadOnlyData,
							ClientGetUserData,
							CloudScriptExecuteFunction,
							EconomyGetInventoryItems
						);
					}
					break;
				case "didNadiaSurviveLastBattle":
					if (didNadiaSurviveLastBattle) {
						runCinematicEventActions(
							dispatch,
							watch.actions,
							setError,
							ClientGetUserReadOnlyData,
							ClientGetUserData,
							CloudScriptExecuteFunction,
							EconomyGetInventoryItems
						);
					} else {
						runCinematicEventActions(
							dispatch,
							watch.failure!,
							setError,
							ClientGetUserReadOnlyData,
							ClientGetUserData,
							CloudScriptExecuteFunction,
							EconomyGetInventoryItems
						);
					}
					break;
			}
		});
	}, [
		ClientGetUserData,
		ClientGetUserReadOnlyData,
		CloudScriptExecuteFunction,
		EconomyGetInventoryItems,
		cinematic?.watch,
		didNadiaSurviveLastBattle,
		dispatch,
		fishingStoreBuySomething,
		hasRescuedEveryoneFromWesternSongForest,
		setError,
	]);

	return {
		isLoading,
		cinematic,
		canSkipCinematic,
		onSkipCinematic,
	};
}
