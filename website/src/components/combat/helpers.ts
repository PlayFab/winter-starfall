/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IntlShape } from "react-intl";
import { getCharacterName } from "../../shared/helpers";
import { is } from "../../shared/is";
import {
	CombatActionType,
	CombatantType,
	EnemySpriteSize,
	ICombatEvent,
	ICombatant,
	IEnemy,
	IPlayerCharacterReadonlyComparison,
	IUserDataReadOnlyPlayerCharacter,
	UserDataReadOnlyCompletedCheckpoints,
} from "../../shared/types";
import Strings from "../../strings";

export function getCharacterActionOptions(
	id: number,
	checkpoints: UserDataReadOnlyCompletedCheckpoints[]
): CombatActionType[] {
	switch (id) {
		case 0: // Sara
			if (checkpoints.includes("sara-magic")) {
				return [0, 1, 3];
			}
			return [0, 1];
		case 1: // Nadia
			return [0, 1, 3];
		default:
			return [0, 2, 1];
	}
}

export function getCharacterActionName(action: CombatActionType, intl: IntlShape): string {
	switch (action) {
		case CombatActionType.Attack:
			return intl.formatMessage({ id: Strings.combat_action_attack });
		case CombatActionType.Item:
			return intl.formatMessage({ id: Strings.combat_action_item });
		case CombatActionType.Defend:
			return intl.formatMessage({ id: Strings.combat_action_defend });
		case CombatActionType.Spell:
			return intl.formatMessage({ id: Strings.combat_action_spell });
		default:
			return "";
	}
}

export function getCombatantName(combatant: ICombatant, enemies: IEnemy[], intl: IntlShape): string {
	let enemy: IEnemy | undefined;

	switch (combatant.type) {
		case CombatantType.Character:
			return getCharacterName(combatant.id as number, intl);
		case CombatantType.Enemy:
			enemy = enemies.find(e => e.uniqueId === combatant.id);
			return (enemy?.name + " " + enemy?.brand).trimEnd() || "";
		default:
			return intl.formatMessage({ id: Strings.error_unknown });
	}
}

export function getCombatantDestinationName(event: ICombatEvent, enemies: IEnemy[], intl: IntlShape): string {
	if (event.source.type === event.destination.type) {
		if (event.source.type === CombatantType.Character) {
			switch (event.destination.id as number) {
				case 0:
				case 1:
					return intl.formatMessage({ id: Strings.combat_event_herself });
				default:
					return intl.formatMessage({ id: Strings.combat_event_himself });
			}
		}

		return intl.formatMessage({ id: Strings.combat_event_itself });
	}

	return getCombatantName(event.destination, enemies, intl);
}

export interface IEnemySpriteSize {
	width: string;
	height: string;
}

export function getEnemySpriteSizeClassNames(size: EnemySpriteSize): IEnemySpriteSize {
	switch (size) {
		case EnemySpriteSize.Medium:
			return { width: "w-48 sm:w-52", height: "h-48 sm:h-52" };
		case EnemySpriteSize.Small:
		default:
			return { width: "w-20 sm:w-24", height: "h-20 sm:h-24" };
	}
}

export function getPlayerCharacterReadonlyComparison(
	originalCharacters: IUserDataReadOnlyPlayerCharacter[],
	combatResultsCharacters: IUserDataReadOnlyPlayerCharacter[] | undefined
): IPlayerCharacterReadonlyComparison[] {
	return originalCharacters
		.filter(c1 => !is.null(combatResultsCharacters?.find(c2 => c1.id === c2.id && c1.available)))
		.map<IPlayerCharacterReadonlyComparison>(before => {
			let after = combatResultsCharacters!.find(c => before.id === c.id)!;

			if (after.level > before.level) {
				after = {
					...after,
					xpToCurrentLevel: before.xpToCurrentLevel,
					xpToNextLevel: before.xpToNextLevel,
				};
			} else {
				// Don't animate HP bars if you didn't level up
				after = {
					...after,
					hp: before.hp,
				};
			}

			return {
				before,
				after,
			};
		});
}
