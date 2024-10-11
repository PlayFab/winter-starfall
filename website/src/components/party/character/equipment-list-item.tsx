/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { usePopups } from "../../../hooks/use-popups";
import { siteSlice } from "../../../redux/slice-site";
import {
	combineClassNames,
	getCharacterEquipmentTags,
	getItemImageUrl,
	getItemNeutralName,
} from "../../../shared/helpers";
import { is } from "../../../shared/is";
import {
	ARMOR_CONTENT_TYPE,
	CinematicEventSpeaker,
	PartyCharacterEquipmentType,
	WEAPON_CONTENT_TYPE,
} from "../../../shared/types";
import Strings from "../../../strings";
import { WSButton } from "../../button";
import { PartyCharacterEquipmentPopup } from "../equipment-popup";

const heightAndWidth = "h-10 w-10";

interface IPartyCharacterEquipmentProps {
	id: CinematicEventSpeaker;
	type: PartyCharacterEquipmentType;
	item: PlayFabEconomyModels.InventoryItem | undefined;
	catalog: PlayFabEconomyModels.CatalogItem[];
	inventory: PlayFabEconomyModels.InventoryItem[];
}

const characterPopupId = "character";

export const PartyCharacterEquipmentListItem: React.FunctionComponent<IPartyCharacterEquipmentProps> = ({
	id,
	catalog,
	item,
	type,
	inventory,
}) => {
	const intl = useIntl();
	const dispatch = useDispatch();
	const { show, hide, isVisible } = usePopups();
	const [catalogSubset, setCatalogSubset] = useState<PlayFabEconomyModels.CatalogItem[]>([]);

	let titleStringId = "";
	let noneStringId = "";
	let catalogFilterContentType = "";
	const catalogFilterTags = getCharacterEquipmentTags(id, type);
	const catalogItem = catalog.find(c => c.Id === item?.Id);
	const catalogItemName = getItemNeutralName(catalogItem);

	switch (type) {
		case "armor":
			noneStringId = Strings.no_armor;
			titleStringId = Strings.armor_singular;
			catalogFilterContentType = ARMOR_CONTENT_TYPE;
			break;
		case "weapon":
			noneStringId = Strings.no_weapon;
			titleStringId = Strings.weapon_singular;
			catalogFilterContentType = WEAPON_CONTENT_TYPE;
			break;
	}

	const onEquip = useCallback(
		(itemId: string) => {
			dispatch(siteSlice.actions.characterEquip({ id, type, itemId }));
			hide(characterPopupId);
		},
		[dispatch, hide, id, type]
	);

	const onDismiss = useCallback(() => {
		hide(characterPopupId);
	}, [hide]);

	const onShow = useCallback(() => {
		setCatalogSubset(
			catalog
				.filter(c => c.ContentType === catalogFilterContentType)
				.filter(c => c.Tags?.find(t => is.inArray(catalogFilterTags, t)))
				.filter(c => inventory.find(i => i.Id === c.Id))
		);
		show(characterPopupId);
	}, [catalog, catalogFilterContentType, catalogFilterTags, inventory, show]);

	return (
		<>
			<div title={intl.formatMessage({ id: titleStringId })}>
				{is.null(item) ? (
					<div className="flex items-center gap-2 pb-1">
						<WSButton onClick={onShow} style="light">
							<FormattedMessage id={noneStringId} />
						</WSButton>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<WSButton style="link" onClick={onShow} className="shrink-0">
							<img
								src={getItemImageUrl(catalogItem)}
								alt={catalogItemName}
								title={catalogItemName}
								className={combineClassNames(heightAndWidth)}
							/>
						</WSButton>
						<WSButton style="link" onClick={onShow} className="font-semibold text-left">
							{catalogItemName}
						</WSButton>
					</div>
				)}
			</div>
			<PartyCharacterEquipmentPopup
				catalog={catalogSubset}
				currentlyEquippedId={item?.Id}
				isVisible={isVisible(characterPopupId)}
				onDismiss={onDismiss}
				onEquip={onEquip}
			/>
		</>
	);
};
