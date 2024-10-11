/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/reducer";
import { siteSlice } from "../../redux/slice-site";
import { trackEvent } from "../../shared/app-insights";
import Strings from "../../strings";
import { WSButton } from "../button";
import { H1Left } from "../tailwind";

export const CombatDefeat: React.FunctionComponent = () => {
	const dispatch = useDispatch();
	const enemyGroup = useSelector((state: AppState) => state.site.combatEnemyGroup);

	const onTryAgain = useCallback(() => {
		dispatch(siteSlice.actions.combatDefeat());
		dispatch(siteSlice.actions.exploreAreaReset());
	}, [dispatch]);

	useEffect(() => {
		window.scrollTo(0, 0);
		trackEvent({ name: "Combat Defeat" }, { enemyGroup });
	}, [enemyGroup]);

	return (
		<>
			<H1Left>
				<FormattedMessage id={Strings.combat_defeat} />
			</H1Left>
			<div className="my-4">
				<WSButton onClick={onTryAgain}>
					<FormattedMessage id={Strings.try_again} />
				</WSButton>
			</div>
		</>
	);
};
