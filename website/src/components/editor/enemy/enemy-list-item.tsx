/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { IEnemy } from "../../../shared/types";
import { WSDropdown } from "../../dropdown";
import { WSTextField } from "../../text-field";
import { EditorItemWithDelete } from "../item-delete";
import { EditorFormFieldList, EditorSimpleGrid } from "../styles";

interface IEnemiesEditorEnemyProps {
	enemy: IEnemy;
	onChange: (enemy: IEnemy) => void;
	onDelete: () => void;
}

export const EnemiesEditorEnemy: React.FunctionComponent<IEnemiesEditorEnemyProps> = ({
	enemy,
	onChange,
	onDelete,
}) => {
	return (
		<EditorFormFieldList>
			<EditorItemWithDelete onDelete={onDelete}>
				<WSTextField
					label="ID"
					name="id"
					value={enemy.id}
					onChange={(_, value) => onChange({ ...enemy, id: value as string })}
				/>
			</EditorItemWithDelete>
			<EditorSimpleGrid>
				<WSTextField
					label="Name"
					name="name"
					value={enemy.name}
					onChange={(_, value) => onChange({ ...enemy, name: value as string })}
				/>
				<WSTextField
					label="Description"
					name="description"
					value={enemy.description}
					onChange={(_, value) => onChange({ ...enemy, description: value as string })}
				/>
			</EditorSimpleGrid>
			<EditorSimpleGrid>
				<EditorFormFieldList>
					<WSTextField
						label="Image"
						name="image"
						value={enemy.image}
						onChange={(_, value) => onChange({ ...enemy, image: value as string })}
					/>
					<WSDropdown
						label="Size"
						selectedKey={enemy.size}
						options={[
							{ key: 0, text: "Small" },
							{ key: 1, text: "Medium" },
						]}
						onChange={value => onChange({ ...enemy, size: parseInt(value) })}
					/>
				</EditorFormFieldList>
				<div className="flex justify-center">
					<a href={`/src/static/enemies/${enemy.image}.png`} target="_blank" rel="noreferrer">
						<img
							src={`/src/static/enemies/${enemy.image}.png`}
							alt={enemy.name}
							className="border border-border"
						/>
					</a>
				</div>
			</EditorSimpleGrid>
			<EditorSimpleGrid className="!grid-cols-3">
				<WSTextField
					label="HP"
					name="hp"
					type="number"
					value={enemy.hp.toString()}
					onChange={(_, value) => onChange({ ...enemy, hp: parseInt(value as string) })}
				/>
				<WSTextField
					label="Damage"
					name="damage"
					type="number"
					value={enemy.damage.toString()}
					onChange={(_, value) => onChange({ ...enemy, damage: parseInt(value as string) })}
				/>
				<WSTextField
					label="Range"
					name="range"
					type="number"
					value={enemy.range.toString()}
					onChange={(_, value) => onChange({ ...enemy, range: parseInt(value as string) })}
				/>
			</EditorSimpleGrid>
		</EditorFormFieldList>
	);
};
