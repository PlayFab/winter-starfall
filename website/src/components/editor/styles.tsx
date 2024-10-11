/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { combineClassNames } from "../../shared/helpers";
import { IPropsChildrenClassName } from "../../shared/types";

export const EditorMainList: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<ul className={combineClassNames("grid grid-cols-1 gap-6", className!)}>{children}</ul>
);

export const EditorMainListItem: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<li className={combineClassNames("border-t border-t-border py-4 first:border-t-0", className!)}>{children}</li>
);

export const EditorFormFieldList: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<div className={combineClassNames("grid grid-cols-1 gap-4", className!)}>{children}</div>
);

export const EditorSimpleGrid: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<div className={combineClassNames("grid grid-cols-2 gap-6", className!)}>{children}</div>
);
