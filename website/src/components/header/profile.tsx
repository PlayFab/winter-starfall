/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { DirectionalHint, IContextualMenuItem, IconButton } from "@fluentui/react";
import React from "react";
import { usePopups } from "../../hooks/use-popups";

interface IProps {
	playerNavigation: IContextualMenuItem[];
}

const popup = "desktop";

export const HeaderProfileButton: React.FunctionComponent<IProps> = ({ playerNavigation }) => {
	const { hide, show, isVisible } = usePopups();

	return (
		<IconButton
			iconProps={{
				iconName: "Contact",
			}}
			onClick={() => show(popup)}
			menuProps={{
				items: playerNavigation,
				directionalHint: DirectionalHint.topRightEdge,
				hidden: !isVisible(popup),
				onDismiss: () => hide(popup),
			}}
		/>
	);
};
