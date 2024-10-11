/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/reducer";
import { CombatItem, CombatantBase } from "../../../shared/combat-classes";
import { getCatalogItemName, getCombatCharacters } from "../../../shared/helpers";
import { is } from "../../../shared/is";
import { CombatantType, PlayerCharacterCombat } from "../../../shared/types";
import Strings from "../../../strings";
import { ItemSingle } from "../../items/item-single";
import { WSPopup, WSPopupCloseButton } from "../../popups";
import { H1PopupTitle, HeaderPopup, UlGrid } from "../../tailwind";
import { PartyCharacter } from "../character/character";
interface IPlayerInventoryCharacterListPopupProps {
	itemId: string;
	isVisible: boolean;

	onDismiss: () => void;
	onUse?: (characterId: number) => void;
}

export const PlayerInventoryCharacterListPopup: React.FunctionComponent<IPlayerInventoryCharacterListPopupProps> = ({
	isVisible,
	itemId,
	onDismiss,
	onUse,
}) => {
	const catalog = useSelector((state: AppState) => state.site.catalog);
	const inventory = useSelector((state: AppState) => state.site.inventory);
	const charactersWriteable = useSelector((state: AppState) => state.site.userDataPlayer.party.characters);
	const charactersReadOnly = useSelector((state: AppState) => state.site.userDataReadOnly.party.characters).filter(
		c => c.available
	);
	const characters = useMemo<PlayerCharacterCombat[]>(
		() => getCombatCharacters(charactersWriteable, charactersReadOnly),
		[charactersReadOnly, charactersWriteable]
	);

	const isInCombat = useSelector((state: AppState) => state.site.combatHistory).length > 0;

	const item = useMemo(() => inventory.find(i => i.Id === itemId)!, [inventory, itemId]);
	const combatItem = useMemo(() => new CombatItem(itemId, catalog, inventory), [catalog, inventory, itemId]);

	if (is.null(item)) {
		return null;
	}

	return (
		<WSPopup isOpen={isVisible} isBlocking={false} onDismiss={onDismiss}>
			<HeaderPopup>
				<H1PopupTitle>
					<FormattedMessage
						id={Strings.use_item_popup_title}
						values={{ name: getCatalogItemName(catalog, itemId) }}
					/>
				</H1PopupTitle>
				<WSPopupCloseButton onDismiss={onDismiss} />
			</HeaderPopup>
			<div className="w-screen max-w-full">
				<div className="p-4">
					<ItemSingle catalog={catalog} item={item} showQuantity quantity={item.Amount} />
				</div>
				<UlGrid columns={2} className="bg-gray-100 p-4">
					{characters.map((c, index) => {
						let canBeSelected = combatItem.canBeUsedOn(
							new CombatantBase({ id: c.id, type: CombatantType.Character }, c, catalog)
						);

						if (isInCombat) {
							canBeSelected = false;
						}
						return (
							<li key={index}>
								<PartyCharacter id={c.id} onSelect={canBeSelected ? onUse : undefined} />
							</li>
						);
					})}
				</UlGrid>
			</div>
		</WSPopup>
	);
};
