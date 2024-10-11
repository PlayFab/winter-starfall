/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/reducer";
import { CONSUMABLE_CONTENT_TYPE } from "../../shared/types";
import Strings from "../../strings";
import { WSButton } from "../button";
import { ItemSingle } from "../items/item-single";
import { WSPopup, WSPopupCloseButton } from "../popups";
import { H1PopupTitle, HeaderPopup, UlGrid } from "../tailwind";

interface IProps {
	isVisible: boolean;

	onSelect: (itemId: string) => void;
	onDismiss: () => void;
}

export const CombatItemPopup: React.FunctionComponent<IProps> = ({ isVisible, onDismiss, onSelect }) => {
	const inventoryRaw = useSelector((state: AppState) => state.site.inventory);
	const catalog = useSelector((state: AppState) => state.site.catalog);

	const inventory = inventoryRaw
		.map(i => catalog.find(c => c.Id === i.Id))
		.filter(i => i?.ContentType === CONSUMABLE_CONTENT_TYPE)
		.map(i => inventoryRaw.find(v => v.Id === i?.Id));

	return (
		<WSPopup isOpen={isVisible} isBlocking={false} onDismiss={onDismiss}>
			<HeaderPopup>
				<H1PopupTitle>
					<FormattedMessage id={Strings.combat_use_item_popup_header} />
				</H1PopupTitle>
				<WSPopupCloseButton onDismiss={onDismiss} />
			</HeaderPopup>
			<div className="p-4">
				{inventory.length === 0 && (
					<p>
						<FormattedMessage id={Strings.inventory_none} />
					</p>
				)}
				<UlGrid columns={1}>
					{inventory.map((item, index) => (
						<li key={index}>
							<ItemSingle
								catalog={catalog}
								item={item as PlayFabEconomyModels.CatalogItemReference}
								showQuantity
								quantity={item?.Amount}
								actionButtons={[
									<WSButton key={0} onClick={() => onSelect(item?.Id as string)}>
										<FormattedMessage id={Strings.use} />
									</WSButton>,
								]}
							/>
						</li>
					))}
				</UlGrid>
			</div>
		</WSPopup>
	);
};
