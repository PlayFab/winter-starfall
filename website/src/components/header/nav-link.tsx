/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { combineClassNames } from "../../shared/helpers";
import { IHeaderNavigationRoute } from "../../shared/types";
import { WSLink } from "../link";

interface INavLinkProps {
	link: IHeaderNavigationRoute;
}

export const HeaderNavigationLink: React.FunctionComponent<INavLinkProps> = ({ link }) => (
	<WSLink
		to={link.link!}
		onClick={link.onClick}
		className={combineClassNames(
			"!text-gray-900",
			link.isActive ? "border-link" : "border-transparent hover:border-gray-300",
			"inline-flex items-center border-b-4 px-1 pt-1 text-sm font-medium hover:no-underline"
		)}
		aria-current={link.isActive ? "page" : undefined}>
		{link.text}
	</WSLink>
);
