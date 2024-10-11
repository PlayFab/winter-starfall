/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { is } from "../../../shared/is";
import { PlayerInventoryItemActions, SPELL_CONTENT_TYPE } from "../../../shared/types";
import Strings from "../../../strings";
import { WSButton } from "../../button";
import { ItemSingle } from "../../items/item-single";
import { IStorePrice, getStorePrice } from "../../store/helpers";

interface IPlayerInventoryItemProps {
	catalog: PlayFabEconomyModels.CatalogItem[];
	item: PlayFabEconomyModels.InventoryItem;
	sellMultiplier?: number;
	showQuantity?: boolean;
	actions?: PlayerInventoryItemActions[];
	onSell?: (itemId: string, amount: number) => void;
	onUse?: (itemId: string) => void;
}

export const PlayerInventoryItem: React.FunctionComponent<IPlayerInventoryItemProps> = ({
	catalog,
	item,
	actions,
	onSell,
	onUse,
	sellMultiplier,
	showQuantity,
}) => {
	const catalogItem = catalog.find(c => c.Id === item.Id);

	const onSellLocal = useCallback(() => {
		onSell!(item.Id as string, 1); // TODO: Let the user pick how many
	}, [item, onSell]);

	const onUseLocal = useCallback(() => {
		onUse!(item.Id!);
	}, [item, onUse]);

	const actionButtons = useMemo<React.ReactNode[]>(() => {
		const buttons: React.ReactNode[] = [];

		if (is.inArray(actions!, "sell")) {
			buttons.push(
				<WSButton onClick={onSellLocal} key={1}>
					<FormattedMessage id={Strings.sell} />
				</WSButton>
			);
		}

		if (is.inArray(actions!, "use")) {
			buttons.push(
				<WSButton onClick={onUseLocal} key={2}>
					<FormattedMessage id={Strings.use} />
				</WSButton>
			);
		}

		return buttons;
	}, [actions, onSellLocal, onUseLocal]);

	const sellPrices = useMemo<IStorePrice[]>(() => {
		if (!is.inArray(actions!, "sell")) {
			return [];
		}

		return getStorePrice(catalogItem?.PriceOptions, sellMultiplier);
	}, [actions, catalogItem?.PriceOptions, sellMultiplier]);

	return (
		<ItemSingle
			key={item.Id}
			catalog={catalog}
			item={item}
			actionButtons={actionButtons}
			quantity={item.Amount}
			prices={sellPrices}
			showQuantity={showQuantity && catalogItem?.ContentType !== SPELL_CONTENT_TYPE}
		/>
	);
};
