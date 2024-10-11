/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedNumber } from "react-intl";
import { getItemImageUrl, getItemNeutralName } from "../../../shared/helpers";

interface IPlayerCurrencySingleProps {
	catalog: PlayFabEconomyModels.CatalogItem[];
	currency: PlayFabEconomyModels.InventoryItem | PlayFabEconomyModels.CatalogItem;
	amount: number | undefined;
}

export const PlayerCurrencySingle: React.FunctionComponent<IPlayerCurrencySingleProps> = ({
	amount,
	currency,
	catalog,
}) => {
	const currencyCatalogItem = catalog.find(c => c.Id === currency.Id);
	const name = getItemNeutralName(currencyCatalogItem);
	const imageUrl = getItemImageUrl(currencyCatalogItem);

	return (
		<div className="flex items-center">
			<img src={imageUrl} alt={name} title={name} aria-label={name} className="mr-2 inline-block h-8 w-auto" />
			<span className="mr-1 inline-block font-semibold">
				<FormattedNumber value={amount as number} />
			</span>
		</div>
	);
};
