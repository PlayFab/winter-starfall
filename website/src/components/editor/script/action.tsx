/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IDropdownOption } from "@fluentui/react";
import React, { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { editorFieldId } from "../../../shared/helpers";
import { is } from "../../../shared/is";
import { CinematicEventButtonActionType, ICinematicEventButtonAction } from "../../../shared/types";
import Strings from "../../../strings";
import { WSButton } from "../../button";
import { WSDropdown } from "../../dropdown";
import { UlCardFooterLinks } from "../../tailwind";
import { WSTextArea } from "../../text-area";
import { WSTextField } from "../../text-field";
import { noneOptionArray } from "../location/types";
import { EditorFormFieldList, EditorSimpleGrid } from "../styles";
import { IEditorPageContentScriptCinematicEventBaseProps } from "./types";

interface IEditorPageContentScriptCinematicEventActionProps extends IEditorPageContentScriptCinematicEventBaseProps {
	action: ICinematicEventButtonAction;
	actionIndex: number;
	onChange: (action: ICinematicEventButtonAction, index: number) => void;
	onMove: (up: boolean) => void;
	onCreate: (above: boolean) => void;
}

export const EditorPageContentScriptCinematicEventAction: React.FunctionComponent<
	IEditorPageContentScriptCinematicEventActionProps
> = ({
	action,
	actionIndex,
	availableAreas,
	availableCinematicProgressions,
	availableCinematics,
	availableLocations,
	cinematicId,
	eventIndex,
	onChange,
	onDelete,
	onCreate,
	onMove,
}) => {
	const intl = useIntl();

	return (
		<div>
			<EditorFormFieldList>
				<WSDropdown
					id={editorFieldId(cinematicId, eventIndex, `action-${actionIndex}-type`)}
					label={intl.formatMessage({ id: Strings.editor_type })}
					selectedKey={action.type}
					options={[
						{ key: 0, text: intl.formatMessage({ id: Strings.cinematic_event_action_type_0 }) },
						{ key: 1, text: intl.formatMessage({ id: Strings.cinematic_event_action_type_1 }) },
						{ key: 2, text: intl.formatMessage({ id: Strings.cinematic_event_action_type_2 }) },
						{ key: 3, text: intl.formatMessage({ id: Strings.cinematic_event_action_type_3 }) },
						{ key: 4, text: intl.formatMessage({ id: Strings.cinematic_event_action_type_4 }) },
						{ key: 5, text: intl.formatMessage({ id: Strings.cinematic_event_action_type_5 }) },
						{ key: 6, text: intl.formatMessage({ id: Strings.cinematic_event_action_type_6 }) },
						{ key: 7, text: intl.formatMessage({ id: Strings.cinematic_event_action_type_7 }) },
						{ key: 8, text: intl.formatMessage({ id: Strings.cinematic_event_action_type_8 }) },
						{ key: 9, text: intl.formatMessage({ id: Strings.cinematic_event_action_type_9 }) },
						{ key: 10, text: intl.formatMessage({ id: Strings.cinematic_event_action_type_10 }) },
						{ key: 11, text: intl.formatMessage({ id: Strings.cinematic_event_action_type_11 }) },
						{ key: 12, text: intl.formatMessage({ id: Strings.cinematic_event_action_type_12 }) },
						{ key: 13, text: intl.formatMessage({ id: Strings.cinematic_event_action_type_13 }) },
						{ key: 100, text: intl.formatMessage({ id: Strings.cinematic_event_action_type_100 }) },
					]}
					onChange={value => onChange({ ...action, type: parseInt(value as string) }, actionIndex)}
				/>
				<EditorPageContentScriptCinematicEventActionValue
					action={action}
					actionIndex={actionIndex}
					availableAreas={availableAreas}
					availableCinematicProgressions={availableCinematicProgressions}
					availableCinematics={availableCinematics}
					availableLocations={availableLocations}
					cinematicId={cinematicId}
					eventIndex={eventIndex}
					onChange={onChange}
					onCreate={onCreate}
					onDelete={onDelete}
					onMove={onMove}
				/>
			</EditorFormFieldList>
			<UlCardFooterLinks className="mt-2">
				<li>
					<WSButton style="link" onClick={() => onCreate(true)}>
						<FormattedMessage id={Strings.editor_new_action_above} />
					</WSButton>
				</li>
				<li>
					<WSButton style="link" onClick={() => onCreate(false)}>
						<FormattedMessage id={Strings.editor_new_action_below} />
					</WSButton>
				</li>
				<li>
					<WSButton style="link" onClick={() => onMove(true)}>
						<FormattedMessage id={Strings.editor_move_up} />
					</WSButton>
				</li>
				<li>
					<WSButton style="link" onClick={() => onMove(false)}>
						<FormattedMessage id={Strings.editor_move_down} />
					</WSButton>
				</li>
				<li>
					<WSButton style="link" onClick={onDelete}>
						<FormattedMessage id={Strings.editor_delete} />
					</WSButton>
				</li>
			</UlCardFooterLinks>
		</div>
	);
};

const EditorPageContentScriptCinematicEventActionValue: React.FunctionComponent<
	IEditorPageContentScriptCinematicEventActionProps
> = ({
	action,
	actionIndex,
	onChange,
	eventIndex,
	cinematicId,
	availableCinematics,
	availableLocations,
	availableCinematicProgressions,
	availableAreas,
}) => {
	const intl = useIntl();

	const onChangeActionValue = useCallback(
		(value: string) => onChange({ ...action, value }, actionIndex),
		[action, actionIndex, onChange]
	);

	const dropdownId = editorFieldId(cinematicId, eventIndex, `action-${actionIndex}-value-dropdown`);
	const textId = editorFieldId(cinematicId, eventIndex, `action-${actionIndex}-value`);

	const availableGuests: IDropdownOption[] = noneOptionArray.concat([
		{
			key: 100,
			text: intl.formatMessage({ id: Strings.name_shazim }),
		},
		{
			key: 101,
			text: intl.formatMessage({ id: Strings.name_lochan }),
		},
		{
			key: 102,
			text: intl.formatMessage({ id: Strings.name_anais }),
		},
		{ key: 103, text: intl.formatMessage({ id: Strings.name_ronald }) },
	]);

	switch (action.type) {
		case CinematicEventButtonActionType.ChangeCinematic:
			return (
				<EditorSimpleGrid>
					<WSDropdown
						id={textId}
						label={intl.formatMessage({ id: Strings.editor_cinematic })}
						selectedKey={
							is.null(action.value) || !availableCinematics.find(a => a === action.value)
								? ""
								: action.value
						}
						options={noneOptionArray.concat(availableCinematics.map(c => ({ key: c, text: c })))}
						onChange={value => onChange({ ...action, value: value as string }, actionIndex)}
					/>
					<ActionValueTextField
						cinematicId={cinematicId}
						eventIndex={eventIndex}
						actionIndex={actionIndex}
						value={action.value}
						onChange={onChangeActionValue}
					/>
				</EditorSimpleGrid>
			);
		case CinematicEventButtonActionType.LocationAdd:
		case CinematicEventButtonActionType.LocationRemove:
		case CinematicEventButtonActionType.LocationSet:
			return (
				<EditorSimpleGrid>
					<WSDropdown
						id={dropdownId}
						label={intl.formatMessage({ id: Strings.editor_location_area })}
						selectedKey={
							is.null(action.value) || !availableLocations?.find(a => a === action.value)
								? ""
								: action.value
						}
						options={noneOptionArray
							.concat(availableLocations?.map(loc => ({ key: loc, text: loc })))
							.filter(loc => !is.null(loc))}
						onChange={value => onChange({ ...action, value: value as string }, actionIndex)}
					/>
					<ActionValueTextField
						cinematicId={cinematicId}
						eventIndex={eventIndex}
						actionIndex={actionIndex}
						value={action.value}
						onChange={onChangeActionValue}
					/>
				</EditorSimpleGrid>
			);
		case CinematicEventButtonActionType.AreaSet:
			return (
				<EditorSimpleGrid>
					<WSDropdown
						id={dropdownId}
						label={intl.formatMessage({ id: Strings.editor_location_area })}
						selectedKey={
							is.null(action.value) || !availableAreas?.find(a => a === action.value) ? "" : action.value
						}
						options={noneOptionArray
							.concat(availableAreas?.map(loc => ({ key: loc, text: loc })))
							.filter(loc => !is.null(loc))}
						onChange={value => onChange({ ...action, value: value as string }, actionIndex)}
					/>
					<ActionValueTextField
						cinematicId={cinematicId}
						eventIndex={eventIndex}
						actionIndex={actionIndex}
						value={action.value}
						onChange={onChangeActionValue}
					/>
				</EditorSimpleGrid>
			);
		case CinematicEventButtonActionType.CloudScript:
			return (
				<EditorSimpleGrid>
					<WSDropdown
						id={dropdownId}
						label={intl.formatMessage({ id: Strings.editor_function_name })}
						selectedKey={action.value}
						options={[
							"PlayerCreated",
							"CombatVictory",
							"SellItem",
							"ResetPlayer",
							"ProgressCheckpoint",
						].map(c => ({ key: c, text: c }))}
						onChange={onChangeActionValue}
					/>
					<ActionValueTextField
						cinematicId={cinematicId}
						eventIndex={eventIndex}
						actionIndex={actionIndex}
						value={JSON.stringify(action.argument)}
						onChange={value => onChange({ ...action, argument: value as string }, actionIndex)}
						name="argument"
						label={intl.formatMessage({ id: Strings.editor_argument })}
					/>
				</EditorSimpleGrid>
			);
		case CinematicEventButtonActionType.GetReadOnlyData:
		case CinematicEventButtonActionType.GetWriteableData:
		case CinematicEventButtonActionType.UpdateWriteableData:
			return (
				<WSTextArea
					id={textId}
					label={intl.formatMessage({ id: Strings.editor_title_data_fields })}
					name="title_data"
					value={action.value?.split(",").join("\n")}
					rows={Math.max(1, action.value?.split(",").length || 0)}
					onChange={(_, value) =>
						onChange({ ...action, value: (value as string).split("\n").join(",") }, actionIndex)
					}
				/>
			);
		case CinematicEventButtonActionType.Delay:
			return (
				<ActionValueTextField
					cinematicId={cinematicId}
					eventIndex={eventIndex}
					actionIndex={actionIndex}
					value={action.value}
					onChange={onChangeActionValue}
					type="number"
					label={intl.formatMessage({ id: Strings.editor_delay_ms })}
				/>
			);
		case CinematicEventButtonActionType.GetInventory:
		case CinematicEventButtonActionType.TheEnd:
			return null;
		case CinematicEventButtonActionType.AddGuest:
		case CinematicEventButtonActionType.RemoveGuest:
			return (
				<WSDropdown
					id={dropdownId}
					label={intl.formatMessage({ id: Strings.editor_guest })}
					selectedKey={action.value}
					options={availableGuests}
					onChange={value => onChange({ ...action, value: value as string }, actionIndex)}
				/>
			);
		case CinematicEventButtonActionType.CinematicProgressionClear:
			return (
				<WSDropdown
					id={dropdownId}
					label={intl.formatMessage({ id: Strings.editor_cinematic_progression })}
					selectedKey={
						is.null(action.value) || !availableCinematicProgressions?.find(a => a === action.value)
							? ""
							: action.value
					}
					options={noneOptionArray
						.concat(availableCinematicProgressions?.map(id => ({ key: id, text: id })))
						.filter(loc => !is.null(loc))}
					onChange={value => onChange({ ...action, value: value as string }, actionIndex)}
				/>
			);
		default:
			return (
				<ActionValueTextField
					cinematicId={cinematicId}
					eventIndex={eventIndex}
					actionIndex={actionIndex}
					value={action.value}
					onChange={onChangeActionValue}
				/>
			);
	}
};

interface IActionValueTextFieldProps {
	cinematicId: string;
	eventIndex: number;
	actionIndex: number;
	value: string;
	label?: string;
	name?: string;
	type?: string;
	onChange: (value: string) => void;
}

const ActionValueTextField: React.FunctionComponent<IActionValueTextFieldProps> = ({
	cinematicId,
	eventIndex,
	actionIndex,
	value,
	onChange,
	label = "",
	name = "value",
	type = "text",
}) => {
	const intl = useIntl();

	if (is.null(label)) {
		label = intl.formatMessage({ id: Strings.editor_value });
	}

	return (
		<WSTextField
			label={label}
			type={type}
			name={name}
			id={`${cinematicId}-${eventIndex}-action-${actionIndex}-value-text`}
			value={value}
			onChange={(_, value) => onChange(value as string)}
		/>
	);
};
