/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useCombatAnimations } from "../../hooks/use-combat-animations";
import { combineClassNames } from "../../shared/helpers";
import { CombatantType, ICombatGuest, ICombatant, IEnemy, PlayerCharacterCombat } from "../../shared/types";
import { ProgressBar } from "../progress-bar";
import { CombatCombatant } from "./combatant/combatant";
import { getEnemySpriteSizeClassNames } from "./helpers";

interface IProps {
	characters: PlayerCharacterCombat[];
	enemies: IEnemy[];
	guests: ICombatGuest[];

	isCombatantSelectable: (combatant: ICombatant) => boolean;
	onSelectCombatant: (combatant: ICombatant) => void;
}

export const CombatAnimations: React.FunctionComponent<IProps> = ({
	characters,
	enemies,
	guests,
	onSelectCombatant,
	isCombatantSelectable,
}) => {
	const { scope, spellEffectImageUri } = useCombatAnimations();

	return (
		<div ref={scope}>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<ul className="flex flex-wrap gap-6">
						{characters.map(c => (
							<li key={c.id} className="grow">
								<div className="w-24">
									<div id={`c-${c.id}`}>
										<CombatCombatant
											combatant={{ id: c.id, type: CombatantType.Character }}
											setSelectedTarget={onSelectCombatant}
											showCombatEffects
											isCombatantSelectable={isCombatantSelectable}
										/>
									</div>
									<div className="flex flex-wrap gap-1">
										<ProgressBar type="hp" value={c.hp} max={c.maxHP} className="basis-full" />
										<ProgressBar type="mp" value={c.mp} max={c.maxMP} className="basis-full" />
									</div>
								</div>
							</li>
						))}
						{guests.map(g => (
							<li key={g.id} className="grow">
								<div className="w-24">
									<div id={`g-${g.id}`}>
										<CombatCombatant
											combatant={{ id: g.id, type: CombatantType.Guest }}
											setSelectedTarget={onSelectCombatant}
											showCombatEffects
											isCombatantSelectable={isCombatantSelectable}
										/>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
				<div>
					<ul className="flex flex-wrap justify-end gap-4 sm:gap-6">
						{enemies.map(e => {
							return (
								<li key={e.uniqueId}>
									<div
										className={combineClassNames(
											"relative",
											getEnemySpriteSizeClassNames(e.size).width
										)}>
										<div id={`e-${e.uniqueId}`}>
											<CombatCombatant
												combatant={{ id: e.uniqueId as string, type: CombatantType.Enemy }}
												setSelectedTarget={onSelectCombatant}
												showCombatEffects
												isCombatantSelectable={isCombatantSelectable}
											/>
										</div>
										<ProgressBar
											type="hp"
											value={e.hp}
											max={e.maxHP}
											className="basis-full"
											showNumbers={false}
										/>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<img id="spell-effect" className="absolute left-0 top-0 h-16 w-16 opacity-0" src={spellEffectImageUri} />
		</div>
	);
};
