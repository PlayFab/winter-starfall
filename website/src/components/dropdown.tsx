/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IDropdownProps } from "@fluentui/react";
import React, { useCallback } from "react";
import { combineClassNames } from "../shared/helpers";
import { is } from "../shared/is";
import { WSLabel } from "./label";

interface IProps extends Omit<IDropdownProps, "onChange"> {
	// Use a more normal onChange event
	onChange: (value: string) => void;
}

export const WSDropdown: React.FunctionComponent<IProps> = props => {
	const onChangeLocal = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			props.onChange(e.target.value);
		},
		[props]
	);

	const className = combineClassNames(
		"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6",
		props.disabled ? "bg-gray-100" : "",
		props.className!
	);

	return (
		<div>
			{!is.null(props.label) && <WSLabel htmlFor={props.id as string}>{props.label}</WSLabel>}
			<div className="mt-2">
				<select value={props.selectedKey as any} id={props.id} className={className} onChange={onChangeLocal}>
					{props.options?.map((option, index) => (
						<option key={index} value={option.key}>
							{option.text}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};
