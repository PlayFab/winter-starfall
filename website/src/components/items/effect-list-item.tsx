/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useIntl } from "react-intl";
import { combineClassNames } from "../../shared/helpers";
import { IEconomyEffect } from "../../shared/types";
import Strings from "../../strings";
import { WSIcon } from "../icon";

export const ItemEffectListItem: React.FunctionComponent<IEconomyEffect> = effect => {
	const intl = useIntl();
	let iconName = "";
	let iconClassName = "";
	let text = "";
	const valueString = intl.formatNumber(effect.value);

	switch (effect.type) {
		case "healing":
			iconName = "CircleAdditionSolid";
			iconClassName = "text-green-700";
			text = intl.formatMessage({ id: Strings.display_property_hp }, { value: valueString });
			break;
		case "damage":
			iconName = "FlameSolid";
			iconClassName = "text-gray-700";
			text = intl.formatMessage({ id: Strings.display_property_damage }, { value: valueString });
			break;
		case "defense":
			iconName = "ShieldSolid";
			iconClassName = "text-stone-600";
			text = intl.formatMessage({ id: Strings.display_property_defense }, { value: valueString });
			break;
		case "mp":
			iconName = "AutoEnhanceOn";
			iconClassName = "text-amber-700";
			text = intl.formatMessage({ id: Strings.display_property_mp }, { value: valueString });
			break;
		case "revive":
			iconName = "HealthSolid";
			iconClassName = "text-green-700";
			text = intl.formatMessage({ id: Strings.display_property_revive }, { value: valueString });
			break;
	}

	return (
		<span className={combineClassNames("flex items-center gap-1 text-sm font-semibold", iconClassName)}>
			<WSIcon icon={iconName} className={iconClassName} />
			{text}
		</span>
	);
};
