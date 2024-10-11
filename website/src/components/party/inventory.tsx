/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { usePopups } from "../../hooks/use-popups";
import { AppState } from "../../redux/reducer";
import { siteSlice } from "../../redux/slice-site";
import { is } from "../../shared/is";
import { ANIMATION_TIME_WATCH_BAR_FILL, PlayerInventoryItemActions } from "../../shared/types";
import Strings from "../../strings";
import { PNone, Section, UlGrid } from "../tailwind";
import { PlayerInventoryCharacterListPopup } from "./inventory/character-list-popup";
import { PlayerInventoryItem } from "./inventory/item";

interface IPlayerInventoryProps {
	title: string;
	items: PlayFabEconomyModels.InventoryItem[];
	actions?: PlayerInventoryItemActions[];
	sectionHeaderNodeRight?: React.ReactNode;
	onSell?: (itemId: string, amount: number) => void;
}

const characterPopupId = "characters";

export const PlayerInventory: React.FunctionComponent<IPlayerInventoryProps> = ({
	title,
	items,
	actions,
	sectionHeaderNodeRight,
	onSell,
}) => {
	const dispatch = useDispatch();
	const catalog = useSelector((state: AppState) => state.site.catalog);
	const sellMultiplier = useSelector((state: AppState) => state.site.multipliers.sell);
	const isInCombat = useSelector((state: AppState) => state.site.combatHistory).length > 0;
	const { hide, show, isVisible } = usePopups();

	const [isBeingUsed, setIsBeingUsed] = useState(false);
	const [itemIdToUse, setItemIdToUse] = useState<string>("");

	const localActions = isInCombat ? actions?.filter(a => a !== "use") : actions;

	const onUse = useCallback(
		(itemId: string) => {
			setItemIdToUse(itemId);
			show(characterPopupId);
		},
		[show]
	);

	const onDismiss = useCallback(() => {
		hide(characterPopupId);
		setItemIdToUse("");
		setIsBeingUsed(false);
	}, [hide]);

	const onUseCharacter = useCallback(
		(characterId: number) => {
			dispatch(siteSlice.actions.combatItemUse({ character: characterId, itemId: itemIdToUse }));
			setIsBeingUsed(true);

			setTimeout(() => {
				onDismiss();
			}, ANIMATION_TIME_WATCH_BAR_FILL);
		},
		[dispatch, itemIdToUse, onDismiss]
	);

	return (
		<>
			<Section title={title} headerNodeRight={sectionHeaderNodeRight}>
				<UlGrid columns={3}>
					{is.null(items) ? (
						<PNone>
							<FormattedMessage id={Strings.inventory_none} />
						</PNone>
					) : (
						items.map(item => (
							<li key={item.Id}>
								<PlayerInventoryItem
									catalog={catalog}
									item={item}
									actions={localActions}
									onSell={onSell}
									onUse={onUse}
									sellMultiplier={sellMultiplier}
									showQuantity
								/>
							</li>
						))
					)}
				</UlGrid>
			</Section>
			<PlayerInventoryCharacterListPopup
				isVisible={isVisible(characterPopupId)}
				itemId={itemIdToUse}
				onDismiss={onDismiss}
				onUse={isBeingUsed ? undefined : onUseCharacter}
			/>
		</>
	);
};
