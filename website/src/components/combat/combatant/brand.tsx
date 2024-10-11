/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { combineClassNames } from "../../../shared/helpers";
import { is } from "../../../shared/is";

interface ICombatantBrandProps {
	brand: string;
	isDead: boolean;
}

export const CombatantBrand: React.FunctionComponent<ICombatantBrandProps> = ({ brand, isDead }) => {
	if (is.null(brand)) {
		return null;
	}

	return (
		<span
			className={combineClassNames(
				"absolute bottom-1 left-0 w-5 rounded-full border border-solid border-gray-600 bg-gray-300 text-center text-xs font-bold text-black",
				isDead ? "opacity-50" : ""
			)}>
			{brand}
		</span>
	);
};
