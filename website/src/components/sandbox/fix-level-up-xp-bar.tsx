/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useMemo } from "react";
import { IPlayerCharacterReadonlyComparison, IUserDataReadOnlyPlayerCharacter } from "../../shared/types";
import { getPlayerCharacterReadonlyComparison } from "../combat/helpers";
import { CombatResultCharacterList } from "../combat/results/character-list";

export const SandboxFixLevelUpXpBar: React.FunctionComponent = () => {
	const originalCharacters = useMemo<IUserDataReadOnlyPlayerCharacter[]>(
		() => [
			{
				id: 1,
				hp: 16,
				maxHP: 35,
				mp: 8,
				maxMP: 8,
				level: 1,
				xp: 30,
				attack: 1,
				defense: 1,
				available: false,
				xpToNextLevel: 100,
				xpToCurrentLevel: 0,
			},
			{
				id: 0,
				hp: 18,
				maxHP: 30,
				mp: 0,
				maxMP: 0,
				level: 1,
				xp: 75,
				attack: 2,
				defense: 1,
				available: true,
				xpToNextLevel: 100,
				xpToCurrentLevel: 0,
			},
			{
				id: 2,
				hp: 52,
				maxHP: 60,
				mp: 0,
				maxMP: 0,
				level: 2,
				xp: 225,
				attack: 3,
				defense: 2,
				available: true,
				xpToNextLevel: 300,
				xpToCurrentLevel: 100,
			},
		],
		[]
	);
	const combatResultsCharacters = useMemo<IUserDataReadOnlyPlayerCharacter[]>(
		() => [
			{
				id: 1,
				hp: 16,
				maxHP: 35,
				mp: 8,
				maxMP: 8,
				level: 1,
				xp: 30,
				attack: 1,
				defense: 1,
				available: false,
				xpToNextLevel: 100,
				xpToCurrentLevel: 0,
			},
			{
				id: 0,
				hp: 35,
				maxHP: 35,
				mp: 0,
				maxMP: 0,
				level: 2,
				xp: 175,
				attack: 3,
				defense: 2,
				available: true,
				xpToNextLevel: 300,
				xpToCurrentLevel: 100,
			},
			{
				id: 2,
				hp: 65,
				maxHP: 65,
				mp: 0,
				maxMP: 0,
				level: 3,
				xp: 325,
				attack: 4,
				defense: 3,
				available: true,
				xpToNextLevel: 900,
				xpToCurrentLevel: 300,
			},
		],
		[]
	);

	const characters = useMemo<IPlayerCharacterReadonlyComparison[]>(
		() => getPlayerCharacterReadonlyComparison(originalCharacters, combatResultsCharacters),
		[combatResultsCharacters, originalCharacters]
	);

	return (
		<div className="max-w-screen-sm">
			<CombatResultCharacterList characters={characters} />
		</div>
	);
};
