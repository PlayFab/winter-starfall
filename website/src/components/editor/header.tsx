/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage } from "react-intl";
import { is } from "../../shared/is";
import Strings from "../../strings";
import { WSButton } from "../button";
import { H2Left } from "../tailwind";

interface IProps {
	title: string;
	onSave?: () => void;
	newItemTitle?: string;
	newItemOnClick?: () => void;
}

export const EditorHeader: React.FunctionComponent<IProps> = ({ newItemOnClick, newItemTitle, onSave, title }) => {
	return (
		<div className="flex justify-between gap-4">
			<H2Left>{title}</H2Left>
			<div className="flex gap-4">
				{!is.null(newItemTitle) && (
					<WSButton onClick={newItemOnClick!} style="light">
						{newItemTitle}
					</WSButton>
				)}
				{!is.null(onSave) && (
					<WSButton onClick={onSave!}>
						<FormattedMessage id={Strings.save} />
					</WSButton>
				)}
			</div>
		</div>
	);
};

export const EditorFooter: React.FunctionComponent<IProps> = ({ newItemOnClick, newItemTitle, onSave }) => {
	return (
		<div className="flex justify-between gap-4">
			<div></div>
			<div className="flex gap-4">
				{!is.null(newItemTitle) && (
					<WSButton onClick={newItemOnClick!} style="light">
						{newItemTitle}
					</WSButton>
				)}
				{!is.null(onSave) && (
					<WSButton onClick={onSave!}>
						<FormattedMessage id={Strings.save} />
					</WSButton>
				)}
			</div>
		</div>
	);
};
