/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import { getCharacterName } from "../../../shared/helpers";
import { is } from "../../../shared/is";
import { CombatActionType, PlayerCharacterCombat } from "../../../shared/types";
import { CinematicEventSpeakerImage } from "../../cinematics/images";
import { DivCard, H2Left } from "../../tailwind";
import { CombatCommandBarButtonList } from "./button-list";
import { CombatCommandBarCancelMessage } from "./cancel-message";

interface ICombatActionBarProps {
	characterWhoseTurnItIs: PlayerCharacterCombat | undefined;
	hasTakenTurn: boolean;
	selectedAction: CombatActionType;
	selectedItem: string | undefined;
	selectedSpell: string | undefined;
	setSelectedAction: (actionType: CombatActionType) => void;
}

export const CombatCommandBar: React.FunctionComponent<ICombatActionBarProps> = ({
	characterWhoseTurnItIs,
	hasTakenTurn,
	selectedAction,
	selectedItem,
	selectedSpell,
	setSelectedAction,
}) => {
	const intl = useIntl();
	const onCancel = useCallback(() => {
		setSelectedAction(CombatActionType.None);
	}, [setSelectedAction]);

	if (is.null(characterWhoseTurnItIs) || hasTakenTurn) {
		return <div className="h-combatActionBar" />;
	}

	return (
		<div className="sticky bottom-0 pb-4">
			<DivCard>
				<div className="flex gap-4">
					<div className="shrink-0">
						<CinematicEventSpeakerImage
							speaker={characterWhoseTurnItIs?.id}
							className="mt-2 h-36 w-36 rounded-bl-xl rounded-tl-xl"
						/>
					</div>
					<div className="grow">
						<H2Left className="basis-full">{getCharacterName(characterWhoseTurnItIs?.id, intl)}</H2Left>
						<div className="mt-4 basis-full">
							<CombatCommandBarCancelMessage
								onCancel={onCancel}
								selectedAction={selectedAction}
								selectedItem={selectedItem}
								selectedSpell={selectedSpell}
							/>
							<CombatCommandBarButtonList
								id={characterWhoseTurnItIs?.id as number}
								selectedAction={selectedAction}
								setSelectedAction={setSelectedAction}
							/>
						</div>
					</div>
				</div>
			</DivCard>
		</div>
	);
};
