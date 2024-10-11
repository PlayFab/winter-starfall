/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { IEnemyGroupProgression } from "../../shared/types";
import { EditorPageContentEnemyList } from "./enemy/enemy-list";
import { EditorPageContentGroupList } from "./enemy/group-list";
import { EnemiesEditorProgressionCinematics } from "./enemy/progression";
import { EditorHeader } from "./header";
import { EditorMainList, EditorMainListItem } from "./styles";
import { IEditorPageContentProps } from "./switch";

export const EditorPageContentEnemies: React.FunctionComponent<IEditorPageContentProps> = props => {
	return (
		<div className="gap-12 grid grid-cols-1">
			<EditorPageContentEnemyProgression {...props} />
			<EditorPageContentEnemyList {...props} />
			<EditorPageContentGroupList {...props} />
		</div>
	);
};

const EditorPageContentEnemyProgression: React.FunctionComponent<IEditorPageContentProps> = ({
	content,
	onChange,
	onSave,
}) => {
	return (
		<div>
			<EditorHeader
				title="Enemy progression"
				onSave={onSave}
				newItemOnClick={() =>
					onChange({
						...content,
						progressions: content.progressions.concat([{ id: "", groups: [""] }]),
					})
				}
				newItemTitle="New progression"
			/>
			<EditorMainList>
				{content.progressions.map((progression: IEnemyGroupProgression, index: number) => {
					const onChangeLocal = (progression: IEnemyGroupProgression) => {
						onChange({
							...content,
							progressions: content.progressions.map((p: IEnemyGroupProgression, i: number) =>
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
							<EnemiesEditorProgressionCinematics
								onChange={onChangeLocal}
								progression={progression}
								onDelete={onDelete}
							/>
						</EditorMainListItem>
					);
				})}
			</EditorMainList>
		</div>
	);
};
