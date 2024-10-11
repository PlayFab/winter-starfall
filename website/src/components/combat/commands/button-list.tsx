/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/reducer";
import { CombatActionType } from "../../../shared/types";
import { WSButton } from "../../button";
import { getCharacterActionName, getCharacterActionOptions } from "../helpers";

interface ICombatActionBarOptionsProps {
	id: number;
	selectedAction: CombatActionType;
	setSelectedAction: (actionType: CombatActionType) => void;
}

export const CombatCommandBarButtonList: React.FunctionComponent<ICombatActionBarOptionsProps> = ({
	id,
	selectedAction,
	setSelectedAction,
}) => {
	const intl = useIntl();
	const checkpoints = useSelector((state: AppState) => state.site.userDataReadOnly.completed.checkpoints);
	const actions = getCharacterActionOptions(id, checkpoints);

	if (selectedAction !== CombatActionType.None) {
		return null;
	}

	return (
		<ul className="flex flex-wrap gap-3">
			{actions.map(action => {
				const onClick = () => {
					setSelectedAction(action);
				};

				return (
					<li key={action}>
						<WSButton onClick={onClick} disabled={selectedAction === action} className="w-24">
							{getCharacterActionName(action, intl)}
						</WSButton>
					</li>
				);
			})}
		</ul>
	);
};
