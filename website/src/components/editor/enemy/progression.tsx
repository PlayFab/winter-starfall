/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { IEnemyGroupProgression } from "../../../shared/types";
import { WSButton } from "../../button";
import { WSTextField } from "../../text-field";
import { EditorItemWithDelete } from "../item-delete";

interface IEnemiesEditorProgressionCinematicsProps {
	progression: IEnemyGroupProgression;
	onChange: (progression: IEnemyGroupProgression) => void;
	onDelete: () => void;
}

export const EnemiesEditorProgressionCinematics: React.FunctionComponent<IEnemiesEditorProgressionCinematicsProps> = ({
	progression,
	onChange,
	onDelete,
}) => {
	return (
		<div className="gap-6 grid grid-cols-2">
			<div>
				<EditorItemWithDelete onDelete={onDelete}>
					<WSTextField
						label="ID"
						name="id"
						value={progression.id}
						onChange={(_, value) => onChange({ ...progression, id: value as string })}
					/>
				</EditorItemWithDelete>
			</div>
			<div>
				<p>Enemy groups</p>
				<ul className="gap-2 grid grid-cols-1">
					{progression.groups.map((group, index) => (
						<li key={index}>
							<EditorItemWithDelete
								onDelete={() =>
									onChange({
										...progression,
										groups: progression.groups.filter((_, i) => i !== index),
									})
								}>
								<WSTextField
									name="group"
									value={group}
									onChange={(_, value) => {
										const groups = progression.groups.map((c, i) =>
											i === index ? (value as string) : c
										);
										onChange({ ...progression, groups });
									}}
								/>
							</EditorItemWithDelete>
						</li>
					))}
					<li>
						<WSButton
							onClick={() => onChange({ ...progression, groups: progression.groups.concat([""]) })}
							style="light">
							New group
						</WSButton>
					</li>
				</ul>
			</div>
		</div>
	);
};
