/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { combineClassNames } from "../../shared/helpers";
import { ICinematic, IPropsChildren, IPropsChildrenClassName } from "../../shared/types";
import { DivCard } from "../tailwind";

interface ICinematicWrapperProps extends IPropsChildren {
	cinematic: ICinematic | undefined;
}

export const CinematicWrapper: React.FunctionComponent<ICinematicWrapperProps> = ({ children }) => {
	return <DivCard>{children}</DivCard>;
};

export const DivEventWrapper: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<div className={combineClassNames("p-4", className!)}>{children}</div>
);
