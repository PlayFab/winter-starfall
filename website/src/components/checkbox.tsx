/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ICheckboxProps } from "@fluentui/react";
import React, { useCallback } from "react";
import { combineClassNames } from "../shared/helpers";
import { is } from "../shared/is";
import { WSLabel } from "./label";

type Props = ICheckboxProps;

export const WSCheckbox: React.FunctionComponent<Props> = props => {
	const onChangeLocal = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			props.onChange!(e as React.FormEvent<HTMLInputElement>, !props.checked);
		},
		[props.checked, props.onChange]
	);

	const className = combineClassNames(
		"block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600 sm:text-sm sm:leading-6",
		props.disabled ? "bg-gray-100" : "",
		props.className!
	);

	const isChecked = props.checked ? true : false;

	return (
		<div className="flex items-center gap-2">
			<input
				type={"checkbox"}
				checked={isChecked}
				onChange={onChangeLocal}
				className={className}
				id={props.id}
				name={props.name}
				disabled={props.disabled}
			/>
			{!is.null(props.label) && <WSLabel htmlFor={props.id as string}>{props.label}</WSLabel>}
		</div>
	);
};
