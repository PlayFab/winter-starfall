/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { Link } from "react-router-dom";
import { combineClassNames } from "../shared/helpers";
import { is } from "../shared/is";

export type HyperlinkTarget = "_blank" | "_parent" | "_self" | "_top" | undefined;
type HyerlinkAriaCurrent = boolean | "false" | "true" | "page" | "step" | "location" | "date" | "time" | undefined;

export interface IWSLink {
	text?: string;
	children?: React.ReactNode;
	to: string;
	isExternal?: boolean;
	title?: string;
	"aria-label"?: string;
	"aria-current"?: HyerlinkAriaCurrent;
	className?: string;
	target?: HyperlinkTarget;
	noHoverUnderline?: boolean;
	onClick?: (e: React.SyntheticEvent<any>) => void;
}

export const WSLink: React.FunctionComponent<IWSLink> = ({
	text,
	children,
	to,
	"aria-label": ariaLabel,
	"aria-current": ariaCurrent,
	isExternal,
	title,
	className,
	noHoverUnderline,
	target,
	onClick,
}) => {
	const styleClasses = "text-link";

	const localClassName = combineClassNames(
		"whitespace-nowrap font-semibold",
		styleClasses,
		noHoverUnderline ? "" : "hover:underline",
		className!
	);

	const linkText = is.null(children) ? <>{text}</> : children;

	if (isExternal) {
		return (
			<a
				href={to}
				aria-label={ariaLabel}
				aria-current={ariaCurrent}
				title={title}
				className={localClassName}
				target={target}
				onClick={onClick}>
				{linkText}
			</a>
		);
	}

	return (
		<Link
			to={to}
			aria-label={ariaLabel}
			aria-current={ariaCurrent}
			title={title}
			className={localClassName}
			target={target}
			onClick={onClick}>
			{linkText}
		</Link>
	);
};
