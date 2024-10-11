/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedNumber, useIntl } from "react-intl";
import {
	combineClassNames,
	getItemImageUrl,
	getItemNeutralDescription,
	getItemNeutralName,
} from "../../shared/helpers";
import { is } from "../../shared/is";
import Strings from "../../strings";
import { IStorePrice } from "../store/helpers";
import { ItemEffectList } from "./effect-list";
import { ItemPurchasePrices } from "./purchase-prices";

interface IProps {
	catalog: PlayFabEconomyModels.CatalogItem[];
	item: PlayFabEconomyModels.CatalogItemReference;
	actionButtons?: React.ReactNode[];
	quantity?: number;
	prices?: IStorePrice[];
	showQuantity?: boolean;
}

export const ItemSingle: React.FunctionComponent<IProps> = ({
	catalog,
	item,
	quantity,
	actionButtons,
	prices,
	showQuantity,
}) => {
	const intl = useIntl();
	const catalogItem = catalog.find(c => c.Id === item.Id);
	const name = getItemNeutralName(catalogItem);
	const description = getItemNeutralDescription(catalogItem);
	const imageUrl = getItemImageUrl(catalogItem);
	const showPrices = !is.null(prices);

	return (
		<div className="flex">
			<div className="relative shrink-0">
				<img src={imageUrl} alt={name} className="h-24 w-24 md:h-32 md:w-32" />
				{showQuantity && !is.null(quantity) && (quantity as number) > 0 && (
					<span
						className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-solid border-gray-300 bg-white text-sm font-semibold"
						title={intl.formatMessage({ id: Strings.quantity_count }, { count: quantity })}
						aria-label={intl.formatMessage({ id: Strings.quantity_count }, { count: quantity })}>
						<FormattedNumber value={quantity as number} />
					</span>
				)}
			</div>
			<div className="ml-4 grow">
				<h3 className="font-bold">{name}</h3>
				{!is.null(description) && <p className="text-xs leading-4 text-gray-700">{description}</p>}
				<div
					className={combineClassNames(
						"flex flex-wrap items-center gap-x-6 gap-y-2 md:flex-nowrap",
						is.null(actionButtons) ? "mt-2" : "mt-4"
					)}>
					{!is.null(actionButtons) && (
						<ul>
							{actionButtons?.map((button, index) => (
								<li key={index} className="mr-2 last:mr-0">
									{button}
								</li>
							))}
						</ul>
					)}
					{showPrices && <ItemPurchasePrices prices={prices!} catalog={catalog} />}
					<ItemEffectList item={catalogItem} />
				</div>
			</div>
		</div>
	);
};
