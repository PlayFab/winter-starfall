/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { IPropsClassName } from "../../shared/types";
import { PlayerCurrencySingle } from "../party/currency/list-item";
import { IStorePrice } from "../store/helpers";

interface IItemPurchasePricesProps extends IPropsClassName {
	prices: IStorePrice[];
	catalog: PlayFabEconomyModels.CatalogItem[];
}

export const ItemPurchasePrices: React.FunctionComponent<IItemPurchasePricesProps> = ({
	catalog,
	prices,
	className,
}) => (
	<ul className={className}>
		{prices.map(price => (
			<li key={price.itemId}>
				<PlayerCurrencySingle amount={price.amount} catalog={catalog} currency={{ Id: price.itemId }} />
			</li>
		))}
	</ul>
);
