/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { combineClassNames } from "../../shared/helpers";
import { IPropsChildrenClassName } from "../../shared/types";
import { WSButton } from "../button";
import { WSIcon } from "../icon";

interface IProps extends IPropsChildrenClassName {
	onDelete: () => void;
}

export const EditorItemWithDelete: React.FunctionComponent<IProps> = ({ children, onDelete, className }) => (
	<div className={combineClassNames("flex items-end gap-2", className!)}>
		<div className="grow">{children}</div>
		<WSButton onClick={onDelete} style="icon" className="shrink-0">
			<WSIcon icon="Trash" />
		</WSButton>
	</div>
);
