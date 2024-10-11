/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import {
	CinematicEventType,
	ICinematicEventButton,
	ICinematicEventImage,
	ICinematicEventMessages,
} from "../../../shared/types";
import { EditorPageContentScriptCinematicEventButton } from "./button";
import { EditorPageContentScriptCinematicEventExecute } from "./execute";
import { EditorPageContentScriptCinematicEventHeading } from "./heading";
import { EditorPageContentScriptCinematicEventImage } from "./image";
import { EditorPageContentScriptCinematicEventMessages } from "./messages";
import { IEditorPageContentScriptCinematicEventProps } from "./types";

export const EditorPageContentScriptCinematicEventType: React.FunctionComponent<
	IEditorPageContentScriptCinematicEventProps
> = ({
	event,
	eventIndex,
	onChange,
	onDelete,
	cinematicId,
	availableCinematics,
	availableLocations,
	availableAreas,
	availableCinematicProgressions,
}) => {
	switch (event.type) {
		case CinematicEventType.Heading:
			return (
				<EditorPageContentScriptCinematicEventHeading
					availableAreas={availableAreas}
					availableCinematics={availableCinematics}
					availableCinematicProgressions={availableCinematicProgressions}
					availableLocations={availableLocations}
					cinematicId={cinematicId}
					event={event as ICinematicEventMessages}
					eventIndex={eventIndex}
					onChange={onChange}
					onDelete={onDelete}
				/>
			);
		case CinematicEventType.Messages:
			return (
				<EditorPageContentScriptCinematicEventMessages
					availableAreas={availableAreas}
					availableCinematics={availableCinematics}
					availableCinematicProgressions={availableCinematicProgressions}
					availableLocations={availableLocations}
					cinematicId={cinematicId}
					event={event as ICinematicEventMessages}
					eventIndex={eventIndex}
					onChange={onChange}
					onDelete={onDelete}
				/>
			);
		case CinematicEventType.Image:
			return (
				<EditorPageContentScriptCinematicEventImage
					availableAreas={availableAreas}
					availableCinematics={availableCinematics}
					availableCinematicProgressions={availableCinematicProgressions}
					availableLocations={availableLocations}
					cinematicId={cinematicId}
					event={event as ICinematicEventImage}
					eventIndex={eventIndex}
					onChange={onChange}
					onDelete={onDelete}
				/>
			);
		case CinematicEventType.Button:
			return (
				<EditorPageContentScriptCinematicEventButton
					availableAreas={availableAreas}
					availableCinematics={availableCinematics}
					availableCinematicProgressions={availableCinematicProgressions}
					availableLocations={availableLocations}
					cinematicId={cinematicId}
					event={event as ICinematicEventButton}
					eventIndex={eventIndex}
					onChange={onChange}
					onDelete={onDelete}
				/>
			);
		case CinematicEventType.ActionExecute:
			return (
				<EditorPageContentScriptCinematicEventExecute
					availableAreas={availableAreas}
					availableCinematics={availableCinematics}
					availableCinematicProgressions={availableCinematicProgressions}
					availableLocations={availableLocations}
					cinematicId={cinematicId}
					event={event as ICinematicEventButton}
					eventIndex={eventIndex}
					onChange={onChange}
					onDelete={onDelete}
				/>
			);
		default:
			return null;
	}
};
