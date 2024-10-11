/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { is } from "../../../shared/is";
import { PlayerCurrencySingle } from "../../party/currency/list-item";

interface ICombatResultCoinsProps {
	coins: (PlayFabEconomyModels.InventoryItem | undefined)[];
	catalog: PlayFabEconomyModels.CatalogItem[];
}

export const CombatResultCoins: React.FunctionComponent<ICombatResultCoinsProps> = ({ coins, catalog }) => {
	if (is.null(coins)) {
		return null;
	}

	return <PlayerCurrencySingle amount={coins![0]?.Amount} catalog={catalog} currency={coins[0]!} />;
};
