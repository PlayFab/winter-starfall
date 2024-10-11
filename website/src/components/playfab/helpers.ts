/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IntlShape } from "react-intl";
import { is } from "../../shared/is";
import Strings from "../../strings";

export function getPlayFabActivtiyStatusClassNames(isSuccessful?: boolean): string[] {
	if (is.null(isSuccessful)) {
		return ["bg-gray-500/20", "bg-gray-500"];
	}

	switch (isSuccessful) {
		case true:
			return ["bg-emerald-500/20", "bg-emerald-500"];
		case false:
		default:
			return ["bg-red-500/20", "bg-red-500"];
	}
}

export function getPlayFabActivtiyStatusTitle(intl: IntlShape, isSuccessful?: boolean): string {
	if (is.null(isSuccessful)) {
		return intl.formatMessage({ id: Strings.in_progress });
	}

	switch (isSuccessful) {
		case true:
			return intl.formatMessage({ id: Strings.successful });
		case false:
		default:
			return intl.formatMessage({ id: Strings.failed });
	}
}
