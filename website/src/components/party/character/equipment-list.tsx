/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/reducer";
import { CinematicEventSpeaker } from "../../../shared/types";
import { PartyCharacterEquipmentListItem } from "./equipment-list-item";

interface IPartyCharacterEquipmentListProps {
	id: CinematicEventSpeaker;
	isVisible?: boolean;
}

export const PartyCharacterEquipmentList: React.FunctionComponent<IPartyCharacterEquipmentListProps> = ({
	id,
	isVisible,
}) => {
	const characterWritable = useSelector((state: AppState) =>
		state.site.userDataPlayer.party.characters.find(c => c.id === id)
	);
	const inventory = useSelector((state: AppState) => state.site.inventory);
	const catalog = useSelector((state: AppState) => state.site.catalog);

	if (!isVisible) {
		return null;
	}

	return (
		<ul className="flex flex-col gap-4">
			<li>
				<PartyCharacterEquipmentListItem
					inventory={inventory}
					id={id}
					type="weapon"
					catalog={catalog}
					item={inventory.find(i => i.Id === characterWritable?.weapon)}
				/>
			</li>
			<li>
				<PartyCharacterEquipmentListItem
					inventory={inventory}
					id={id}
					type="armor"
					catalog={catalog}
					item={inventory.find(i => i.Id === characterWritable?.armor)}
				/>
			</li>
		</ul>
	);
};
