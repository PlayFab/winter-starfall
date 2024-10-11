/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useIntl } from "react-intl";
import { editorFieldId } from "../../../shared/helpers";
import { ICinematicEventActionExecute, ICinematicEventButton } from "../../../shared/types";
import Strings from "../../../strings";
import { WSCheckbox } from "../../checkbox";
import { WSTextField } from "../../text-field";
import { EditorFormFieldList, EditorSimpleGrid } from "../styles";
import { EditorPageContentScriptCinematicEventActions } from "./actions";
import { IEditorPageContentScriptCinematicEventBaseProps } from "./types";

interface IEditorPageContentScriptCinematicEventButtonProps extends IEditorPageContentScriptCinematicEventBaseProps {
	event: ICinematicEventButton;
	onChange: (event: ICinematicEventButton | ICinematicEventActionExecute, index: number) => void;
}

export const EditorPageContentScriptCinematicEventButton: React.FunctionComponent<
	IEditorPageContentScriptCinematicEventButtonProps
> = ({
	availableAreas,
	availableCinematicProgressions,
	availableCinematics,
	availableLocations,
	cinematicId,
	event,
	eventIndex,
	onChange,
	onDelete,
}) => {
	const intl = useIntl();

	return (
		<EditorFormFieldList>
			<WSTextField
				label={intl.formatMessage({ id: Strings.editor_label })}
				name="text"
				id={editorFieldId(cinematicId, eventIndex, "text")}
				value={event.text}
				placeholder={intl.formatMessage({ id: Strings.continue })}
				onChange={(_, value) => onChange({ ...event, text: value as string }, eventIndex)}
			/>
			<EditorSimpleGrid>
				<WSCheckbox
					label={intl.formatMessage({ id: Strings.editor_loading_spinner })}
					name="loading"
					id={editorFieldId(cinematicId, eventIndex, "loading")}
					checked={event.loading || false}
					onChange={(_, value) => onChange({ ...event, loading: value as boolean }, eventIndex)}
				/>
				<WSCheckbox
					label={intl.formatMessage({ id: Strings.editor_run_sequentially })}
					name="sequential"
					id={editorFieldId(cinematicId, eventIndex, "sequential")}
					checked={event.sequential || false}
					onChange={(_, value) => onChange({ ...event, sequential: value as boolean }, eventIndex)}
				/>
			</EditorSimpleGrid>
			<EditorPageContentScriptCinematicEventActions
				availableAreas={availableAreas}
				availableCinematicProgressions={availableCinematicProgressions}
				availableCinematics={availableCinematics}
				availableLocations={availableLocations}
				cinematicId={cinematicId}
				event={event}
				eventIndex={eventIndex}
				onChange={onChange}
				onDelete={onDelete}
			/>
		</EditorFormFieldList>
	);
};
