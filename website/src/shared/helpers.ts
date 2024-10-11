/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IntlShape } from "react-intl";
import { PlayFabError } from "..";
import Strings from "../strings";
import { CombatItem } from "./combat-classes";
import { is } from "./is";
import {
	CinematicEventSpeaker,
	CombatValueMeaning,
	CombatantTemporaryCombatEffect,
	CombatantType,
	FRIENDLYID,
	ICombatGuest,
	ICombatant,
	ICombatantTemporaryCombatEffectGroup,
	IEnemy,
	IEnemyThreat,
	ILocationArea,
	IUserDataPlayerCinematicProgression,
	IUserDataPlayerParty,
	IUserDataPlayerPlayerCharacter,
	IUserDataReadOnlyParty,
	IUserDataReadOnlyPlayerCharacter,
	NEUTRAL,
	PartyCharacterEquipmentType,
	PlayerCharacterCombat,
} from "./types";

export function formatRoute(original: string, ...args: string[]): string {
	if (is.null(original)) {
		return "";
	}

	const replaceRegEx = new RegExp("((?::)[a-z?]+)");

	for (let i = 0; i < args.length; i++) {
		original = original.replace(replaceRegEx, args[i]);
	}

	return original;
}

export const availableLocales = ["en-us"];

export function validateLocale(locale: string): string {
	locale = locale.toLowerCase();

	if (availableLocales.indexOf(locale) === -1) {
		return availableLocales[0];
	}

	return locale;
}

export function isPlayFabResultSuccessful(result: PlayFabModule.IPlayFabResultCommon): boolean {
	let isSuccessful = result.code === 200 && is.null(result.error);

	// Cloud Script reports success here
	if (
		!is.null(
			((result as any).data as PlayFabCloudScriptModels.ExecuteCloudScriptResult)?.FunctionResult?.successful
		)
	) {
		isSuccessful = ((result as any).data as PlayFabCloudScriptModels.ExecuteCloudScriptResult)?.FunctionResult
			.successful;
	}

	return isSuccessful;
}

export function formatPlayFabNon200Error(result: PlayFabModule.IPlayFabResultCommon): PlayFabError {
	return {
		code: result.code,
		customData: result.customData,
		error: result.error,
		errorCode: result.errorCode,
		errorDetails: result.errorDetails,
		errorMessage: result.errorMessage,
		request: result.request,
		retryAfterSeconds: result.retryAfterSeconds,
		status: result.status,
	};
}

export function createPlayFabError(field?: string, message?: string): PlayFabError {
	if (is.null(field) && is.null(message)) {
		throw "Field and message may not both be null";
	}

	return {
		code: 0,
		error: field as string,
		errorCode: 0,
		errorMessage: message as string,
		status: "",
	};
}

export function getItemNeutralName(item: PlayFabEconomyModels.CatalogItem | undefined): string {
	const title = item?.Title;

	if (!title) {
		return "";
	}

	return title[NEUTRAL] || "";
}

export function getItemNeutralDescription(item: PlayFabEconomyModels.CatalogItem | undefined): string {
	const description = item?.Description;

	if (!description) {
		return "";
	}

	return description[NEUTRAL] || "";
}

export function getItemImageUrl(item: PlayFabEconomyModels.CatalogItem | undefined): string {
	if (!item) {
		return "";
	}

	return item?.Images?.find(i => !is.null(i.Url))?.Url || "";
}

export function getCatalogItemName(catalog: PlayFabEconomyModels.CatalogItem[], id: string | undefined): string {
	if (is.null(catalog) || is.null(id)) {
		return "";
	}

	const item = catalog.find(c => c.Id === id);

	if (is.null(item)) {
		return "";
	}

	return getItemNeutralName(item as PlayFabEconomyModels.CatalogItem);
}

export function combineClassNames(original: string, ...classNames: string[]): string {
	return (original + " " + classNames?.join(" ")).trim();
}

export function getStatisticName(intl: IntlShape, statisticName: string): string {
	switch (statisticName) {
		case "xp":
		default:
			return intl.formatMessage({ id: Strings.statistic_xp });
	}
}

type LocationImageModifier = "full" | "thumbnail";

export function getLocationImageUrl(name: string, modifier: LocationImageModifier = "full"): string {
	return new URL(`../static/locations/${name}-${modifier}.jpg`, import.meta.url).href;
}

type CharacterImageType = "portrait" | "combat";

export function getCharacterImageUrl(
	speaker: CinematicEventSpeaker | undefined,
	type: CharacterImageType = "portrait"
): string {
	let fileName = "";
	let extension = "jpg";

	switch (speaker) {
		case CinematicEventSpeaker.Sara:
			fileName = "sara";
			break;
		case CinematicEventSpeaker.Nadia:
			fileName = "nadia";
			break;
		case CinematicEventSpeaker.Warren:
			fileName = "warren";
			break;
		case CinematicEventSpeaker.Shazim:
			fileName = "shazim";
			break;
		case CinematicEventSpeaker.Lochan:
			fileName = "lochan";
			break;
		case CinematicEventSpeaker.Anais:
			fileName = "anais";
			break;
		case CinematicEventSpeaker.Ronald:
			fileName = "ronald";
			break;
		case CinematicEventSpeaker.GreenCityGateGuard:
			fileName = "green-city-guard";
			break;
	}

	if (is.null(fileName)) {
		return "";
	}

	switch (type) {
		case "portrait":
			// Do nothing
			break;
		case "combat":
			fileName += "-combat";
			extension = "png";
			break;
	}

	return new URL(`../static/characters/${fileName}.${extension}`, import.meta.url).href;
}

export function createCombatGuest(id: CinematicEventSpeaker): ICombatGuest {
	switch (id) {
		default:
			return {
				id,
				hp: 100,
				maxHP: 100,
				mp: 0,
				maxMP: 0,
				damage: 20,
				range: 0.2,
			};
	}
}

export function getCharacterName(speaker: CinematicEventSpeaker | undefined, intl: IntlShape): string {
	switch (speaker) {
		case CinematicEventSpeaker.Sara:
			return intl.formatMessage({ id: Strings.name_sara });
		case CinematicEventSpeaker.Nadia:
			return intl.formatMessage({ id: Strings.name_nadia });
		case CinematicEventSpeaker.Warren:
			return intl.formatMessage({ id: Strings.name_warren });
		case CinematicEventSpeaker.Shazim:
			return intl.formatMessage({ id: Strings.name_shazim });
		case CinematicEventSpeaker.Lochan:
			return intl.formatMessage({ id: Strings.name_lochan });
		case CinematicEventSpeaker.Anais:
			return intl.formatMessage({ id: Strings.name_anais });
		case CinematicEventSpeaker.Ronald:
			return intl.formatMessage({ id: Strings.name_ronald });
		case CinematicEventSpeaker.GreenCityGateGuard:
			return intl.formatMessage({ id: Strings.name_green_city_guard });
		default:
			return "";
	}
}

export function getCharacterEquipmentTags(
	speaker: CinematicEventSpeaker | undefined,
	type: PartyCharacterEquipmentType
): string[] {
	switch (type) {
		case "armor":
			switch (speaker) {
				case CinematicEventSpeaker.Sara:
				case CinematicEventSpeaker.Nadia:
					return ["armor-light"];
				default:
					return ["armor-heavy"];
			}
		case "weapon":
		default:
			switch (speaker) {
				case CinematicEventSpeaker.Sara:
					return ["fan", "knife"];
				case CinematicEventSpeaker.Nadia:
					return ["spear", "bow"];
				case CinematicEventSpeaker.Warren:
					return ["sword"];
				default:
					return [];
			}
	}
}

export function getEnemyImageUrl(name: string): string {
	return new URL(`../static/enemies/${name}.png`, import.meta.url).href;
}

export function getEventImageUrl(name: string): string {
	return new URL(`../static/events/${name}.jpg`, import.meta.url).href;
}

export function getSpellEffectImageUri(spellId: string, catalog: PlayFabEconomyModels.CatalogItem[]): string {
	return new URL(`../static/spells/${getFriendlyId(catalog.find(c => c.Id === spellId)!)}.png`, import.meta.url).href;
}

export function getFriendlyId(item: PlayFabEconomyModels.CatalogItem): string | undefined {
	return item.AlternateIds?.find(i => i.Type === FRIENDLYID)?.Value;
}

export function shuffleArray<T>(array: T[]): T[] {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex > 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}

export function clampNumber(min: number, max: number, value: number): number {
	return Math.min(max, Math.max(min, value));
}

export function randomNumber(min: number, max: number): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getInventoryItemsOfContentType(
	inventory: PlayFabEconomyModels.InventoryItem[],
	catalog: PlayFabEconomyModels.CatalogItem[],
	contentType: string
): PlayFabEconomyModels.InventoryItem[] {
	return inventory
		.map(i => catalog.find(c => c.Id === i.Id))
		.filter(i => i!.ContentType === contentType)
		.map(c => inventory.find(i => i.Id === c!.Id) as PlayFabEconomyModels.InventoryItem);
}

export function enemyAddThreat(enemy: IEnemy, damage: number, source: ICombatant): void {
	if (enemy.threat?.find(t => t.combatant.type === source.type && t.combatant.id === source.id)) {
		enemy.threat = enemy.threat.map(t => {
			if (t.combatant.type === source.type && t.combatant.id === source.id) {
				return {
					...t,
					threat: t.threat + damage,
				};
			}

			return t;
		});
	} else {
		enemy.threat?.push({ combatant: source, threat: damage });
	}
}

export function whoDoesGuestWantToAttack(enemies: IEnemy[]): ICombatant | undefined {
	// Pick the enemy with the lowest HP
	let target: ICombatant | undefined = undefined;
	let lowestHP = Number.MAX_SAFE_INTEGER;

	enemies.forEach(enemy => {
		if (enemy.hp < lowestHP && enemy.hp > 0) {
			target = {
				id: enemy.uniqueId!,
				type: CombatantType.Enemy,
			};
			lowestHP = enemy.hp;
		}
	});

	return target;
}

export function whoDoesEnemyWantToAttack(
	enemy: IEnemy | undefined,
	enemies: IEnemy[],
	characters: PlayerCharacterCombat[],
	guests: ICombatGuest[]
): ICombatant | undefined {
	let combatant: ICombatant | undefined = undefined;

	if (!enemy) {
		return combatant;
	}

	const availableCharacters = characters.filter(c => c.hp > 0 && c.available);
	const availableGuests = guests.filter(g => g.hp > 0);

	// Not mad at anyone yet? Pick someone at random.
	if (is.null(enemy.threat) || availableCharacters.length === 1) {
		// Let the enemy attack guests randomly too
		if (is.null(availableGuests)) {
			if (is.null(availableCharacters)) {
				return combatant;
			}
			combatant = {
				id: availableCharacters[randomNumber(0, availableCharacters.length - 1)].id,
				type: CombatantType.Character,
			};
		} else {
			switch (randomNumber(0, 1)) {
				case 0:
					combatant = {
						id: availableCharacters[randomNumber(0, availableCharacters.length - 1)].id,
						type: CombatantType.Character,
					};
					break;
				case 1:
					combatant = {
						id: availableGuests[randomNumber(0, availableGuests.length - 1)].id,
						type: CombatantType.Guest,
					};
					break;
			}
		}

		return combatant;
	}

	// If you do have some threat, use a weighted system to prefer combatants who have hit you before,
	// but keep it random so you might strike a less threatening target
	const totalThreat = (enemy.threat || []).reduce((total, t) => total + t.threat, 0);

	const threatArrayClone = (enemy.threat || []).map<IEnemyThreat>(t => ({
		combatant: t.combatant,
		threat: t.threat,
		weightedThreat: t.threat / totalThreat,
	}));

	threatArrayClone.sort((a, b) => b.weightedThreat! - a.weightedThreat!);

	let cumulativeProbability = 0;
	threatArrayClone.forEach(t => {
		cumulativeProbability += t.weightedThreat!;
		t.cumulativeThreat = cumulativeProbability;
	});

	const random = Math.random();
	let isTargetAlive = false;
	const maxAttempts = availableCharacters.length + availableGuests.length;
	let counter = 0;

	do {
		combatant = getThreatCombatant(random, threatArrayClone);

		switch (combatant.type) {
			case CombatantType.Character:
				isTargetAlive = !is.null(availableCharacters.find(c => c.id === combatant!.id));
				break;
			case CombatantType.Enemy:
				isTargetAlive = !is.null(enemies.find(e => e.uniqueId === combatant!.id && e.hp > 0));
				break;
			case CombatantType.Guest:
				isTargetAlive = !is.null(availableGuests.find(g => g.id === combatant!.id));
				break;
		}

		counter++;
	} while (!isTargetAlive && counter < maxAttempts);

	return combatant;
}

function getThreatCombatant(random: number, threat: IEnemyThreat[]): ICombatant {
	// Find the character whose cumulative probability encompasses the random number
	for (let i = 0; i < threat.length; i++) {
		if (random < threat[i].cumulativeThreat!) {
			return threat[i].combatant;
		}
	}

	// If nobody, return the first one
	return threat[0].combatant;
}

export function getItemMeaning(
	id: string,
	catalog: PlayFabEconomyModels.CatalogItem[],
	inventory: PlayFabEconomyModels.InventoryItem[]
): CombatValueMeaning[] {
	return new CombatItem(id, catalog, inventory).getMeanings();
}

export function isCombatantEqual(one: ICombatant | undefined, two: ICombatant | undefined): boolean {
	if (!one || !two) {
		return false;
	}

	return one.id === two.id && one.type === two.type;
}

export function createPlayerCharacterCombat(
	id: number,
	partyWriteable: IUserDataPlayerParty,
	partyReadOnly: IUserDataReadOnlyParty
): PlayerCharacterCombat {
	return {
		...partyWriteable.characters.find(c => c.id === id),
		...partyReadOnly.characters.find(c => c.id === id),
	} as PlayerCharacterCombat;
}

export function addDefendCombatEffect(
	actor: ICombatant,
	target: ICombatant,
	characters: IUserDataReadOnlyPlayerCharacter[],
	enemies: IEnemy[],
	combatCombatantEffects: ICombatantTemporaryCombatEffectGroup[]
): ICombatantTemporaryCombatEffectGroup[] {
	let hasAddedDefenseToTarget: boolean;
	let defenseEffectTurns = 2;
	let damage = 0;

	// If you're defending yourself, you get an extra turn because your current turn is about to end
	// and you'll be deducted one round
	if (isCombatantEqual(actor, target)) {
		defenseEffectTurns += 1;
	}

	// If you already have defense up, erase it and add half your max HP as your defense modifier
	switch (actor.type) {
		case CombatantType.Character:
			damage = Math.ceil((characters.find(c => c.id === actor.id)?.maxHP || 0) / 2);
			break;
		case CombatantType.Enemy:
			damage = Math.ceil((enemies.find(e => e.uniqueId === target.id)?.maxHP || 0) / 2);
			break;
	}

	hasAddedDefenseToTarget = false;

	combatCombatantEffects = combatCombatantEffects.map(c => {
		if (!isCombatantEqual(c.combatant, target)) {
			return c;
		}

		hasAddedDefenseToTarget = true;

		return {
			...c,
			effects: c.effects
				.filter(e => e.effect !== CombatantTemporaryCombatEffect.defense)
				.concat([
					{
						effect: CombatantTemporaryCombatEffect.defense,
						duration: defenseEffectTurns,
						value: damage,
					},
				]),
		};
	});

	if (!hasAddedDefenseToTarget) {
		combatCombatantEffects.push({
			combatant: target,
			effects: [
				{
					effect: CombatantTemporaryCombatEffect.defense,
					duration: defenseEffectTurns,
					value: damage,
				},
			],
		});
	}

	return combatCombatantEffects;
}

export function getCombatCharacters(
	charactersWriteable: IUserDataPlayerPlayerCharacter[],
	charactersReadOnly: IUserDataReadOnlyPlayerCharacter[]
): PlayerCharacterCombat[] {
	return charactersReadOnly.reduce((list, readonly) => {
		// Join these two sources of character data together
		if (!readonly.available) {
			return list;
		}

		const matching = charactersWriteable.find(c => c.id === readonly.id);

		return list.concat({
			...readonly,
			...matching,
		} as PlayerCharacterCombat);
	}, [] as PlayerCharacterCombat[]);
}

export function hasAreaBeenVisitedViaCinematicProgression(
	area: ILocationArea,
	cinematicProgression: IUserDataPlayerCinematicProgression[]
): boolean {
	if (is.null(cinematicProgression)) {
		return false;
	}

	return !is.null(cinematicProgression.find(p => !is.null(p.cinematics.find(c => c === area.id))));
}

export function editorFieldId(cinematicId: string, eventIndex: number, fieldName: string): string {
	return `cinematic${cinematicId}-event${eventIndex}-${fieldName}`;
}

// ----- Promises -----

function delayPromise(milliseconds: number, val: any) {
	return new Promise(resolve => setTimeout(resolve, milliseconds, val));
}

declare global {
	interface Promise<T> {
		delay: (milliseconds: number) => Promise<T>;
	}
}

Promise.prototype.delay = function (this: Promise<any>, milliseconds: number) {
	return this.then(function (val) {
		return delayPromise(milliseconds, val);
	});
};
