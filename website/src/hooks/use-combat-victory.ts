/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayFabError } from "..";
import { AppState } from "../redux/reducer";
import { siteSlice } from "../redux/slice-site";
import { is } from "../shared/is";
import {
	CONSUMABLE_CONTENT_TYPE,
	ICloudScriptCombatVictoryItemsUsed,
	ICloudScriptCombatVictoryRequest,
	ILocationArea,
} from "../shared/types";
import { usePlayFab } from "./use-playfab";

interface IResults {
	area: ILocationArea | undefined;
	error: PlayFabError | undefined;
	isLoading: boolean;

	onRetry: () => void;
}

let hasRunVictoryCloudScript = false;

export function useCombatVictory(): IResults {
	const dispatch = useDispatch();
	const currentLocation = useSelector((state: AppState) => state.site.userDataPlayer.location.id);
	const currentArea = useSelector((state: AppState) => state.site.currentAreaId);
	const area = useSelector((state: AppState) => state.site.locations)
		.locations.find(l => l.id === currentLocation)
		?.areas.find(a => a.id === currentArea);

	const party = useSelector((state: AppState) => state.site.userDataReadOnly.party);
	const catalog = useSelector((state: AppState) => state.site.catalog);
	const inventory = useSelector((state: AppState) => state.site.inventory);
	const inventoryFromCombat = useSelector((state: AppState) => state.site.combatSaveInventory).filter(
		i => !is.null(catalog.find(c => c.Id === i.Id && c.ContentType === CONSUMABLE_CONTENT_TYPE))
	);
	const enemies = useSelector((state: AppState) => state.site.combatEnemies);
	const combatEnemyGroup = useSelector((state: AppState) => state.site.combatEnemyGroup);
	const enemyGroup = useSelector((state: AppState) => state.site.enemies.groups).find(g => g.id === combatEnemyGroup);

	const [isLoading, setIsLoading] = useState(true);
	const { error, setError, CloudScriptExecuteFunction } = usePlayFab();

	const itemsUsed = useMemo<ICloudScriptCombatVictoryItemsUsed>(
		() =>
			inventoryFromCombat
				.filter(
					i1 =>
						!is.null(inventory.find(i2 => i2.Id === i1.Id && i2.Amount !== i1.Amount)) ||
						is.null(inventory.find(i2 => i2.Id === i1.Id))
				)
				.reduce((obj, i1) => {
					if (!is.null(inventory.find(i2 => i2.Id === i1.Id && i2.Amount !== i1.Amount))) {
						obj[i1.Id!] = i1.Amount! - inventory.find(i2 => i2.Id === i1.Id)!.Amount!;
					} else {
						obj[i1.Id!] = i1.Amount!;
					}

					return obj;
				}, {} as ICloudScriptCombatVictoryItemsUsed),
		[inventory, inventoryFromCombat]
	);

	const onRetry = useCallback(() => {
		setIsLoading(true);

		CloudScriptExecuteFunction({
			FunctionName: "CombatVictory",
			FunctionParameter: {
				party,
				itemsUsed,
				xpEarned: enemies.reduce((total, enemy) => total + enemy.xp, 0),
				reward: enemyGroup?.reward,
			} as ICloudScriptCombatVictoryRequest,
		})
			.then(data => dispatch(siteSlice.actions.combatResults(data.FunctionResult)))
			.catch(setError)
			.finally(() => {
				setIsLoading(false);
				hasRunVictoryCloudScript = false;
			});
	}, [CloudScriptExecuteFunction, dispatch, enemies, enemyGroup?.reward, itemsUsed, party, setError]);

	useEffect(() => {
		if (hasRunVictoryCloudScript) {
			return;
		}

		hasRunVictoryCloudScript = true;

		onRetry();
	}, [onRetry]);

	return { area, isLoading, error, onRetry };
}
