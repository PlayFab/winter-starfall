/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { combineClassNames } from "../shared/helpers";
import { is } from "../shared/is";
import { IPropsChildren, IPropsChildrenClassName, IPropsClassName } from "../shared/types";

export const DivCard: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<div className={combineClassNames("rounded-xl bg-white shadow ring-1 ring-gray-200", className!)}>{children}</div>
);

export const DivCardFooter: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<div className={combineClassNames("rounded-bl-xl rounded-br-xl bg-gray-100 px-4 py-2", className!)}>{children}</div>
);

export const UlCardFooterLinks: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<ul className={combineClassNames("flex justify-between gap-4", className!)}>{children}</ul>
);

export const H1Centered: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<h1 className={combineClassNames("text-center text-5xl font-light tracking-tight lg:text-7xl", className!)}>
		{children}
	</h1>
);

export const H2Centered: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<h2 className={combineClassNames("text-center font-light", className!)}>{children}</h2>
);

export const DivBottomBorder: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<div className={combineClassNames("border-b border-solid border-neutral-500", className!)}>{children}</div>
);

export const H1Left: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<h1 className={combineClassNames("mt-2 text-2xl font-bold sm:text-3xl sm:tracking-tight", className!)}>
		{children}
	</h1>
);

interface IH1LeftWithButtonProps extends IPropsChildrenClassName {
	button: React.ReactNode;
}

export const H1LeftWithButton: React.FunctionComponent<IH1LeftWithButtonProps> = ({ button, children, className }) => (
	<div className="flex w-full items-center">
		<h1
			className={combineClassNames(
				"mt-2 grow text-2xl font-bold text-gray-900 sm:text-3xl sm:tracking-tight",
				className!
			)}>
			{children}
		</h1>
		<span className="ml-4 mt-2">{button}</span>
	</div>
);

export const H1PopupTitle: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<h1 className={combineClassNames("grow text-xl font-semibold", className!)}>{children}</h1>
);

export const H2Left: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<h2
		className={combineClassNames(
			"mt-2 text-xl font-bold leading-7 text-gray-900 sm:text-2xl sm:tracking-tight",
			className!
		)}>
		{children}
	</h2>
);

export const H3Left: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<h3 className={combineClassNames("mt-6 text-lg font-semibold text-gray-900", className!)}>{children}</h3>
);

export const PSubtitle: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<p className={combineClassNames("mt-1 text-sm font-normal text-gray-700", className!)}>{children}</p>
);

export const PNone: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<p className={combineClassNames("italic text-gray-900", className!)}>{children}</p>
);

export const DivPageWrapper: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<div className={combineClassNames("mx-auto max-w-site p-4 sm:p-6 lg:p-8", className!)}>{children}</div>
);

export const UlGridOfImages: React.FunctionComponent<IPropsChildren> = ({ children }) => (
	<ul role="list" className="mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{children}
	</ul>
);

export const HeaderPopup: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<header
		className={combineClassNames(
			"flex items-center gap-x-2 border-b border-solid border-gray-300 p-4 leading-6",
			className!
		)}>
		{children}
	</header>
);

interface IUlGridProps extends IPropsChildrenClassName {
	columns: number;
}

export const UlGrid: React.FunctionComponent<IUlGridProps> = ({ columns, children, className }) => {
	let localClassName = "grid gap-6 grid-cols-1";

	switch (columns) {
		case 2:
			localClassName = combineClassNames(localClassName, "sm:grid-cols-2");
			break;
		case 3:
			localClassName = combineClassNames(localClassName, "sm:grid-cols-2 lg:grid-cols-3");
			break;
		case 4:
			localClassName = combineClassNames(localClassName, "sm:grid-cols-2 lg:grid-cols-4");
			break;
		case 5:
			localClassName = combineClassNames(localClassName, "sm:grid-cols-2 lg:grid-cols-5");
			break;
		case 6:
			localClassName = combineClassNames(localClassName, "sm:grid-cols-2 lg:grid-cols-6");
			break;
	}

	localClassName = combineClassNames(localClassName, className!);

	return <ul className={localClassName}>{children}</ul>;
};

interface ISectionProps extends IPropsChildrenClassName {
	description?: string;
	headerNodeLeft?: React.ReactNode;
	headerNodeRight?: React.ReactNode;
	showTitleUnderline?: boolean;
	title: string;
}

export const Section: React.FunctionComponent<ISectionProps> = ({
	children,
	className,
	description,
	headerNodeLeft,
	headerNodeRight,
	showTitleUnderline = true,
	title,
}) => (
	<section className={className}>
		<div className="overflow-hidden rounded-lg bg-white shadow">
			<div className={showTitleUnderline ? "divide-y divide-gray-200" : ""}>
				<div className="flex items-center gap-2 p-4">
					{!is.null(headerNodeLeft) && <div className="shrink-0">{headerNodeLeft}</div>}
					<div className="grow">
						<h2 className="text-lg font-medium text-gray-900">{title}</h2>
						{!is.null(description) && <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>}
					</div>
					{!is.null(headerNodeRight) && <div className="shrink-0">{headerNodeRight}</div>}
				</div>
				{!is.null(children) && <div className="p-4">{children}</div>}
			</div>
		</div>
	</section>
);

export const UlConfirmButtons: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<ul className={combineClassNames("flex items-center gap-4", className!)}>
		{is.array(children) ? (
			(children as React.ReactNode[]).map((child, index) => <li key={index}>{child}</li>)
		) : (
			<li className="grow">{children}</li>
		)}
	</ul>
);

interface IUlConfirmButtonsProgressProps extends IPropsClassName {
	submit: React.ReactNode;
	cancel: React.ReactNode;
	progress: React.ReactNode;
	isLoading: boolean;
}

export const UlConfirmButtonsProgress: React.FunctionComponent<IUlConfirmButtonsProgressProps> = ({
	submit,
	cancel,
	progress,
	isLoading,
	className,
}) => (
	<ul className={combineClassNames("flex items-center gap-4", className!)}>
		<li className="shrink-0">{submit}</li>
		{!isLoading ? <li className="shrink-0">{cancel}</li> : <li className="grow">{progress}</li>}
	</ul>
);

export const DivConfirmFooter: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<div className={combineClassNames("bg-gray-100 p-4", className!)}>{children}</div>
);

export const UlFormFields: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<ul className={combineClassNames("space-y-6", className!)}>{children}</ul>
);
