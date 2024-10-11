/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useIntl } from "react-intl";
import { editorFieldId } from "../../../shared/helpers";
import { ICinematicEventActionExecute } from "../../../shared/types";
import Strings from "../../../strings";
import { WSCheckbox } from "../../checkbox";
import { EditorFormFieldList } from "../styles";
import { EditorPageContentScriptCinematicEventActions } from "./actions";
import { IEditorPageContentScriptCinematicEventBaseProps } from "./types";

interface IEditorPageContentScriptCinematicEventExecuteProps extends IEditorPageContentScriptCinematicEventBaseProps {
	event: ICinematicEventActionExecute;
	onChange: (event: ICinematicEventActionExecute, index: number) => void;
}

export const EditorPageContentScriptCinematicEventExecute: React.FunctionComponent<
	IEditorPageContentScriptCinematicEventExecuteProps
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
			<WSCheckbox
				label={intl.formatMessage({ id: Strings.editor_run_sequentially })}
				name="sequential"
				id={editorFieldId(cinematicId, eventIndex, "sequential")}
				checked={event.sequential || false}
				onChange={(_, value) => onChange({ ...event, sequential: value as boolean }, eventIndex)}
			/>
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
