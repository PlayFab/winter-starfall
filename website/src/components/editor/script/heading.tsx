/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useIntl } from "react-intl";
import { editorFieldId } from "../../../shared/helpers";
import { ICinematicEventHeading } from "../../../shared/types";
import Strings from "../../../strings";
import { WSCheckbox } from "../../checkbox";
import { WSTextField } from "../../text-field";
import { EditorFormFieldList } from "../styles";
import { IEditorPageContentScriptCinematicEventBaseProps } from "./types";

interface IEditorPageContentScriptCinematicEventHeadingProps extends IEditorPageContentScriptCinematicEventBaseProps {
	event: ICinematicEventHeading;
	onChange: (event: ICinematicEventHeading, index: number) => void;
}

export const EditorPageContentScriptCinematicEventHeading: React.FunctionComponent<
	IEditorPageContentScriptCinematicEventHeadingProps
> = ({ event, eventIndex, onChange, cinematicId }) => {
	const intl = useIntl();
	return (
		<EditorFormFieldList>
			<WSTextField
				label={intl.formatMessage({ id: Strings.editor_text })}
				name="text"
				id={editorFieldId(cinematicId, eventIndex, "text")}
				value={event.text}
				onChange={(_, value) => onChange({ ...event, text: value as string }, eventIndex)}
			/>
			<WSCheckbox
				label={intl.formatMessage({ id: Strings.editor_is_a_thought })}
				name="thought"
				id={editorFieldId(cinematicId, eventIndex, "thought")}
				checked={event.thought || false}
				onChange={(_, value) => onChange({ ...event, thought: value as boolean }, eventIndex)}
			/>
		</EditorFormFieldList>
	);
};
