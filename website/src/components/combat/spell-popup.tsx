/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/reducer";
import { IEconomySpell, PlayerCharacterCombat, SPELL_CONTENT_TYPE } from "../../shared/types";
import Strings from "../../strings";
import { WSButton } from "../button";
import { ItemSingle } from "../items/item-single";
import { WSPopup, WSPopupCloseButton } from "../popups";
import { H1PopupTitle, HeaderPopup, UlGrid } from "../tailwind";

interface IProps {
	isVisible: boolean;
	combatant: PlayerCharacterCombat | undefined;
	onSelect: (spellId: string) => void;
	onDismiss: () => void;
}

export const CombatSpellPopup: React.FunctionComponent<IProps> = ({ isVisible, onDismiss, onSelect, combatant }) => {
	const character = useSelector((state: AppState) => state.site.userDataReadOnly.party.characters).find(
		c => c.id === combatant?.id
	);
	const inventoryRaw = useSelector((state: AppState) => state.site.inventory);
	const catalog = useSelector((state: AppState) => state.site.catalog);

	const inventory = inventoryRaw
		.map(i => catalog.find(c => c.Id === i.Id))
		.filter(i => i?.ContentType === SPELL_CONTENT_TYPE)
		.map(i => inventoryRaw.find(v => v.Id === i?.Id));

	return (
		<WSPopup isOpen={isVisible} isBlocking={false} onDismiss={onDismiss}>
			<HeaderPopup>
				<H1PopupTitle>
					<FormattedMessage id={Strings.combat_use_spell_popup_header} />
				</H1PopupTitle>
				<WSPopupCloseButton onDismiss={onDismiss} />
			</HeaderPopup>
			<div className="p-4">
				{inventory.length === 0 && (
					<p>
						<FormattedMessage id={Strings.spells_none} />
					</p>
				)}
				<UlGrid columns={1}>
					{inventory.map((item, index) => {
						const catalogItem = catalog.find(c => c.Id === item?.Id);
						const mpCost = (catalogItem?.DisplayProperties as IEconomySpell).mp;

						return (
							<li key={index}>
								<ItemSingle
									catalog={catalog}
									item={item as PlayFabEconomyModels.CatalogItemReference}
									quantity={item?.Amount}
									actionButtons={[
										<WSButton
											key={0}
											onClick={() => onSelect(item?.Id as string)}
											disabled={(character?.mp as number) < mpCost}>
											<FormattedMessage id={Strings.cast} />
										</WSButton>,
									]}
								/>
							</li>
						);
					})}
				</UlGrid>
			</div>
		</WSPopup>
	);
};
