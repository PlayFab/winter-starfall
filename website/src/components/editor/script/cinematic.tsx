/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { is } from "../../../shared/is";
import { CinematicEventType, ICinematic, ICinematicEventBase } from "../../../shared/types";
import Strings from "../../../strings";
import { WSButton } from "../../button";
import { WSTextField } from "../../text-field";
import { EditorItemWithDelete } from "../item-delete";
import { EditorMainListItem } from "../styles";
import { EditorPageContentScriptCinematicEvent } from "./event";

interface IEditorPageContentScriptCinematicProps {
	onChange: (cinematic: ICinematic) => void;
	onDelete: () => void;
	cinematic: ICinematic;
	index: number;
	availableCinematics: string[];
	availableLocations: string[];
	availableAreas: string[];
	availableCinematicProgressions: string[];
}

export const EditorPageContentScriptCinematic: React.FunctionComponent<IEditorPageContentScriptCinematicProps> = ({
	cinematic,
	onChange,
	onDelete,
	availableCinematics,
	availableLocations,
	availableAreas,
	availableCinematicProgressions,
}) => {
	const intl = useIntl();

	const onChangeEvent = useCallback(
		(event: ICinematicEventBase, eventIndex: number) => {
			onChange({
				...cinematic,
				events: cinematic.events.map((e, i) => (i === eventIndex ? event : e)),
			});
		},
		[cinematic, onChange]
	);

	const onCreate = useCallback(
		(index: number, above: boolean) => {
			const newEvent: ICinematicEventBase = {
				type: cinematic.events[index].type,
			};

			onChange({
				...cinematic,
				events: [
					...cinematic.events.slice(0, index + (above ? 0 : 1)),
					newEvent,
					...cinematic.events.slice(index + (above ? 0 : 1)),
				],
			});
		},
		[cinematic, onChange]
	);

	const onMove = useCallback(
		(index: number, up: boolean) => {
			if (up && index === 0) {
				return;
			}

			if (!up && index === cinematic.events.length - 1) {
				return;
			}

			const newIndex = index + (up ? -1 : 1);
			const events = cinematic.events.slice();
			const temp = events[index];
			events[index] = events[newIndex];
			events[newIndex] = temp;

			onChange({
				...cinematic,
				events,
			});
		},
		[cinematic, onChange]
	);

	if (is.null(cinematic)) {
		return null;
	}

	return (
		<EditorMainListItem>
			<EditorItemWithDelete onDelete={onDelete}>
				<WSTextField
					label={intl.formatMessage({ id: Strings.editor_id })}
					name="id"
					id={`cinematic-${cinematic.id}-id`}
					value={cinematic.id}
					onChange={(_, value) => onChange({ ...cinematic, id: value as string })}
				/>
			</EditorItemWithDelete>
			<ul className="gap-4 grid grid-cols-1 py-4">
				{cinematic.events?.map((event, eventIndex) => (
					<li key={`${cinematic.id}-${eventIndex}-li`}>
						<EditorPageContentScriptCinematicEvent
							availableCinematics={availableCinematics}
							availableLocations={availableLocations}
							availableCinematicProgressions={availableCinematicProgressions}
							availableAreas={availableAreas}
							key={`${cinematic.id}-${eventIndex}`}
							event={event}
							eventIndex={eventIndex}
							cinematicId={cinematic.id}
							onChange={onChangeEvent}
							onCreate={onCreate}
							onMove={onMove}
							onDelete={() => {
								onChange({
									...cinematic,
									events: cinematic.events.filter((_, i) => i !== eventIndex),
								});
							}}
						/>
					</li>
				))}
			</ul>
			{is.null(cinematic.events) && (
				<WSButton
					style="light"
					onClick={() => onChange({ ...cinematic, events: [{ type: CinematicEventType.Messages }] })}>
					<FormattedMessage id={Strings.editor_create_event} />
				</WSButton>
			)}
		</EditorMainListItem>
	);
};
