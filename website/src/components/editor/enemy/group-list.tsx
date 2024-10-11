/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { IEnemy, IEnemyGroup } from "../../../shared/types";
import { EditorHeader } from "../header";
import { EditorMainList, EditorMainListItem } from "../styles";
import { IEditorPageContentProps } from "../switch";
import { EnemiesEditorEnemyGroup } from "./group-list-item";

export const EditorPageContentGroupList: React.FunctionComponent<IEditorPageContentProps> = ({
	content,
	onChange,
	onSave,
}) => {
	return (
		<div>
			<EditorHeader
				title="Enemy groups"
				onSave={onSave}
				newItemOnClick={() =>
					onChange({
						...content,
						groups: content.groups.concat([
							{
								id: "",
								turnOrder: 0,
								reward: "",
								canLose: false,
								enemies: [],
							},
						]),
					})
				}
				newItemTitle="New group"
			/>
			<EditorMainList>
				{content.groups.map((group: IEnemyGroup, index: number) => {
					const onChangeLocal = (g1: IEnemyGroup) => {
						onChange({
							...content,
							groups: content.groups.map((g2: IEnemyGroup, i: number) => (i === index ? g1 : g2)),
						});
					};

					const onDelete = () => {
						onChange({
							...content,
							groups: content.groups.filter((_: any, i: number) => i !== index),
						});
					};

					return (
						<EditorMainListItem key={index}>
							<EnemiesEditorEnemyGroup
								onChange={onChangeLocal}
								group={group}
								onDelete={onDelete}
								index={index}
								availableEnemies={content.enemies.map((e: IEnemy) => e.id)}
							/>
						</EditorMainListItem>
					);
				})}
			</EditorMainList>
		</div>
	);
};
