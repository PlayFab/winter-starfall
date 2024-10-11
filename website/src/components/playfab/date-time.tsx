/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedDate, FormattedTime } from "react-intl";
import { combineClassNames } from "../../shared/helpers";
import { IPropsClassName } from "../../shared/types";

interface IProps extends IPropsClassName {
	date: number;
	showDate?: boolean;
}

export const PlayFabActivityDateTime: React.FunctionComponent<IProps> = ({ date, className, showDate }) => (
	<time
		dateTime={date.toLocaleString()}
		className={combineClassNames("whitespace-nowrap text-xs leading-6 text-gray-500", className!)}>
		{showDate && (
			<span className="mr-2">
				<FormattedDate value={date} />
			</span>
		)}
		<FormattedTime value={date} />
	</time>
);
