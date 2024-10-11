/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { is } from "../../../shared/is";
import { CombatActionType } from "../../../shared/types";
import Strings from "../../../strings";
import { WSButton } from "../../button";

interface ICombatActionBarSelectedProps {
	selectedAction: CombatActionType;
	selectedItem: string | undefined;
	selectedSpell: string | undefined;

	onCancel: () => void;
}

export const CombatCommandBarCancelMessage: React.FunctionComponent<ICombatActionBarSelectedProps> = ({
	onCancel,
	selectedAction,
	selectedSpell,
	selectedItem,
}) => {
	const intl = useIntl();

	switch (selectedAction) {
		case CombatActionType.Attack:
			return (
				<CombatCommandBarSelectedMessage
					message={intl.formatMessage({ id: Strings.combat_attack_hint })}
					onClick={onCancel}
				/>
			);
		case CombatActionType.Defend:
			return (
				<CombatCommandBarSelectedMessage
					message={intl.formatMessage({ id: Strings.combat_defend_hint })}
					onClick={onCancel}
				/>
			);
		case CombatActionType.Item:
			if (is.null(selectedItem)) {
				return (
					<CombatCommandBarSelectedMessage
						message={intl.formatMessage({ id: Strings.combat_use_item_popup_header })}
						onClick={onCancel}
					/>
				);
			}

			return (
				<CombatCommandBarSelectedMessage
					message={intl.formatMessage({ id: Strings.combat_item_hint })}
					onClick={onCancel}
				/>
			);
		case CombatActionType.Spell:
			if (is.null(selectedSpell)) {
				return (
					<CombatCommandBarSelectedMessage
						message={intl.formatMessage({ id: Strings.combat_use_spell_popup_header })}
						onClick={onCancel}
					/>
				);
			}

			return (
				<CombatCommandBarSelectedMessage
					message={intl.formatMessage({ id: Strings.combat_spell_hint })}
					onClick={onCancel}
				/>
			);
		default:
			return null;
	}
};

interface ICombatActionBarSelectedMessageProps {
	message: string;
	onClick?: () => void;
}

const CombatCommandBarSelectedMessage: React.FunctionComponent<ICombatActionBarSelectedMessageProps> = ({
	onClick,
	message,
}) => {
	if (is.null(onClick)) {
		return null;
	}

	return (
		<div className="flex items-baseline gap-4">
			<WSButton onClick={onClick!} style="light">
				<FormattedMessage id={Strings.cancel_combat_command} values={{ action: message }} />
			</WSButton>
		</div>
	);
};
