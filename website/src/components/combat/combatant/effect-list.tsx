/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/reducer";
import { isCombatantEqual } from "../../../shared/helpers";
import { is } from "../../../shared/is";
import { ICombatant } from "../../../shared/types";
import { CombatEffectListItem } from "./effect-list-item";

interface ICombatantEffectListProps {
	combatant: ICombatant;
	showCombatEffects: boolean;
}

export const CombatantEffectList: React.FunctionComponent<ICombatantEffectListProps> = ({
	combatant,
	showCombatEffects,
}) => {
	const effects = useSelector((state: AppState) => state.site.combatCombatantEffects).find(e =>
		isCombatantEqual(e.combatant, combatant)
	)?.effects;

	if (!showCombatEffects || is.null(effects)) {
		return null;
	}

	return (
		<ul className="absolute bottom-1 right-0.5 flex gap-2">
			{effects?.map((effect, index) => (
				<li key={index}>
					<CombatEffectListItem effect={effect} />
				</li>
			))}
		</ul>
	);
};
