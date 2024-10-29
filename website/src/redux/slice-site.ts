/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CombatEconomyItem, CombatItem, CombatSpell, CombatantBase } from "../shared/combat-classes";
import {
	addDefendCombatEffect,
	createCombatGuest,
	createPlayerCharacterCombat,
	isCombatantEqual,
	shuffleArray,
	validateLocale,
} from "../shared/helpers";
import { is } from "../shared/is";
import {
	COMBAT_ANIMATION_TIME_ATTACKING,
	COMBAT_ANIMATION_TIME_SPELL,
	CinematicEventSpeaker,
	CombatActionType,
	CombatAnimatedEventType,
	CombatAnimationPerformance,
	CombatGroupTurnOrder,
	CombatValueMeaning,
	CombatantType,
	ICloudScriptCombatVictoryResult,
	ICombatAnimatedEvent,
	ICombatEvent,
	ICombatGuest,
	ICombatStatus,
	ICombatant,
	ICombatantTemporaryCombatEffect,
	ICombatantTemporaryCombatEffectGroup,
	IEnemy,
	IEquipAction,
	ILocalDataCinematics,
	ILocalDataEnemies,
	ILocalDataLocations,
	ILocationArea,
	IMultipliers,
	INotification,
	IUserDataPlayer,
	IUserDataReadOnly,
	IUserDataReadOnlyParty,
} from "../shared/types";

interface ISiteState {
	locale: string;
	titleId: string;
	cloud: string;

	playFabId: string;
	username: string;
	error: string;

	// Login
	loginProgress: boolean[];
	notifications: INotification[];

	// Player data
	locations: ILocalDataLocations;
	enemies: ILocalDataEnemies;
	catalog: PlayFabEconomyModels.CatalogItem[];
	inventory: PlayFabEconomyModels.InventoryItem[];
	statistics: PlayFabClientModels.StatisticValue[];
	userDataPlayer: IUserDataPlayer;
	userDataReadOnly: IUserDataReadOnly;
	multipliers: IMultipliers;
	stores: PlayFabEconomyModels.CatalogItem[];
	news: PlayFabClientModels.TitleNewsItem[];
	lastSavedPlayerData: number;
	forceSavePlayerData: boolean;

	// Combat
	combatEnemies: IEnemy[];
	combatEnemyGroup: string;
	combatEnemyGroupProgression: string;
	combatGuests: ICombatGuest[];
	combatStatus: ICombatStatus;
	combatHistory: ICombatEvent[];
	combatAnimations: ICombatAnimatedEvent[];
	combatSaveParty: IUserDataReadOnlyParty;
	combatSaveInventory: PlayFabEconomyModels.InventoryItem[];
	combatSaveGuests: ICombatGuest[];
	combatCombatantEffects: ICombatantTemporaryCombatEffectGroup[];

	// Cinematics
	currentAreaId: string;
	currentCinematic: string;
	cinematicData: ILocalDataCinematics;
	isTheEnd: boolean;

	// Cookies
	doesUserAcceptAnalytics: boolean;
}

const initialState: ISiteState = {
	locale: "en-us",
	cloud: "main",
	titleId: "F8941",

	playFabId: "",
	username: "",
	error: "",
	lastSavedPlayerData: new Date().getTime(),
	forceSavePlayerData: false,

	loginProgress: [],
	notifications: [],

	locations: {
		locations: [],
		map: [],
	},
	enemies: {
		enemies: [],
		groups: [],
		progressions: [],
	},
	catalog: [],
	inventory: [],
	statistics: [],
	stores: [],
	news: [],
	userDataPlayer: {
		location: {
			id: "",
			map: [],
		},
		party: {
			characters: [],
			guests: [],
		},
		notifications: [],
		cinematicProgression: [],
		enemyGroupProgression: [],
	},
	userDataReadOnly: {
		completed: {
			initialGrant: false,
			checkpoints: [],
		},
		party: {
			characters: [],
		},
	},
	multipliers: {
		sell: 1,
	},
	combatEnemies: [],
	combatGuests: [],
	combatEnemyGroup: "",
	combatEnemyGroupProgression: "",
	combatStatus: {
		canLose: false,
		isCombatOver: false,
		active: 0,
		combatants: [],
		results: undefined,
	},
	combatHistory: [],
	combatAnimations: [],
	combatSaveInventory: [],
	combatSaveGuests: [],
	combatCombatantEffects: [],
	combatSaveParty: {
		characters: [],
	},

	currentAreaId: "",
	currentCinematic: "",
	cinematicData: {
		progressions: [],
	},
	isTheEnd: false,
	doesUserAcceptAnalytics: false,
};

export const siteSlice = createSlice({
	name: "site",
	initialState,
	reducers: {
		locale(state, action: PayloadAction<string>) {
			state.locale = validateLocale(action.payload);
		},
		doesUserAcceptAnalytics(state, action: PayloadAction<boolean>) {
			state.doesUserAcceptAnalytics = action.payload;
		},
		titleId(state, action: PayloadAction<string>) {
			if (!is.null(action.payload)) {
				state.titleId = action.payload;
			}
		},
		titleIdClear(state) {
			state.titleId = initialState.titleId;
		},
		cloud(state, action: PayloadAction<string>) {
			state.cloud = action.payload;
		},
		loginSteps(state, action: PayloadAction<number>) {
			for (let i = 0; i < action.payload; i++) {
				state.loginProgress.push(false);
			}
		},
		loginStepsAdvance(state) {
			state.loginProgress[state.loginProgress.findIndex(p => !p)] = true;
		},
		loginStepsReset(state) {
			state.loginProgress = initialState.loginProgress;
		},
		register(state, action: PayloadAction<PlayFabClientModels.RegisterPlayFabUserResult>) {
			state.playFabId = action.payload.PlayFabId as string;
			state.username = action.payload.Username as string;
		},
		login(state, action: PayloadAction<PlayFabClientModels.LoginResult>) {
			state.playFabId = action.payload.PlayFabId as string;
			state.lastSavedPlayerData = new Date().getTime();
		},
		logout(state) {
			state.inventory = initialState.inventory;
			state.playFabId = initialState.playFabId;
			state.playFabId = initialState.playFabId;
			state.statistics = initialState.statistics;
			state.userDataPlayer = initialState.userDataPlayer;
			state.userDataReadOnly = initialState.userDataReadOnly;
			state.username = initialState.username;
			state.currentAreaId = initialState.currentAreaId;
			state.currentCinematic = initialState.currentCinematic;
			state.stores = initialState.stores;
			state.combatEnemies = initialState.combatEnemies;
			state.combatEnemyGroup = initialState.combatEnemyGroup;
			state.combatStatus = initialState.combatStatus;
			state.combatHistory = initialState.combatHistory;
			state.loginProgress = initialState.loginProgress;
			state.combatSaveInventory = initialState.combatSaveInventory;
			state.combatSaveParty = initialState.combatSaveParty;
			state.combatGuests = initialState.combatGuests;
			state.combatAnimations = initialState.combatAnimations;
			state.notifications = initialState.notifications;
			state.forceSavePlayerData = initialState.forceSavePlayerData;
			state.isTheEnd = initialState.isTheEnd;
		},
		notificationAdd(state, action: PayloadAction<INotification>) {
			state.notifications.push(action.payload);
			if (state.userDataPlayer.notifications.indexOf(action.payload.id) === -1) {
				state.userDataPlayer.notifications.push(action.payload.id);
			}
		},
		notificationRemove(state, action: PayloadAction<number>) {
			state.notifications = state.notifications.filter((_n, index) => index !== action.payload);
		},
		notificationReset(state) {
			state.notifications = initialState.notifications;
		},
		storeAdd(state, action: PayloadAction<PlayFabEconomyModels.CatalogItem>) {
			if (!is.null(state.stores.find(store => store.Id === action.payload.Id))) {
				// We already have this store
				state.stores = state.stores.map(store => {
					if (store.Id === action.payload.Id) {
						return action.payload;
					}

					return store;
				});
				return;
			}

			state.stores.push(action.payload);
		},
		displayName(state, action: PayloadAction<string>) {
			state.username = action.payload;
		},
		locations(state, action: PayloadAction<ILocalDataLocations>) {
			state.locations = action.payload;
		},
		enemies(state, action: PayloadAction<ILocalDataEnemies>) {
			state.enemies = action.payload;
		},
		cinematicData(state, action: PayloadAction<ILocalDataCinematics>) {
			state.cinematicData = action.payload;
		},
		titleData(state, action: PayloadAction<PlayFabClientModels.GetTitleDataResult>) {
			try {
				state.multipliers = JSON.parse(action.payload.Data?.multipliers as string);
				state.error = initialState.error;
			} catch {
				// Invalid JSON
				state.error = "Invalid JSON in title data";
			}
		},
		userDataPlayer(state, action: PayloadAction<PlayFabClientModels.GetUserDataResult>) {
			try {
				state.userDataPlayer.location = JSON.parse(action.payload.Data?.location.Value as string);
			} catch {
				// Invalid JSON
			}
			try {
				state.userDataPlayer.party = JSON.parse(action.payload.Data?.party.Value as string);
				state.userDataPlayer.party.characters.sort((a, b) => a.id - b.id);
			} catch {
				// Invalid JSON
			}
			try {
				state.userDataPlayer.notifications = JSON.parse(action.payload.Data?.notifications.Value as string);
			} catch {
				// Invalid JSON
			}
			try {
				state.userDataPlayer.cinematicProgression = JSON.parse(
					action.payload.Data?.cinematicProgression.Value as string
				);
			} catch {
				// Invalid JSON
			}
			try {
				state.userDataPlayer.enemyGroupProgression = JSON.parse(
					action.payload.Data?.enemyGroupProgression.Value as string
				);
			} catch {
				// Invalid JSON
			}
		},
		userDataReadOnly(state, action: PayloadAction<PlayFabClientModels.GetUserDataResult>) {
			try {
				state.userDataReadOnly.completed = JSON.parse(action.payload.Data?.completed.Value as string);
			} catch {
				// Invalid JSON
			}

			try {
				state.userDataReadOnly.party = JSON.parse(action.payload.Data?.party.Value as string);
				state.userDataReadOnly.party.characters.sort((a, b) => a.id - b.id);
			} catch {
				// Invalid JSON
			}
		},
		catalog(state, action: PayloadAction<PlayFabEconomyModels.CatalogItem[] | undefined>) {
			if (action.payload) {
				state.catalog = action.payload;
			}
		},
		inventory(state, action: PayloadAction<PlayFabEconomyModels.CatalogItem[] | undefined>) {
			if (action.payload) {
				state.inventory = action.payload;
			}
		},
		inventoryPurchase(state, action: PayloadAction<IAddInventoryAfterPurchasePayload>) {
			// Do we already have one of this item?
			if (is.null(state.inventory.find(i => i.Id === action.payload.item.Id))) {
				// We don't. Add one.
				state.inventory.push(action.payload.item);
			} else {
				// We do! Increment its amount.
				state.inventory = state.inventory.map(i => {
					if (i.Id === action.payload.item.Id) {
						return {
							...i,
							Amount: (i.Amount || 0) + (action.payload.item.Amount || 0),
						};
					}

					return i;
				});
			}

			// Subtract the price
			state.inventory = state.inventory
				.map(i => {
					// Did you use any of this item?
					if (is.null(action.payload.price.find(p => p.ItemId === i.Id))) {
						// You did not
						return i;
					} else {
						// You did! Subtract its amount
						return {
							...i,
							Amount: (i.Amount || 0) - (action.payload.price.find(p => p.ItemId === i.Id)?.Amount || 0),
						};
					}
				})
				.filter(i => (i.Amount || 0) > 0);

			state.forceSavePlayerData = true;
		},
		statistics(state, action: PayloadAction<PlayFabClientModels.StatisticValue[] | undefined>) {
			if (action.payload) {
				state.statistics = action.payload;
			}
		},
		exploreAreaSet(state, action: PayloadAction<string | undefined>) {
			state.currentAreaId = action.payload as string;
		},
		exploreAreaReset(state) {
			state.currentAreaId = initialState.currentAreaId;
		},
		exploreCinematicSet(state, action: PayloadAction<string | undefined>) {
			state.currentCinematic = action.payload || initialState.currentCinematic;
		},
		exploreLocationAdd(state, action: PayloadAction<string | undefined>) {
			// Don't add things twice
			if (state.userDataPlayer.location.map.find(m => m === action.payload)) {
				return;
			}

			state.userDataPlayer.location.map.push(action.payload as string);
		},
		exploreLocationRemove(state, action: PayloadAction<string>) {
			state.userDataPlayer.location.map = state.userDataPlayer.location.map.filter(m => m !== action.payload);
		},
		exploreLocationSet(state, action: PayloadAction<string | undefined>) {
			// Don't let you go somewhere to which you don't have access
			if (!state.userDataPlayer.location.map.find(m => m === action.payload)) {
				return;
			}

			state.userDataPlayer.location.id = action.payload as string;
		},
		combat(state, action: PayloadAction<ILocationArea>) {
			if (!is.null(state.combatHistory)) {
				return;
			}

			// Get the enemies
			let enemyGroupId = action.payload.enemyGroup || initialState.combatEnemyGroup;

			// Is there an enemy group progression? If so, load that set of enemies.
			if (!is.null(action.payload.enemyGroupProgression)) {
				state.combatEnemyGroupProgression = action.payload.enemyGroupProgression!;

				// Have you encountered this enemy group progression before?
				const userDataEnemyGroupProgression = state.userDataPlayer.enemyGroupProgression.find(
					p => p.id === action.payload.enemyGroupProgression
				);

				if (!is.null(userDataEnemyGroupProgression)) {
					// You have. Load the next set of enemies. But if you've already seen them all, load the last set again.
					if (
						userDataEnemyGroupProgression!.index >
						state.enemies.progressions.find(g => g.id === userDataEnemyGroupProgression!.id)!.groups
							.length -
							1
					) {
						enemyGroupId = state.enemies.progressions.find(g => g.id === userDataEnemyGroupProgression!.id)!
							.groups[userDataEnemyGroupProgression!.index - 1];
					} else {
						enemyGroupId = state.enemies.progressions.find(g => g.id === userDataEnemyGroupProgression!.id)!
							.groups[userDataEnemyGroupProgression!.index];
					}
				} else {
					enemyGroupId = state.enemies.progressions.find(g => g.id === action.payload.enemyGroupProgression!)!
						.groups[userDataEnemyGroupProgression?.index || 0];
				}
			}

			const enemyGroup = state.enemies.groups.find(g => g.id === enemyGroupId);

			if (is.null(enemyGroup)) {
				throw `Enemy group '${enemyGroupId}' not found`;
			}

			const enemyIds = enemyGroup?.enemies;
			const enemies = enemyIds
				?.map(id => state.enemies.enemies.find(e => e.id === id))
				.map((enemy, index) => ({
					...enemy,
					maxHP: enemy?.hp,
					uniqueId: (enemy?.id as string) + index,
					brand:
						enemyIds?.filter(e => e === enemy?.id).length > 1
							? (index + 10).toString(36).toUpperCase()
							: "",
					threat: [],
				})) as IEnemy[];

			const enemyCombatants = enemies.map<ICombatant>(e => ({
				type: CombatantType.Enemy,
				id: e.uniqueId as string,
			}));

			// Characters
			let characterCombatants = state.userDataReadOnly.party.characters
				.filter(c => c.available)
				.map<ICombatant>(c => ({ id: c.id, type: CombatantType.Character }));

			// Do you have any guests? If so they go after characters
			if (!is.null(state.userDataPlayer.party.guests)) {
				characterCombatants = characterCombatants.concat(
					state.userDataPlayer.party.guests.map<ICombatant>(g => ({
						id: g,
						type: CombatantType.Guest,
					}))
				);

				state.combatGuests = state.userDataPlayer.party.guests.map(g => createCombatGuest(g));
			}

			let combatants: ICombatant[] = [];

			switch (enemyGroup?.turnOrder) {
				case CombatGroupTurnOrder.PlayerFirst:
					combatants = characterCombatants.concat(enemyCombatants);
					break;
				case CombatGroupTurnOrder.EnemiesFirst:
					combatants = enemyCombatants.concat(characterCombatants);
					break;
				case CombatGroupTurnOrder.Random:
					combatants = shuffleArray(enemyCombatants.concat(characterCombatants));
					break;
			}

			state.combatSaveInventory = state.inventory;
			state.combatSaveParty = state.userDataReadOnly.party;
			state.combatSaveGuests = state.combatGuests;
			state.combatEnemies = enemies;
			state.combatEnemyGroup = enemyGroupId;
			state.combatStatus = {
				canLose: enemyGroup?.canLose || initialState.combatStatus.canLose,
				isCombatOver: initialState.combatStatus.isCombatOver,
				active: 0,
				combatants,
				results: initialState.combatStatus.results,
			};
			state.combatAnimations = initialState.combatAnimations;

			state.forceSavePlayerData = true;
		},
		combatAnimation(state, action: PayloadAction<ICombatEvent>) {
			if (!is.null(state.combatAnimations) || is.null(action.payload.destination)) {
				return;
			}

			const event: ICombatEvent = { ...action.payload };
			const animations: ICombatAnimatedEvent[] = [];

			switch (event.action) {
				case CombatActionType.Attack:
					animations.push({
						delay: 0,
						type: CombatAnimatedEventType.animation,
						actor: event.source,
						animation: CombatAnimationPerformance.attack,
						duration: COMBAT_ANIMATION_TIME_ATTACKING,
					});
					animations.push({
						delay: 0.5,
						type: CombatAnimatedEventType.animation,
						actor: event.destination,
						animation: CombatAnimationPerformance.damage,
						duration: COMBAT_ANIMATION_TIME_ATTACKING,
					});
					animations.push({
						delay: 0.75,
						type: CombatAnimatedEventType.dispatch,
						dispatch: siteSlice.actions.combatEvent(action.payload),
					});
					break;
				case CombatActionType.Spell:
					animations.push({
						delay: 0,
						type: CombatAnimatedEventType.animation,
						actor: event.source,
						animation: CombatAnimationPerformance.casting,
						duration: COMBAT_ANIMATION_TIME_ATTACKING,
					});
					animations.push({
						delay: 0.1,
						type: CombatAnimatedEventType.animation,
						actor: event.source,
						target: event.destination,
						animation: CombatAnimationPerformance.spell,
						duration: COMBAT_ANIMATION_TIME_SPELL,
						spellId: event.spell,
					});
					// This will need to change if it's a healing spell
					animations.push({
						delay: 0.1 + COMBAT_ANIMATION_TIME_SPELL,
						type: CombatAnimatedEventType.animation,
						actor: event.destination,
						animation: CombatAnimationPerformance.damage,
						duration: COMBAT_ANIMATION_TIME_ATTACKING,
					});
					animations.push({
						delay: 0.75,
						type: CombatAnimatedEventType.dispatch,
						dispatch: siteSlice.actions.combatEvent(action.payload),
					});
					break;
				case CombatActionType.Item:
					if (event.source.id === event.destination.id) {
						animations.push({
							delay: 0,
							type: CombatAnimatedEventType.animation,
							actor: event.source,
							animation: CombatAnimationPerformance.item,
							duration: COMBAT_ANIMATION_TIME_ATTACKING,
						});
					} else {
						animations.push({
							delay: 0,
							type: CombatAnimatedEventType.animation,
							actor: event.source,
							animation: CombatAnimationPerformance.item,
							duration: COMBAT_ANIMATION_TIME_ATTACKING,
						});
						animations.push({
							delay: 0.5,
							type: CombatAnimatedEventType.animation,
							actor: event.destination,
							animation: CombatAnimationPerformance.healing,
							duration: COMBAT_ANIMATION_TIME_ATTACKING,
						});
					}
					animations.push({
						delay: 0.75,
						type: CombatAnimatedEventType.dispatch,
						dispatch: siteSlice.actions.combatEvent(action.payload),
					});
					break;
				case CombatActionType.Defend:
					animations.push({
						delay: 0,
						type: CombatAnimatedEventType.animation,
						actor: event.source,
						animation: CombatAnimationPerformance.defend,
						duration: COMBAT_ANIMATION_TIME_ATTACKING,
					});
					animations.push({
						delay: 0.75,
						type: CombatAnimatedEventType.dispatch,
						dispatch: siteSlice.actions.combatEvent(action.payload),
					});
					break;
			}

			animations.push({
				delay: 2,
				type: CombatAnimatedEventType.finished,
			});

			state.combatAnimations = animations;
		},
		combatEvent(state, action: PayloadAction<ICombatEvent>) {
			const event: ICombatEvent = { ...action.payload, values: [] };
			event.date = new Date().getTime();

			let itemOrSpell: CombatEconomyItem;

			// Turn Redux state into something we can easily manage
			const combatantInstances = state.combatStatus.combatants.map<CombatantBase>(c => {
				switch (c.type) {
					case CombatantType.Character:
						return new CombatantBase(
							c,
							createPlayerCharacterCombat(
								c.id as number,
								state.userDataPlayer.party,
								state.userDataReadOnly.party
							),
							state.catalog
						);
					case CombatantType.Guest:
						return new CombatantBase(c, state.combatGuests.find(g => g.id === c.id)!, state.catalog);
					case CombatantType.Enemy:
						return new CombatantBase(c, state.combatEnemies.find(e => e.uniqueId === c.id)!, state.catalog);
					default:
						throw `Unknown combatant type: ${c.type}`;
				}
			});

			const actor = combatantInstances.find(c => c.isYou(event.source))!;
			const target = combatantInstances.find(c => c.isYou(event.destination))!;

			switch (event.action) {
				case CombatActionType.Attack:
					event.values = [
						{
							meaning: CombatValueMeaning.Damage,
							value: target.estimateValueFrom(
								{
									meaning: CombatValueMeaning.Damage,
									value: actor.getAttack(),
								},
								state.combatCombatantEffects
							),
						},
					];
					break;
				case CombatActionType.Spell:
				case CombatActionType.Item:
					switch (event.action) {
						case CombatActionType.Spell:
							itemOrSpell = new CombatSpell(event.spell, state.catalog);
							if (!actor.canCast(itemOrSpell as CombatSpell)) {
								return;
							}
							actor.castSpell(itemOrSpell as CombatSpell);
							break;
						case CombatActionType.Item:
							itemOrSpell = new CombatItem(event.item, state.catalog, state.inventory);
							if (!(itemOrSpell as CombatItem).canUse()) {
								return;
							}
							(itemOrSpell as CombatItem).use();
							break;
					}

					event.values = itemOrSpell
						.getMeanings()
						.filter(meaning => {
							switch (meaning) {
								case CombatValueMeaning.Healing:
									return target.canReceiveHealing();
								case CombatValueMeaning.Revive:
									return target.canBeRevived();
								default:
									return true;
							}
						})
						.map(meaning => ({
							meaning,
							value: itemOrSpell.getValue(meaning, target),
						}));
					break;
				case CombatActionType.Defend:
					state.combatCombatantEffects = addDefendCombatEffect(
						state.combatStatus.combatants[state.combatStatus.active],
						event.destination,
						state.userDataReadOnly.party.characters,
						state.combatEnemies,
						state.combatCombatantEffects
					);

					break;
			}

			event.values!.forEach(eventValue => {
				switch (eventValue.meaning) {
					case CombatValueMeaning.Healing:
						target.takeHealing(eventValue.value);
						break;
					case CombatValueMeaning.Revive:
						target.takeRevive(eventValue.value);
						break;
					case CombatValueMeaning.Damage:
						target.takeDamage(event.source, eventValue.value);
						break;
					default:
						// Nothing
						break;
				}
			});

			// Turn our easily managed state back to Redux store data
			state.userDataReadOnly.party.characters = state.userDataReadOnly.party.characters.map(c => {
				const match = combatantInstances.find(i => i.isYou({ id: c.id, type: CombatantType.Character }));

				if (is.null(match)) {
					return c;
				}

				return {
					...c,
					...match!.toReadOnlyCharacter(),
				};
			});

			state.combatEnemies = state.combatEnemies.map(e => {
				const match = combatantInstances.find(i => i.isYou({ id: e.uniqueId!, type: CombatantType.Enemy }))!;

				return {
					...e,
					...match.toEnemy(),
				};
			});

			// Did we use an item?
			state.inventory = state.inventory
				.map(i => {
					if (is.null(itemOrSpell) || !itemOrSpell.isYou(i.Id) || itemOrSpell.isSpell()) {
						return i;
					}

					return {
						...i,
						Amount: (i.Amount as number) - 1,
					};
				})
				.filter(i => (i.Amount as number) > 0);

			state.combatHistory.push(event);
		},
		combatItemUse(state, action: PayloadAction<IUseItemOnCharacterPayload>) {
			// Get our character
			const character = new CombatantBase(
				{
					id: action.payload.character,
					type: CombatantType.Character,
				},
				createPlayerCharacterCombat(
					action.payload.character,
					state.userDataPlayer.party,
					state.userDataReadOnly.party
				),
				state.catalog
			);

			// Use the item
			const item = new CombatItem(action.payload.itemId, state.catalog, state.inventory);
			if (!item.canUse()) {
				return;
			}

			item.use();

			item.getMeanings()
				.map(meaning => ({
					meaning,
					value: item.getValue(meaning, character),
				}))
				.forEach(eventValue => {
					switch (eventValue.meaning) {
						case CombatValueMeaning.Healing:
							if (character.canReceiveHealing()) {
								character.takeHealing(eventValue.value);
							}
							break;
						case CombatValueMeaning.Revive:
							if (character.canBeRevived()) {
								character.takeRevive(eventValue.value);
							}
							break;
						case CombatValueMeaning.Damage:
							character.takeDamage(undefined, eventValue.value);
							break;
						default:
							// Nothing
							break;
					}
				});

			// Write data back to characters
			state.userDataReadOnly.party.characters = state.userDataReadOnly.party.characters.map(c => {
				if (character.isYou({ id: c.id, type: CombatantType.Character })) {
					return {
						...c,
						...character.toReadOnlyCharacter(),
					};
				}

				return c;
			});

			// We definitely used an item
			state.inventory = state.inventory
				.map(i => {
					if (item.isYou(i.Id)) {
						return {
							...i,
							Amount: (i.Amount as number) - 1,
						};
					}

					return i;
				})
				.filter(i => (i.Amount as number) > 0);
		},
		combatAdvance(state) {
			let isCombatantDead = true;
			const lastActiveCombatant = state.combatStatus.active;

			// Figure out whose turn it is
			while (isCombatantDead) {
				state.combatStatus.active++;

				if (state.combatStatus.active >= state.combatStatus.combatants.length) {
					state.combatStatus.active = 0;
				}

				// Make sure whoever's turn it is hasn't been killed
				const activeEntity = state.combatStatus.combatants[state.combatStatus.active];

				switch (activeEntity.type) {
					case CombatantType.Character:
						isCombatantDead =
							(state.userDataReadOnly.party.characters.find(c => c.id === activeEntity.id)
								?.hp as number) <= 0;
						break;
					case CombatantType.Enemy:
						isCombatantDead =
							(state.combatEnemies.find(e => e.uniqueId === activeEntity.id)?.hp as number) <= 0;
						break;
					case CombatantType.Guest:
						isCombatantDead = (state.combatGuests.find(g => g.id === activeEntity.id)?.hp as number) <= 0;
						break;
				}
			}

			// Tick down all combatant effects by one (if it's their turn, hence that equality check).
			// If any are zero, remove them from the array.
			state.combatCombatantEffects = state.combatCombatantEffects
				.map(e => ({
					combatant: e.combatant,
					effects: e.effects
						.map<ICombatantTemporaryCombatEffect>(f => ({
							...f,
							duration: isCombatantEqual(state.combatStatus.combatants[lastActiveCombatant], e.combatant)
								? f.duration - 1
								: f.duration,
						}))
						.filter(f => f.duration > 0),
				}))
				.filter(e => e.effects.some(f => f.duration > 0));

			state.combatAnimations = initialState.combatAnimations;

			state.combatStatus.isCombatOver =
				state.userDataReadOnly.party.characters.filter(c => c.available).every(c => c.hp <= 0) ||
				state.combatEnemies.every(e => e.hp === 0);
		},
		combatVictory(state) {
			state.combatEnemies = initialState.combatEnemies;
			state.combatEnemyGroup = initialState.combatEnemyGroup;
			state.combatHistory = initialState.combatHistory;
			state.combatStatus = initialState.combatStatus;

			// Restore your MP
			state.userDataReadOnly.party.characters = state.userDataReadOnly.party.characters.map(c => ({
				...c,
				mp: c.maxMP,
			}));

			// If there was an enemy group progression in this area, log it.
			if (!is.null(state.combatEnemyGroupProgression)) {
				if (is.null(state.userDataPlayer.enemyGroupProgression)) {
					state.userDataPlayer.enemyGroupProgression = [];
					state.userDataPlayer.enemyGroupProgression = state.userDataPlayer.enemyGroupProgression.concat({
						id: state.combatEnemyGroupProgression,
						index: 1,
					});
				} else {
					state.userDataPlayer.enemyGroupProgression = state.userDataPlayer.enemyGroupProgression.map(p => {
						if (p.id === state.combatEnemyGroupProgression) {
							return {
								...p,
								index: p.index + 1,
							};
						}

						return p;
					});
				}
			}

			state.combatEnemyGroupProgression = initialState.combatEnemyGroupProgression;
			state.combatSaveInventory = initialState.combatSaveInventory;
			state.combatSaveParty = initialState.combatSaveParty;
			state.combatSaveGuests = initialState.combatSaveGuests;
			state.combatAnimations = initialState.combatAnimations;
			state.combatCombatantEffects = initialState.combatCombatantEffects;

			state.forceSavePlayerData = true;
		},
		combatVictoryAdvance(state) {
			state.combatHistory = initialState.combatHistory;
		},
		combatDefeat(state) {
			state.combatEnemies = initialState.combatEnemies;
			state.combatEnemyGroup = initialState.combatEnemyGroup;
			state.combatHistory = initialState.combatHistory;
			state.combatStatus = initialState.combatStatus;

			state.inventory = state.combatSaveInventory;
			state.userDataReadOnly.party = state.combatSaveParty;
			state.combatGuests = state.combatSaveGuests;
			state.combatAnimations = initialState.combatAnimations;
			state.combatCombatantEffects = initialState.combatCombatantEffects;
		},
		combatResults(state, action: PayloadAction<ICloudScriptCombatVictoryResult>) {
			state.combatStatus.results = action.payload;

			// Increase quantity of existing items
			state.inventory = state.inventory.map(i1 => {
				const matchingGrantedItem = action.payload.itemsGranted.find(i2 => i2.Id === i1.Id);
				if (is.null(matchingGrantedItem)) {
					return i1;
				}

				return {
					...i1,
					Amount: (i1.Amount as number) + (matchingGrantedItem?.Amount || 0),
				};
			});

			// Add new items
			state.inventory = state.inventory.concat(
				action.payload.itemsGranted
					.filter(i1 => is.null(state.inventory.find(i2 => i2.Id === i1.Id)))
					.map<PlayFabEconomyModels.InventoryItem>(i1 => ({
						Amount: i1.Amount,
						Id: i1.Id,
					}))
			);

			state.userDataReadOnly.party.characters = action.payload.characters;
		},
		characterEquip(state, action: PayloadAction<IEquipAction>) {
			switch (action.payload.type) {
				case "armor":
					state.userDataPlayer.party.characters.find(c => c.id === action.payload.id)!.armor =
						action.payload.itemId;
					break;
				case "weapon":
					state.userDataPlayer.party.characters.find(c => c.id === action.payload.id)!.weapon =
						action.payload.itemId;
					break;
			}
		},
		titleNews(state, action: PayloadAction<PlayFabClientModels.TitleNewsItem[] | undefined>) {
			if (is.null(action.payload)) {
				return;
			}

			state.news = action.payload!;
		},
		cinematicProgressionAdd(state, action: PayloadAction<IPlayerCinematicProgressionAdd>) {
			// Has the player been here before?
			if (!state.userDataPlayer.cinematicProgression.some(p => p.id === action.payload.cinematicId)) {
				// Nope
				state.userDataPlayer.cinematicProgression.push({
					id: action.payload.cinematicId,
					cinematics: [action.payload.areaId],
				});
			} else {
				// Yep
				state.userDataPlayer.cinematicProgression = state.userDataPlayer.cinematicProgression.map(
					cinematicProgression => {
						if (
							cinematicProgression.id === action.payload.cinematicId &&
							!cinematicProgression.cinematics.some(c => c === action.payload.areaId)
						) {
							return {
								...cinematicProgression,
								cinematics: cinematicProgression.cinematics.concat(action.payload.areaId),
							};
						}

						return cinematicProgression;
					}
				);
			}
		},
		cinematicProgressionClear(state, action: PayloadAction<string>) {
			state.userDataPlayer.cinematicProgression = state.userDataPlayer.cinematicProgression.filter(
				p => p.id !== action.payload
			);
		},
		guestAdd(state, action: PayloadAction<CinematicEventSpeaker>) {
			if (is.null(state.userDataPlayer.party.guests)) {
				state.userDataPlayer.party.guests = initialState.userDataPlayer.party.guests;
			}

			if (is.null(state.userDataPlayer.party.guests.find(g => g === action.payload))) {
				state.userDataPlayer.party.guests = state.userDataPlayer.party.guests.concat(action.payload);
			}

			state.forceSavePlayerData = true;
		},
		guestRemove(state, action: PayloadAction<CinematicEventSpeaker>) {
			if (is.null(state.userDataPlayer.party.guests)) {
				state.userDataPlayer.party.guests = initialState.userDataPlayer.party.guests;
			}

			state.userDataPlayer.party.guests = state.userDataPlayer.party.guests.filter(g => g !== action.payload);
			state.forceSavePlayerData = true;
		},
		saveDone(state) {
			state.lastSavedPlayerData = new Date().getTime();
			state.forceSavePlayerData = false;
		},
		save(state) {
			state.forceSavePlayerData = true;
		},
		isTheEnd(state, action: PayloadAction<boolean>) {
			state.isTheEnd = action.payload;
		},
	},
});

interface IAddInventoryAfterPurchasePayload {
	item: Partial<PlayFabEconomyModels.InventoryItem>;
	price: PlayFabEconomyModels.PurchasePriceAmount[];
}

interface IUseItemOnCharacterPayload {
	character: number;
	itemId: string;
}

interface IPlayerCinematicProgressionAdd {
	cinematicId: string;
	areaId: string;
}
