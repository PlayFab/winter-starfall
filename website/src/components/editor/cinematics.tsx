/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ICinematicProgression } from "../../shared/types";
import Strings from "../../strings";
import { WSButton } from "../button";
import { WSTextField } from "../text-field";
import { EditorFooter, EditorHeader } from "./header";
import { EditorItemWithDelete } from "./item-delete";
import { EditorMainList, EditorMainListItem } from "./styles";
import { IEditorPageContentProps } from "./switch";

export const EditorPageContentCinematics: React.FunctionComponent<IEditorPageContentProps> = ({
	content,
	onChange,
	onSave,
}) => {
	const intl = useIntl();

	return (
		<>
			<EditorHeader
				title={intl.formatMessage({ id: Strings.editor_progressions })}
				newItemOnClick={() =>
					onChange({
						...content,
						progressions: content.progressions.concat([{ id: "", cinematics: [""] }]),
					})
				}
				newItemTitle={intl.formatMessage({ id: Strings.editor_new_progression })}
				onSave={onSave}
			/>
			<EditorMainList>
				{content.progressions.map((progression: ICinematicProgression, index: number) => {
					const onChangeLocal = (progression: ICinematicProgression) => {
						onChange({
							...content,
							progressions: content.progressions.map((p: ICinematicProgression, i: number) =>
								i === index ? progression : p
							),
						});
					};

					const onDelete = () => {
						onChange({
							...content,
							progressions: content.progressions.filter((_: any, i: number) => i !== index),
						});
					};

					return (
						<EditorMainListItem key={index}>
							<CinematicsEditorProgressionCinematics
								onChange={onChangeLocal}
								progression={progression}
								onDelete={onDelete}
							/>
						</EditorMainListItem>
					);
				})}
			</EditorMainList>
			<EditorFooter
				title={intl.formatMessage({ id: Strings.editor_progressions })}
				newItemOnClick={() =>
					onChange({
						...content,
						progressions: content.progressions.concat([{ id: "", cinematics: [""] }]),
					})
				}
				newItemTitle={intl.formatMessage({ id: Strings.editor_new_progression })}
				onSave={onSave}
			/>
		</>
	);
};

interface ICinematicsEditorProgressionCinematicsProps {
	progression: ICinematicProgression;
	onChange: (progression: ICinematicProgression) => void;
	onDelete: () => void;
}

const CinematicsEditorProgressionCinematics: React.FunctionComponent<ICinematicsEditorProgressionCinematicsProps> = ({
	progression,
	onChange,
	onDelete,
}) => {
	const intl = useIntl();

	return (
		<div className="gap-6 grid grid-cols-2">
			<div>
				<EditorItemWithDelete onDelete={onDelete}>
					<WSTextField
						label={intl.formatMessage({ id: Strings.editor_id })}
						name="id"
						id={`id-${progression.id}`}
						value={progression.id}
						onChange={(_, value) => onChange({ ...progression, id: value as string })}
					/>
				</EditorItemWithDelete>
			</div>
			<div>
				<p>
					<FormattedMessage id={Strings.editor_cinematics} />
				</p>
				<ul className="gap-2 grid grid-cols-1">
					{progression.cinematics.map((cinematic, index) => (
						<li key={index}>
							<EditorItemWithDelete
								onDelete={() =>
									onChange({
										...progression,
										cinematics: progression.cinematics.filter((_, i) => i !== index),
									})
								}>
								<WSTextField
									name="cinematic"
									value={cinematic}
									id={`progression-${progression.id}-cinematic-${index}`}
									onChange={(_, value) => {
										const cinematics = progression.cinematics.map((c, i) =>
											i === index ? (value as string) : c
										);
										onChange({ ...progression, cinematics });
									}}
								/>
							</EditorItemWithDelete>
						</li>
					))}
					<li>
						<WSButton
							onClick={() =>
								onChange({ ...progression, cinematics: progression.cinematics.concat([""]) })
							}
							style="light">
							<FormattedMessage id={Strings.editor_new_cinematic} />
						</WSButton>
					</li>
				</ul>
			</div>
		</div>
	);
};
