/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useIntl } from "react-intl";
import { editorFieldId } from "../../../shared/helpers";
import { ICinematicEventImage } from "../../../shared/types";
import Strings from "../../../strings";
import { WSTextField } from "../../text-field";
import { EditorFormFieldList, EditorSimpleGrid } from "../styles";
import { IEditorPageContentScriptCinematicEventBaseProps } from "./types";

interface IEditorPageContentScriptCinematicEventImageProps extends IEditorPageContentScriptCinematicEventBaseProps {
	event: ICinematicEventImage;
	onChange: (event: ICinematicEventImage, index: number) => void;
}

export const EditorPageContentScriptCinematicEventImage: React.FunctionComponent<
	IEditorPageContentScriptCinematicEventImageProps
> = ({ event, eventIndex, onChange, cinematicId }) => {
	const intl = useIntl();

	return (
		<EditorFormFieldList>
			<EditorSimpleGrid>
				<WSTextField
					label={intl.formatMessage({ id: Strings.editor_image })}
					id={editorFieldId(cinematicId, eventIndex, "image")}
					name="image"
					value={event.image}
					onChange={(_, value) => onChange({ ...event, image: value as string }, eventIndex)}
				/>
				<WSTextField
					label={intl.formatMessage({ id: Strings.editor_alt_text })}
					name="alt"
					id={editorFieldId(cinematicId, eventIndex, "alt-text")}
					value={event.alt}
					onChange={(_, value) => onChange({ ...event, alt: value as string }, eventIndex)}
				/>
			</EditorSimpleGrid>
		</EditorFormFieldList>
	);
};
