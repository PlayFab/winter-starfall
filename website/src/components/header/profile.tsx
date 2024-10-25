/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { DirectionalHint, IContextualMenuItem, IconButton } from "@fluentui/react";
import React from "react";
import { useIntl } from "react-intl";
import { usePopups } from "../../hooks/use-popups";
import Strings from "../../strings";

interface IProps {
	playerNavigation: IContextualMenuItem[];
}

const popup = "desktop";

export const HeaderProfileButton: React.FunctionComponent<IProps> = ({ playerNavigation }) => {
	const intl = useIntl();
	const { hide, show, isVisible } = usePopups();

	return (
		<IconButton
			iconProps={{
				iconName: "Contact",
			}}
			aria-label={intl.formatMessage({ id: Strings.player_profile })}
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
