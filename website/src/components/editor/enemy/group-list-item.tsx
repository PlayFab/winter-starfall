/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { IEnemyGroup } from "../../../shared/types";
import { WSButton } from "../../button";
import { WSCheckbox } from "../../checkbox";
import { WSDropdown } from "../../dropdown";
import { WSTextArea } from "../../text-area";
import { WSTextField } from "../../text-field";
import { EditorItemWithDelete } from "../item-delete";
import { EditorFormFieldList } from "../styles";

interface IEnemiesEditorEnemyGroupProps {
	group: IEnemyGroup;
	onChange: (group: IEnemyGroup) => void;
	onDelete: () => void;
	index: number;
	availableEnemies: string[];
}

export const EnemiesEditorEnemyGroup: React.FunctionComponent<IEnemiesEditorEnemyGroupProps> = ({
	group,
	onChange,
	onDelete,
	index,
	availableEnemies,
}) => {
	return (
		<EditorFormFieldList>
			<EditorItemWithDelete onDelete={onDelete}>
				<WSTextField
					label="ID"
					name="id"
					value={group.id}
					onChange={(_, value) => onChange({ ...group, id: value as string })}
				/>
			</EditorItemWithDelete>
			<div className="gap-6 grid grid-cols-3">
				<WSDropdown
					label="Turn order"
					selectedKey={group.turnOrder}
					options={[
						{ key: 0, text: "Players first" },
						{ key: 1, text: "Enemies first" },
						{ key: 2, text: "Random" },
					]}
					onChange={value => onChange({ ...group, turnOrder: parseInt(value) })}
				/>
				<WSTextField
					label="Reward (bundle ID)"
					name="reward"
					value={group.reward}
					onChange={(_, value) => onChange({ ...group, reward: value as string })}
				/>
				<WSCheckbox
					label="Can lose"
					checked={group.canLose}
					id={`can-lose-${index}`}
					onChange={(_, value) => onChange({ ...group, canLose: value as boolean })}
				/>
				<div className="col-span-2">
					<WSTextArea
						label="Enemies"
						value={group.enemies.join("\n")}
						rows={5}
						cols={30}
						onChange={(_, value) => onChange({ ...group, enemies: (value as string).split("\n") })}
					/>
				</div>
				<ul>
					{availableEnemies.map((enemy: string, index: number) => (
						<li key={index}>
							<WSButton
								style="link"
								onClick={() => onChange({ ...group, enemies: group.enemies.concat(enemy) })}>
								{enemy}
							</WSButton>
						</li>
					))}
				</ul>
			</div>
		</EditorFormFieldList>
	);
};
