/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage } from "react-intl";
import { is } from "../../shared/is";
import Strings from "../../strings";
import { WSButton } from "../button";
import { ItemSingle } from "../items/item-single";
import { WSPopup, WSPopupCloseButton } from "../popups";
import { H1PopupTitle, HeaderPopup, PNone, UlGrid } from "../tailwind";

interface IProps {
	catalog: PlayFabEconomyModels.CatalogItem[];
	currentlyEquippedId: string | undefined;
	isVisible: boolean;
	onDismiss: () => void;
	onEquip: (item: string) => void;
}

export const PartyCharacterEquipmentPopup: React.FunctionComponent<IProps> = ({
	catalog,
	currentlyEquippedId,
	isVisible,
	onDismiss,
	onEquip,
}) => {
	return (
		<WSPopup isOpen={isVisible} isBlocking={false} onDismiss={onDismiss}>
			<HeaderPopup>
				<H1PopupTitle>
					<FormattedMessage id={Strings.equipment_select} />
				</H1PopupTitle>
				<WSPopupCloseButton onDismiss={onDismiss} />
			</HeaderPopup>
			<div className="p-4">
				{is.null(catalog) ? (
					<PNone>
						<FormattedMessage id={Strings.inventory_none} />
					</PNone>
				) : (
					<UlGrid columns={2}>
						{catalog.map((item, index) => (
							<li key={index}>
								<ItemSingle
									catalog={catalog}
									item={item}
									actionButtons={
										currentlyEquippedId === item.Id
											? [
													<WSButton key={0} onClick={() => onEquip("")}>
														<FormattedMessage id={Strings.unequip} />
													</WSButton>,
												]
											: [
													<WSButton key={0} onClick={() => onEquip(item.Id as string)}>
														<FormattedMessage id={Strings.equip} />
													</WSButton>,
												]
									}
								/>
							</li>
						))}
					</UlGrid>
				)}
			</div>
		</WSPopup>
	);
};
