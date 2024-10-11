/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage } from "react-intl";
import { editorFieldId } from "../../../shared/helpers";
import { is } from "../../../shared/is";
import {
	CinematicEventButtonActionType,
	ICinematicEventActionExecute,
	ICinematicEventButton,
	ICinematicEventButtonAction,
} from "../../../shared/types";
import Strings from "../../../strings";
import { WSButton } from "../../button";
import { EditorMainList, EditorMainListItem } from "../styles";
import { EditorPageContentScriptCinematicEventAction } from "./action";
import { IEditorPageContentScriptCinematicEventBaseProps } from "./types";

interface IEditorPageContentScriptCinematicEventActionsProps extends IEditorPageContentScriptCinematicEventBaseProps {
	event: ICinematicEventButton | ICinematicEventActionExecute;
	onChange: (event: ICinematicEventButton | ICinematicEventActionExecute, index: number) => void;
}

export const EditorPageContentScriptCinematicEventActions: React.FunctionComponent<
	IEditorPageContentScriptCinematicEventActionsProps
> = ({
	availableAreas,
	availableCinematicProgressions,
	availableCinematics,
	availableLocations,
	cinematicId,
	event,
	eventIndex,
	onChange,
}) => {
	return (
		<EditorMainList>
			{event.actions?.map((action, actionIndex) => {
				const onChangeAction = (action2: ICinematicEventButtonAction) =>
					onChange(
						{
							...event,
							actions: event.actions?.map((a, i) => (i === actionIndex ? action2 : a)),
						},
						eventIndex
					);
				const onDeleteAction = () =>
					onChange(
						{
							...event,
							actions: event.actions?.filter((_, i) => i !== actionIndex),
						},
						eventIndex
					);

				const onMove = (up: boolean) => {
					const actions = event.actions || [];
					const newIndex = actionIndex + (up ? -1 : 1);
					if (newIndex < 0 || newIndex >= actions.length) {
						return;
					}
					const newActions = [...actions];
					const temp = newActions[actionIndex];
					newActions[actionIndex] = newActions[newIndex];
					newActions[newIndex] = temp;
					onChange(
						{
							...event,
							actions: newActions,
						},
						eventIndex
					);
				};

				const onCreate = (above: boolean) => {
					const actions = event.actions || [];
					const newIndex = actionIndex + (above ? 0 : 1);
					const newActions = [...actions];
					newActions.splice(newIndex, 0, {
						type: CinematicEventButtonActionType.ChangeCinematic,
						value: "",
					});
					onChange(
						{
							...event,
							actions: newActions,
						},
						eventIndex
					);
				};

				return (
					<EditorMainListItem
						key={editorFieldId(cinematicId, eventIndex, actionIndex.toString())}
						className="!pb-0">
						<EditorPageContentScriptCinematicEventAction
							action={action}
							actionIndex={actionIndex}
							availableAreas={availableAreas}
							availableCinematicProgressions={availableCinematicProgressions}
							availableCinematics={availableCinematics}
							availableLocations={availableLocations}
							cinematicId={cinematicId}
							eventIndex={eventIndex}
							onChange={onChangeAction}
							onDelete={onDeleteAction}
							onCreate={onCreate}
							onMove={onMove}
						/>
					</EditorMainListItem>
				);
			})}
			{is.null(event.actions) && (
				<WSButton
					style="light"
					onClick={() =>
						onChange(
							{
								...event,
								actions: [{ type: CinematicEventButtonActionType.ChangeCinematic, value: "" }],
							},
							eventIndex
						)
					}>
					<FormattedMessage id={Strings.editor_create_action} />
				</WSButton>
			)}
		</EditorMainList>
	);
};
