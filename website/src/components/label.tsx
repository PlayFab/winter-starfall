/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { combineClassNames } from "../shared/helpers";

interface IProps {
	htmlFor: string;
	className?: string;
	children?: React.ReactNode;
}

export const WSLabel: React.FunctionComponent<IProps> = props => {
	const className = combineClassNames("block text-sm font-medium leading-6 text-gray-900", props.className!);

	return (
		<label htmlFor={props.htmlFor} className={className}>
			{props.children}
		</label>
	);
};
