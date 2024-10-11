/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedNumber, useIntl } from "react-intl";
import { combineClassNames } from "../../../shared/helpers";
import { CombatantTemporaryCombatEffect, ICombatantTemporaryCombatEffect } from "../../../shared/types";
import Strings from "../../../strings";
import { WSIcon } from "../../icon";

interface ICombatEffectListItemProps {
	effect: ICombatantTemporaryCombatEffect;
}

export const CombatEffectListItem: React.FunctionComponent<ICombatEffectListItemProps> = ({ effect }) => {
	const intl = useIntl();

	let icon = "";
	let number = 0;
	let className = "";
	let title = "";

	switch (effect.effect) {
		case CombatantTemporaryCombatEffect.poison:
			icon = "Drop";
			number = effect.duration;
			className = "bg-red-100 border-red-100";
			title = intl.formatMessage(
				{ id: Strings.effect_poison_title },
				{ value: effect.value, duration: effect.duration }
			);
			break;
		case CombatantTemporaryCombatEffect.defense:
		default:
			icon = "ShieldSolid";
			number = effect.duration;
			className = "bg-green-100 border-green-300";
			title = intl.formatMessage(
				{ id: Strings.effect_defense_title },
				{ value: effect.value, duration: effect.duration }
			);
			break;
	}

	return (
		<span
			className={combineClassNames(
				"flex gap-1 rounded-lg border border-gray-300 bg-white p-1 text-xs shadow",
				className
			)}
			title={title}
			aria-label={title}>
			<WSIcon icon={icon} size={12} />
			<FormattedNumber value={number} />
		</span>
	);
};
