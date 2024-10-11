/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback } from "react";
import { useLocationAreaCombat } from "../../hooks/use-combat";
import { is } from "../../shared/is";
import { CombatActionType, ILocationArea } from "../../shared/types";
import { CombatAnimations } from "./combat-animations";
import { CombatCommandBar } from "./commands/command-bar";
import { CombatDefeat } from "./defeat";
import { CombatItemPopup } from "./item-popup";
import { CombatResults } from "./results/results";
import { CombatSpellPopup } from "./spell-popup";
import { CombatTurnOrder } from "./turn-order";
import { CombatVictory } from "./victory";

interface IProps {
	area: ILocationArea;
}

export const ExploreLocationAreaCombat: React.FunctionComponent<IProps> = ({ area }) => {
	const {
		characters,
		enemies,
		guests,
		characterWhoseTurnItIs,
		selectedAction,
		selectedItem,
		selectedTarget,
		selectedSpell,
		isCombatOver,
		didPlayerWin,
		wasVictoryRecorded,
		setSelectedAction,
		setSelectedItem,
		setSelectedSpell,
		setSelectedTarget,
		isCombatantSelectable,
	} = useLocationAreaCombat(area);

	const onDismissPopup = useCallback(() => {
		setSelectedAction(CombatActionType.None);
	}, [setSelectedAction]);

	if (isCombatOver) {
		if (didPlayerWin) {
			if (wasVictoryRecorded) {
				return <CombatResults />;
			}
			return <CombatVictory />;
		} else {
			return <CombatDefeat />;
		}
	}

	return (
		<>
			<div>
				<CombatAnimations
					characters={characters}
					enemies={enemies}
					guests={guests}
					onSelectCombatant={setSelectedTarget}
					isCombatantSelectable={isCombatantSelectable}
				/>
				<div className="mt-4 border-t border-solid border-gray-300 py-4">
					<CombatTurnOrder />
				</div>
				<CombatCommandBar
					characterWhoseTurnItIs={characterWhoseTurnItIs}
					hasTakenTurn={!is.null(selectedTarget)}
					selectedAction={selectedAction}
					selectedItem={selectedItem}
					selectedSpell={selectedSpell}
					setSelectedAction={setSelectedAction}
				/>
				<CombatItemPopup
					isVisible={selectedAction === CombatActionType.Item && is.null(selectedItem)}
					onDismiss={onDismissPopup}
					onSelect={setSelectedItem}
				/>
				<CombatSpellPopup
					combatant={characterWhoseTurnItIs}
					isVisible={selectedAction === CombatActionType.Spell && is.null(selectedSpell)}
					onDismiss={onDismissPopup}
					onSelect={setSelectedSpell}
				/>
			</div>
		</>
	);
};
