/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useIntl } from "react-intl";
import { editorFieldId } from "../../../shared/helpers";
import { CinematicEventSpeaker, ICinematicEventMessages } from "../../../shared/types";
import Strings from "../../../strings";
import { WSCheckbox } from "../../checkbox";
import { WSDropdown } from "../../dropdown";
import { WSTextArea } from "../../text-area";
import { WSTextField } from "../../text-field";
import { noneOptionArray } from "../location/types";
import { EditorFormFieldList } from "../styles";
import { IEditorPageContentScriptCinematicEventBaseProps } from "./types";

interface IEditorPageContentScriptCinematicEventMessagesProps extends IEditorPageContentScriptCinematicEventBaseProps {
	event: ICinematicEventMessages;
	onChange: (event: ICinematicEventMessages, index: number) => void;
}

export const EditorPageContentScriptCinematicEventMessages: React.FunctionComponent<
	IEditorPageContentScriptCinematicEventMessagesProps
> = ({ event, eventIndex, onChange, cinematicId }) => {
	const intl = useIntl();

	return (
		<EditorFormFieldList>
			<WSTextField
				label={intl.formatMessage({ id: Strings.editor_heading })}
				id={editorFieldId(cinematicId, eventIndex, "heading")}
				name="text"
				value={event.text}
				onChange={(_, value) => onChange({ ...event, text: value as string }, eventIndex)}
			/>
			<WSDropdown
				label={intl.formatMessage({ id: Strings.editor_speaker })}
				id={editorFieldId(cinematicId, eventIndex, "speaker")}
				selectedKey={event.speaker}
				options={[
					noneOptionArray[0],
					{ key: CinematicEventSpeaker.Sara, text: intl.formatMessage({ id: Strings.name_sara }) },
					{
						key: CinematicEventSpeaker.Nadia,
						text: intl.formatMessage({ id: Strings.name_nadia }),
					},
					{
						key: CinematicEventSpeaker.Warren,
						text: intl.formatMessage({ id: Strings.name_warren }),
					},
					{
						key: CinematicEventSpeaker.Anais,
						text: intl.formatMessage({ id: Strings.name_anais }),
					},
					{
						key: CinematicEventSpeaker.Lochan,
						text: intl.formatMessage({ id: Strings.name_lochan }),
					},
					{
						key: CinematicEventSpeaker.Ronald,
						text: intl.formatMessage({ id: Strings.name_ronald }),
					},
					{
						key: CinematicEventSpeaker.Shazim,
						text: intl.formatMessage({ id: Strings.name_shazim }),
					},
					{
						key: CinematicEventSpeaker.GreenCityGateGuard,
						text: intl.formatMessage({ id: Strings.name_green_city_guard }),
					},
				]}
				onChange={value =>
					onChange({ ...event, speaker: parseInt(value) as CinematicEventSpeaker }, eventIndex)
				}
			/>
			<WSTextArea
				label={intl.formatMessage({ id: Strings.editor_messages })}
				name="messages"
				id={editorFieldId(cinematicId, eventIndex, "messages")}
				value={event.messages?.join("\n") || ""}
				rows={Math.max(2, event.messages?.length + 1 || 0)}
				onChange={(_, value) => onChange({ ...event, messages: (value as string).split("\n") }, eventIndex)}
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
