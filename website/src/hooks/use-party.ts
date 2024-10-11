/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayFabError } from "..";
import { AppState } from "../redux/reducer";
import { siteSlice } from "../redux/slice-site";
import { getInventoryItemsOfContentType } from "../shared/helpers";
import { is } from "../shared/is";
import {
	ARMOR_CONTENT_TYPE,
	CONSUMABLE_CONTENT_TYPE,
	CURRENCY_TYPE,
	SPELL_CONTENT_TYPE,
	WEAPON_CONTENT_TYPE,
} from "../shared/types";
import { IFormHooks, useForm } from "./use-form";
import { usePlayFab } from "./use-playfab";

const oneMinute = 60 * 1000;

// Custom hook that updates the player's data on the server when it changes,
// but no more often that one minute.
export function useUpdatePlayerData() {
	const dispatch = useDispatch();

	const isLoggedIn = !is.null(useSelector((state: AppState) => state.site.playFabId));
	const writableData = useSelector((state: AppState) => state.site.userDataPlayer);
	const lastSavedPlayerData = useSelector((state: AppState) => state.site.lastSavedPlayerData);
	const forceSavePlayerData = useSelector((state: AppState) => state.site.forceSavePlayerData);
	const hasBeenLessThanOneMinute = new Date().getTime() - new Date(lastSavedPlayerData).getTime() < oneMinute;

	const [lastUserData, setLastUserData] = useState(writableData);
	const { ClientUpdateUserData, setError, isLoading } = usePlayFab();

	useEffect(() => {
		if (!forceSavePlayerData && (!isLoggedIn || isLoading || hasBeenLessThanOneMinute)) {
			return;
		}

		// Have any properties changed?
		const changedKeys = Object.keys(writableData)
			.filter(key => JSON.stringify((writableData as any)[key]) !== JSON.stringify((lastUserData as any)[key]))
			.filter(key => {
				switch (key) {
					case "location":
						// Don't blank out data on the server when the user signs out and back in
						if (is.null(writableData.location.id) && is.null(writableData.location.map)) {
							return false;
						}
						return true;
					case "party":
						// Don't let us update the server with the Redux slice's default stats
						if (writableData.party.characters.length === 0 || lastUserData.party.characters.length === 0) {
							return false;
						}
						return true;
					case "notifications":
						if (writableData.notifications.length === 0) {
							return false;
						}
						return true;
					default:
						return true;
				}
			});

		if (changedKeys.length === 0) {
			// Pretend we saved
			dispatch(siteSlice.actions.saveDone());
			return;
		}

		const updateData = changedKeys.reduce(
			(final, key) => {
				final[key] = JSON.stringify((writableData as any)[key]);
				return final;
			},
			{} as Record<string, string>
		);

		setLastUserData(writableData);

		ClientUpdateUserData({
			Data: updateData,
		})
			.then(() => dispatch(siteSlice.actions.saveDone()))
			.catch(setError);
	}, [
		ClientUpdateUserData,
		dispatch,
		forceSavePlayerData,
		hasBeenLessThanOneMinute,
		isLoading,
		isLoggedIn,
		lastUserData,
		setError,
		writableData,
	]);
}

interface IUsePartyInventorySpellsResults {
	items: PlayFabEconomyModels.InventoryItem[];
	weapons: PlayFabEconomyModels.InventoryItem[];
	armor: PlayFabEconomyModels.InventoryItem[];
	spells: PlayFabEconomyModels.InventoryItem[];
}

export function usePartyInventorySpells(): IUsePartyInventorySpellsResults {
	const catalog = useSelector((state: AppState) => state.site.catalog);
	const inventory = useSelector((state: AppState) => state.site.inventory).filter(
		item => item.Type !== CURRENCY_TYPE
	);
	const characters = useSelector((state: AppState) => state.site.userDataReadOnly.party.characters);
	const charactersWriteable = useSelector((state: AppState) => state.site.userDataPlayer.party.characters);
	const charactersWriteableUnavailable = characters
		.filter(c => !c.available)
		.map(c => charactersWriteable.find(w => w.id === c.id));

	const inventoryNotInUseByUnavilableCharacters = is.null(charactersWriteableUnavailable)
		? inventory
		: inventory
				.map<PlayFabEconomyModels.InventoryItem>(i => {
					// Remove one of this item if it's in weapon or armor of an unavailable character
					if (!is.null(charactersWriteableUnavailable.find(c => c?.armor === i.Id || c?.weapon === i.Id))) {
						return {
							...i,
							Amount: (i.Amount || 1) - 1,
						} as PlayFabEconomyModels.InventoryItem;
					}

					return i;
				})
				.filter(i => (i.Amount || 0) > 0);

	const items = useMemo(
		() => getInventoryItemsOfContentType(inventory, catalog, CONSUMABLE_CONTENT_TYPE),
		[catalog, inventory]
	);
	const weapons = useMemo(
		() => getInventoryItemsOfContentType(inventoryNotInUseByUnavilableCharacters, catalog, WEAPON_CONTENT_TYPE),
		[inventoryNotInUseByUnavilableCharacters, catalog]
	);
	const armor = useMemo(
		() => getInventoryItemsOfContentType(inventoryNotInUseByUnavilableCharacters, catalog, ARMOR_CONTENT_TYPE),
		[inventoryNotInUseByUnavilableCharacters, catalog]
	);

	const spells = useMemo(
		() => getInventoryItemsOfContentType(inventory, catalog, SPELL_CONTENT_TYPE),
		[catalog, inventory]
	);

	return {
		armor,
		items,
		spells,
		weapons,
	};
}

interface IDisplayNameForm {
	displayName: string;
}

interface IUsePartySettingsResults extends IFormHooks<IDisplayNameForm> {
	isLoading: boolean;
	hasLoaded: boolean;
	hasSaved: boolean;
	error: PlayFabError | undefined;

	onSubmit: () => void;
}

export function usePartySettings(): IUsePartySettingsResults {
	const [hasLoaded, setHasLoaded] = useState(false);
	const [hasSaved, setHasSaved] = useState(false);
	const { data, onChange } = useForm<IDisplayNameForm>({ displayName: "" });

	const { ClientGetPlayerProfile, ClientUpdateUserTitleDisplayName, isLoading, error, setError } = usePlayFab();

	const onSubmit = useCallback(() => {
		setHasSaved(false);

		ClientUpdateUserTitleDisplayName({
			DisplayName: data.displayName,
		})
			.then(() => setHasSaved(true))
			.catch(setError);
	}, [ClientUpdateUserTitleDisplayName, data.displayName, setError]);

	useEffect(() => {
		if (hasLoaded) {
			return;
		}

		ClientGetPlayerProfile({})
			.then(results => {
				onChange("displayName", results.PlayerProfile?.DisplayName);
			})
			.catch(setError)
			.finally(() => setHasLoaded(true));
	}, [ClientGetPlayerProfile, hasLoaded, onChange, setError]);

	useEffect(() => {
		if (!hasSaved) {
			return;
		}

		const timeout = setTimeout(() => {
			setHasSaved(false);
		}, 5000);

		return () => clearTimeout(timeout);
	}, [hasSaved]);

	return {
		data,
		error,
		hasLoaded,
		isLoading,
		hasSaved,
		onChange,
		onSubmit,
	};
}
