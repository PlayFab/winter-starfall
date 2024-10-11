/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/reducer";
import { is } from "../../shared/is";
import { CombatantType } from "../../shared/types";
import { WSIcon } from "../icon";
import { CombatCombatant } from "./combatant/combatant";

export const CombatTurnOrder: React.FunctionComponent = () => {
	const combatStatus = useSelector((state: AppState) => state.site.combatStatus);
	const enemies = useSelector((state: AppState) => state.site.combatEnemies);
	const guests = useSelector((state: AppState) => state.site.combatGuests);
	const characters = useSelector((state: AppState) => state.site.userDataReadOnly.party.characters);

	const livingCombatants = useMemo(
		() =>
			combatStatus.combatants.filter(combatant => {
				switch (combatant.type) {
					case CombatantType.Character:
						return characters.find(character => character.id === combatant.id)?.hp || 0 > 0;
					case CombatantType.Enemy:
						return enemies.find(enemy => enemy.uniqueId === combatant.id)?.hp || 0 > 0;
					case CombatantType.Guest:
						return guests.find(guest => guest.id === combatant.id)?.hp || 0 > 0;
					default:
						return true;
				}
			}),
		[characters, combatStatus.combatants, enemies, guests]
	);

	const nullFunction = useCallback(() => {
		// TODO: Nothing
	}, []);

	const falseFunction = useCallback(() => false, []);

	if (is.null(combatStatus)) {
		return null;
	}

	return (
		<div className="overflow-auto">
			<ol className="flex gap-4 max-w-full overflow-hidden">
				{livingCombatants.map((combatant, index) => {
					const isActive = combatStatus.combatants[combatStatus.active].id === combatant.id;

					return (
						<li key={index} className="relative flex shrink-0" id={`combatant${index}`}>
							<CombatCombatant
								showCombatEffects={false}
								combatant={combatant}
								setSelectedTarget={nullFunction}
								isCombatantSelectable={falseFunction}
								className="!w-10 !h-10"
							/>
							{isActive && (
								<WSIcon
									icon="CaretSolidUp"
									size={24}
									className="bottom-0 left-1/2 absolute -mb-1 -ml-2 text-black"
								/>
							)}
						</li>
					);
				})}
			</ol>
		</div>
	);
};
