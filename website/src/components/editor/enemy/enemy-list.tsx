/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { IEnemy } from "../../../shared/types";
import { EditorHeader } from "../header";
import { EditorMainList, EditorMainListItem } from "../styles";
import { IEditorPageContentProps } from "../switch";
import { EnemiesEditorEnemy } from "./enemy-list-item";

export const EditorPageContentEnemyList: React.FunctionComponent<IEditorPageContentProps> = ({
	content,
	onChange,
	onSave,
}) => {
	return (
		<div>
			<EditorHeader
				title="Enemy data"
				onSave={onSave}
				newItemOnClick={() =>
					onChange({
						...content,
						enemies: content.enemies.concat([
							{
								id: "",
								name: "",
								image: "",
								description: "",
								hp: 0,
								damage: 0,
								range: 0.2,
								xp: 0,
								size: 0,
							},
						]),
					})
				}
				newItemTitle="New enemy"
			/>
			<EditorMainList>
				{content.enemies.map((enemy: IEnemy, index: number) => {
					const onChangeLocal = (enemy: IEnemy) => {
						onChange({
							...content,
							enemies: content.enemies.map((e: IEnemy, i: number) => (i === index ? enemy : e)),
						});
					};

					const onDelete = () => {
						onChange({
							...content,
							enemies: content.enemies.filter((_: any, i: number) => i !== index),
						});
					};

					return (
						<EditorMainListItem key={index}>
							<EnemiesEditorEnemy onChange={onChangeLocal} enemy={enemy} onDelete={onDelete} />
						</EditorMainListItem>
					);
				})}
			</EditorMainList>
		</div>
	);
};
