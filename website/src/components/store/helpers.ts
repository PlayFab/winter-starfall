/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { is } from "../../shared/is";

export function canAfford(
	item: PlayFabEconomyModels.CatalogItem,
	quantity: number,
	playerCurrencies: PlayFabEconomyModels.InventoryItem[]
): boolean {
	let localCanAfford = false;

	item.PriceOptions?.Prices?.forEach(p => {
		if (localCanAfford) {
			return;
		}

		p.Amounts?.forEach(a => {
			if (localCanAfford) {
				return;
			}

			if (playerCurrencies.find(c => c.Id === a.ItemId && (c.Amount || 0) >= a.Amount * quantity)) {
				localCanAfford = true;
			}
		});
	});

	return localCanAfford;
}

export interface IStorePrice {
	amount: number;
	itemId: string;
}

export function getStorePrice(
	priceOptions: PlayFabEconomyModels.CatalogPriceOptions | undefined,
	multiplier: number = 1
): IStorePrice[] {
	let prices: IStorePrice[] = [];

	if (!is.null(priceOptions)) {
		priceOptions!.Prices?.forEach(price => {
			prices = prices.concat(
				price.Amounts?.map(
					amount => ({ amount: Math.ceil(amount.Amount * multiplier), itemId: amount.ItemId }) as IStorePrice
				) || []
			);
		});
	}

	return prices;
}

export function getItemImage(catalog: PlayFabEconomyModels.CatalogItem[], itemId: string): string | undefined {
	return catalog.find(c => c.Id === itemId)?.Images?.find(i => !is.null(i.Url))?.Url;
}
