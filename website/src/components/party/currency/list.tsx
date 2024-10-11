/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/reducer";
import { is } from "../../../shared/is";
import { CURRENCY_TYPE, IPropsClassName } from "../../../shared/types";
import { PlayerCurrencySingle } from "./list-item";

interface IPlayerCurrencyListProps extends IPropsClassName {
	filterToCurrencyIds?: string[];
}

export const PlayerCurrencyList: React.FunctionComponent<IPlayerCurrencyListProps> = ({
	filterToCurrencyIds,
	className,
}) => {
	const catalog = useSelector((state: AppState) => state.site.catalog);
	const playerCurrencies = useSelector((state: AppState) => state.site.inventory).filter(
		i => i.Type === CURRENCY_TYPE
	);

	const displayCurrencies = is.null(filterToCurrencyIds)
		? playerCurrencies
		: playerCurrencies.filter(currency => is.inArray(filterToCurrencyIds as string[], currency.Id));

	return (
		<ul className={className}>
			{displayCurrencies.map(currency => (
				<li key={currency.Id} className="mt-2 first:mt-0">
					<PlayerCurrencySingle amount={currency.Amount} catalog={catalog} currency={currency} />
				</li>
			))}
		</ul>
	);
};
