/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useIntl } from "react-intl";
import { combineClassNames } from "../../shared/helpers";
import { getPlayFabActivtiyStatusClassNames, getPlayFabActivtiyStatusTitle } from "./helpers";

interface IProps {
	isSuccessful?: boolean;
	className?: string;
}

export const PlayFabActivityStatus: React.FunctionComponent<IProps> = ({ isSuccessful, className }) => {
	const intl = useIntl();

	const statusTitle = getPlayFabActivtiyStatusTitle(intl, isSuccessful);
	const statusClassNames = getPlayFabActivtiyStatusClassNames(isSuccessful);

	return (
		<div className={combineClassNames("inline-block rounded-full p-1", statusClassNames[0])} title={statusTitle}>
			<div className={combineClassNames("h-1.5 w-1.5 rounded-full", statusClassNames[1], className!)} />
		</div>
	);
};
