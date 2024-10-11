/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPlayerCharacterReadonlyComparison } from "../components/combat/helpers";
import { AppState } from "../redux/reducer";
import { siteSlice } from "../redux/slice-site";
import { IPlayerCharacterReadonlyComparison } from "../shared/types";

interface IResults {
	newInventory: PlayFabEconomyModels.CatalogItemReference[] | undefined;
	characters: IPlayerCharacterReadonlyComparison[];
	xp: number;
	onContinue: () => void;
}

export function useCombatResults(): IResults {
	const dispatch = useDispatch();
	const originalCharacters = useSelector((state: AppState) => state.site.combatSaveParty.characters);
	const combatResultsCharacters = useSelector((state: AppState) => state.site.combatStatus.results?.characters);
	const newInventory = useSelector((state: AppState) => state.site.combatStatus.results?.itemsGranted);
	const xp = useSelector((state: AppState) => state.site.combatEnemies).reduce((total, enemy) => total + enemy.xp, 0);

	const currentLocation = useSelector((state: AppState) => state.site.userDataPlayer.location.id);
	const currentArea = useSelector((state: AppState) => state.site.currentAreaId);
	const area = useSelector((state: AppState) => state.site.locations)
		.locations.find(l => l.id === currentLocation)
		?.areas.find(a => a.id === currentArea);

	const characters = useMemo<IPlayerCharacterReadonlyComparison[]>(
		() => getPlayerCharacterReadonlyComparison(originalCharacters, combatResultsCharacters),
		[combatResultsCharacters, originalCharacters]
	);

	const onContinue = useCallback(() => {
		dispatch(siteSlice.actions.combatVictory());

		dispatch(siteSlice.actions.exploreLocationAdd(area?.postCombatLocation));
		dispatch(siteSlice.actions.exploreLocationAdd(area?.postCombatArea));
		dispatch(siteSlice.actions.exploreLocationSet(area?.postCombatLocation));
		dispatch(siteSlice.actions.exploreAreaSet(area?.postCombatArea));
	}, [area, dispatch]);

	return {
		xp,
		characters,
		newInventory,
		onContinue,
	};
}
