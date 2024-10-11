/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { EditorContentType } from "../../hooks/use-editor";
import { combineClassNames } from "../../shared/helpers";
import { IPropsChildrenClassName } from "../../shared/types";
import Strings from "../../strings";
import { WSButton } from "../button";
import { H2Left } from "../tailwind";

const leftNavClassName = "border-l-4 border-transparent pl-2";
const leftNavClassNameActive = "border-l-4 border-link pl-2";

interface IProps {
	activeScriptId: string;
	availableScripts: string[];
	contentType: EditorContentType;
	loadContent: (contentType: EditorContentType) => void;
	loadScript: (script: string) => void;
	onCreateScript: (name: string) => void;
}

export const EditorSidebar: React.FunctionComponent<IProps> = ({
	activeScriptId,
	availableScripts,
	contentType,
	loadContent,
	loadScript,
	onCreateScript,
}) => {
	const intl = useIntl();

	const onNewScript = useCallback(() => {
		const scriptName = prompt(intl.formatMessage({ id: Strings.editor_new_script_prompt }));

		if (scriptName) {
			onCreateScript(scriptName);
		}
	}, [intl, onCreateScript]);

	return (
		<ul className="flex flex-col gap-2">
			<li>
				<H2Left>
					<FormattedMessage id={Strings.editor_json} />
				</H2Left>
			</li>
			<li>
				<EditorSidebarLink
					onClick={() => loadContent(EditorContentType.Cinematics)}
					active={contentType === EditorContentType.Cinematics}>
					<FormattedMessage id={Strings.editor_cinematics} />
				</EditorSidebarLink>
			</li>
			<li>
				<EditorSidebarLink
					onClick={() => loadContent(EditorContentType.Locations)}
					active={contentType === EditorContentType.Locations}>
					<FormattedMessage id={Strings.editor_locations} />
				</EditorSidebarLink>
			</li>
			<li>
				<EditorSidebarLink
					onClick={() => loadContent(EditorContentType.Enemies)}
					active={contentType === EditorContentType.Enemies}>
					<FormattedMessage id={Strings.editor_enemies} />
				</EditorSidebarLink>
			</li>
			<li>
				<H2Left>
					<FormattedMessage id={Strings.editor_scripts} />
				</H2Left>
			</li>
			{availableScripts.map((script, index) => (
				<li key={index}>
					<EditorSidebarLink onClick={() => loadScript(script)} active={activeScriptId === script}>
						{script}
					</EditorSidebarLink>
				</li>
			))}
			<li>
				<WSButton onClick={onNewScript} style="light">
					<FormattedMessage id={Strings.editor_new_script} />
				</WSButton>
			</li>
		</ul>
	);
};

interface IEditorSidebarLinkProps extends IPropsChildrenClassName {
	onClick: () => void;
	active: boolean;
}

const EditorSidebarLink: React.FunctionComponent<IEditorSidebarLinkProps> = ({
	active,
	children,
	onClick,
	className,
}) => {
	return (
		<WSButton
			onClick={onClick}
			style="link"
			className={combineClassNames(active ? leftNavClassNameActive : leftNavClassName, className!)}>
			{children}
		</WSButton>
	);
};
