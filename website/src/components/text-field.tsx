/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ITextFieldProps } from "@fluentui/react";
import React, { useCallback } from "react";
import { combineClassNames } from "../shared/helpers";
import { is } from "../shared/is";
import { WSLabel } from "./label";

type Props = ITextFieldProps;

export const WSTextField: React.FunctionComponent<Props> = props => {
	const onChangeLocal = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			props.onChange!(e as React.FormEvent<HTMLInputElement>, e.target.value),
		[props.onChange]
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
				<input
					type={props.type || "text"}
					value={props.value || ""}
					onChange={onChangeLocal}
					className={className}
					id={props.id}
					autoFocus={props.autoFocus}
					autoComplete={props.autoComplete}
					onSubmit={props.onSubmit}
					name={props.name}
					disabled={props.disabled}
					width={props.width}
					minLength={props.minLength}
					maxLength={props.maxLength}
					placeholder={props.placeholder}
				/>
			</div>
		</div>
	);
};
