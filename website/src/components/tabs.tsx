/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { combineClassNames } from "../shared/helpers";
import { is } from "../shared/is";
import { IPropsClassName } from "../shared/types";
import Strings from "../strings";
import { WSLink } from "./link";

interface IWSTab {
	text: string;
	isCurrent: boolean;

	href?: string;
	onClick: () => void;
}

interface ITabProps extends IPropsClassName {
	tabs: IWSTab[];
}

export const WSTabs: React.FunctionComponent<ITabProps> = ({ tabs, className }) => {
	const navigate = useNavigate();

	const onSelect = useCallback(
		(event: React.SyntheticEvent<HTMLSelectElement>) => {
			const tabIndex = parseInt(event.currentTarget.value);
			const tab = tabs[tabIndex];

			if (is.null(tab.href)) {
				tab.onClick();
			} else {
				navigate(tab.href!);
			}
		},
		[navigate, tabs]
	);

	return (
		<div className={className}>
			<div className="sm:hidden">
				<label htmlFor="tabs" className="sr-only">
					<FormattedMessage id={Strings.select_a_tab} />
				</label>
				<select
					id="tabs"
					name="tabs"
					onChange={onSelect}
					value={tabs.findIndex(t => t.isCurrent)}
					className="block border-gray-300 focus:border-link rounded-md focus:ring-link w-full"
					defaultValue={tabs.find(tab => tab.isCurrent)?.href}>
					{tabs.map((tab, index) => (
						<option key={index} value={index}>
							{tab.text}
						</option>
					))}
				</select>
			</div>
			<div className="sm:block hidden">
				<div className="border-gray-300 border-b">
					<nav className="flex space-x-8 -mb-px" aria-label="Tabs">
						{tabs.map((tab, index) => (
							<WSLink
								key={index}
								to={tab.href as string}
								className={combineClassNames(
									tab.isCurrent
										? "border-link"
										: "border-transparent text-gray-500 hover:border-gray-400 hover:text-gray-700",
									"group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium"
								)}
								aria-current={tab.isCurrent ? "page" : undefined}
								onClick={tab.onClick}
								noHoverUnderline>
								<span>{tab.text}</span>
							</WSLink>
						))}
					</nav>
				</div>
			</div>
		</div>
	);
};
