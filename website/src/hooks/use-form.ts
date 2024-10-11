/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IDropdownOption } from "@fluentui/react";
import { useCallback, useState } from "react";
import { is } from "../shared/is";

export interface IFormHooks<TData> {
	data: TData;
	onChange: (event: string | React.FormEvent, value: any) => void;
}

export function useForm<TData>(template: TData): IFormHooks<TData> {
	const [formData, setFormData] = useState(template);

	const onChange = useCallback(
		(event: string | React.FormEvent, value: any) => {
			// Is this a custom event change?
			if (is.string(event)) {
				setFormData({
					...formData,
					[event as string]: value,
				});
				return;
			}

			const name = getEventTargetName(event as React.FormEvent);

			// Is this a dropdown event change?
			const valueAsDropdownOption = value as IDropdownOption;
			if (!is.null(valueAsDropdownOption?.key) && !is.null(valueAsDropdownOption?.text)) {
				setFormData({
					...formData,
					[name]: valueAsDropdownOption.key,
				});
				return;
			}

			// It's a normal text field change
			setFormData({
				...formData,
				[name]: value,
			});
		},
		[formData]
	);

	return {
		data: formData,
		onChange,
	};
}

function getEventTargetName(event: React.FormEvent): string {
	const element = event.target as HTMLInputElement;

	// Dropdown elements don't have names for some reason! So we use their ID.
	if (!is.null(element.name)) {
		return element.name;
	}

	return element.id;
}
