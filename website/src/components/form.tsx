/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback } from "react";
import { combineClassNames } from "../shared/helpers";

interface IProps {
	className?: string;
	children: React.ReactNode | React.ReactNode[];
	onSubmit: () => void;
}

export const WSForm: React.FunctionComponent<IProps> = props => {
	const className = combineClassNames("sm:w-full", props.className!);

	const onSubmitLocal = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			props.onSubmit();
		},
		[props]
	);

	return (
		<form onSubmit={onSubmitLocal} className={className}>
			{props.children}
		</form>
	);
};
