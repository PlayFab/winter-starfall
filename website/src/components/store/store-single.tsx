/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useEconomyStoreSingle } from "../../hooks/use-store";
import { AppState } from "../../redux/reducer";
import { getItemNeutralName } from "../../shared/helpers";
import { is } from "../../shared/is";
import { Errors } from "../errors";
import { ItemSingle } from "../items/item-single";
import { Loading } from "../loading";
import { PlayerCurrencyList } from "../party/currency/list";
import { Section, UlGrid } from "../tailwind";
import { getStorePrice } from "./helpers";
import { StoreItemPurchase } from "./item-purchase";

interface IProps {
	storeName: string;
	description?: string;
}

export const StoreSingle: React.FunctionComponent<IProps> = ({ storeName, description }) => {
	const { isLoading, store, error } = useEconomyStoreSingle(storeName);
	const catalog = useSelector((state: AppState) => state.site.catalog);

	const currenciesUsedInStore = useMemo<string[]>(() => {
		let currencyIds: string[] = [];

		if (is.null(store) || is.null(store?.ItemReferences)) {
			return currencyIds;
		}

		currencyIds =
			store?.ItemReferences?.reduce((list, item) => {
				const prices = getStorePrice(item.PriceOptions).filter(price => !is.inArray(list, price.itemId));

				return list.concat(prices.map(price => price.itemId));
			}, currencyIds) || [];

		return currencyIds;
	}, [store]);

	if (isLoading) {
		return <Loading isLoading={isLoading} />;
	}

	return (
		<Section
			title={getItemNeutralName(store)}
			description={description}
			headerNodeRight={<PlayerCurrencyList filterToCurrencyIds={currenciesUsedInStore} />}>
			<Errors error={error} />
			<UlGrid columns={1} className="gap-y-12">
				{store?.ItemReferences?.map((item, index) => (
					<li key={index}>
						<ItemSingle
							catalog={catalog}
							item={item}
							prices={getStorePrice(item.PriceOptions)}
							actionButtons={[
								<StoreItemPurchase
									key={0}
									item={item}
									store={store}
									catalog={catalog}
									prices={getStorePrice(item.PriceOptions)}
									isLoading={isLoading}
								/>,
							]}
						/>
					</li>
				))}
			</UlGrid>
		</Section>
	);
};
