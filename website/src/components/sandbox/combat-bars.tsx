/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/reducer";
import { ANIMATION_TIME_WATCH_BAR_FILL, CombatantType } from "../../shared/types";
import { CombatCombatant } from "../combat/combatant/combatant";
import { ProgressBar } from "../progress-bar";

export const SandboxCombatBars: React.FunctionComponent = () => {
	const character = useSelector((state: AppState) => state.site.userDataPlayer.party.characters)[0];
	const [hp, setHp] = React.useState(25);

	useEffect(() => {
		const timeout = setTimeout(() => setHp(100), ANIMATION_TIME_WATCH_BAR_FILL);

		return () => clearTimeout(timeout);
	}, []);

	const nullFunction = useCallback(() => {
		// TODO: Nothing
	}, []);

	const falseFunction = useCallback(() => false, []);

	return (
		<div className="w-24">
			<div>
				<CombatCombatant
					combatant={{ id: character.id, type: CombatantType.Character }}
					setSelectedTarget={nullFunction}
					showCombatEffects
					isCombatantSelectable={falseFunction}
				/>
			</div>
			<div className="flex flex-wrap gap-1">
				<ProgressBar type="hp" value={hp} max={100} className="basis-full" />
				<ProgressBar type="mp" value={20} max={20} className="basis-full" />
			</div>
		</div>
	);
};
