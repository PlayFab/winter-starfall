/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { combineClassNames } from "../shared/helpers";
import { Loading } from "./loading";

export type WSButtonStyle = "normal" | "normal-big" | "light" | "light-big" | "link" | "icon";

interface IProps {
	type?: "submit" | "reset" | "button";
	style?: WSButtonStyle;
	className?: string;
	disabled?: boolean;
	isLoading?: boolean;
	title?: string;
	id?: string;
	"aria-label"?: string;
	children: React.ReactNode;

	onClick: () => void;
	onFocus?: () => void;
	onBlur?: () => void;
}

export const WSButton: React.FunctionComponent<IProps> = ({
	style = "normal",
	type = "button",
	className = "",
	disabled = false,
	title,
	"aria-label": ariaLabel,
	onClick,
	onFocus,
	onBlur,
	id,
	isLoading,
	children,
}) => {
	let styleClasses = "";

	switch (style) {
		case "light":
			styleClasses =
				"shadow shadow-gray-300 px-3.5 py-2 bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50";
			break;
		case "light-big":
			styleClasses =
				"shadow shadow-gray-300 px-6 py-3 bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50";
			break;
		case "normal":
			styleClasses =
				"shadow shadow-gray-300 px-3.5 py-2 bg-gradient-to-b from-link-light to-link hover:bg-link text-white focus-visible:outline-link";
			break;
		case "normal-big":
			styleClasses =
				"shadow shadow-gray-300 px-6 py-3 bg-gradient-to-b from-link-light to-link hover:bg-link text-white focus-visible:outline-link";
			break;
		case "link":
			styleClasses = "rounded-none shadow-none text-link no-underline hover:underline";
			break;
		case "icon":
			styleClasses = "rounded-none shadow-none";
			break;
	}

	let classNameLocal = combineClassNames(
		"rounded-md font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
		styleClasses,
		className!
	);

	if (disabled) {
		switch (style) {
			case "link":
				classNameLocal = combineClassNames(classNameLocal, "pointer-events-none !text-gray-900");
				break;
			default:
				classNameLocal = combineClassNames(
					classNameLocal,
					"pointer-events-none !bg-none !bg-gray-200 !text-gray-700"
				);
				break;
		}
	}

	return (
		<button
			type={type}
			onClick={onClick}
			className={classNameLocal}
			disabled={disabled}
			title={title}
			aria-label={ariaLabel}
			onFocus={onFocus}
			onBlur={onBlur}
			id={id}>
			<WSButtonContents isLoading={isLoading}>{children}</WSButtonContents>
		</button>
	);
};

interface IWSButtonContentsProps {
	isLoading?: boolean;
	children: React.ReactNode;
}

const WSButtonContents: React.FunctionComponent<IWSButtonContentsProps> = ({ children, isLoading }) => {
	if (isLoading) {
		return <Loading isLoading={isLoading} className="!w-6 !h-6" />;
	}

	return children;
};
