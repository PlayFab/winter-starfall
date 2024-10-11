/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useCombatResults } from "../../../hooks/use-combat-results";
import { AppState } from "../../../redux/reducer";
import { trackEvent } from "../../../shared/app-insights";
import Strings from "../../../strings";
import { WSButton } from "../../button";
import { H1Left, H2Left } from "../../tailwind";
import { CombatResultCharacterList } from "./character-list";
import { CombatResultInventory } from "./inventory";

export const CombatResults: React.FunctionComponent = () => {
	const intl = useIntl();
	const { characters, newInventory, onContinue, xp } = useCombatResults();
	const enemyGroup = useSelector((state: AppState) => state.site.combatEnemyGroup);

	const didEarnXP = xp > 0 && characters.some(c => c.after.hp > 0);

	useEffect(() => {
		window.scrollTo(0, 0);
		trackEvent({ name: "Combat Victory" }, { characters, newInventory, xp, enemyGroup });
	}, [characters, enemyGroup, newInventory, xp]);

	return (
		<>
			<H1Left>
				<FormattedMessage id={Strings.combat_victory} />
			</H1Left>

			<div className="my-4">
				{didEarnXP && (
					<H2Left>
						<FormattedMessage id={Strings.xp_earned} values={{ value: intl.formatNumber(xp) }} />
					</H2Left>
				)}
				<div className="my-4">
					<CombatResultCharacterList characters={characters} />
				</div>
				<div className="my-4">
					<CombatResultInventory newInventory={newInventory} />
				</div>
				<WSButton onClick={onContinue}>
					<FormattedMessage id={Strings.continue} />
				</WSButton>
			</div>
		</>
	);
};
