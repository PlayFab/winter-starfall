/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { FontIcon } from "@fluentui/react";
import React from "react";

interface IProps {
	icon: string;
	size?: number;
	className?: string;
	"aria-hidden"?: boolean;
}

export const WSIcon: React.FunctionComponent<IProps> = ({
	icon,
	className = "color-gray-900",
	size = 18,
	"aria-hidden": ariaHidden,
}) => {
	const sizeName = size + "px";
	return (
		<FontIcon
			className={className}
			iconName={icon}
			aria-hidden={ariaHidden}
			style={{ fontSize: sizeName, width: sizeName, height: sizeName }}
		/>
	);
};
