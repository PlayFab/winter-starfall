/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/reducer";
import { is } from "../../../shared/is";
import { CURRENCY_TYPE } from "../../../shared/types";
import Strings from "../../../strings";
import { ItemSingle } from "../../items/item-single";
import { Section, UlGrid } from "../../tailwind";
import { CombatResultCoins } from "./coins";

interface ICombatResultInventoryProps {
	newInventory: PlayFabEconomyModels.CatalogItemReference[] | undefined;
}

export const CombatResultInventory: React.FunctionComponent<ICombatResultInventoryProps> = ({ newInventory }) => {
	const intl = useIntl();
	const catalog = useSelector((state: AppState) => state.site.catalog);

	if (!newInventory) {
		newInventory = [];
	}

	const coins = (newInventory || [])
		.map(i => catalog.find(c => c.Id === i.Id))
		.filter(c => c?.ContentType === CURRENCY_TYPE)
		.map(c => newInventory!.find(i => i.Id === c?.Id));
	const notCoins = newInventory.filter(i => !coins.find(c => c?.Id === i.Id));

	if (is.null(newInventory)) {
		return null;
	}

	return (
		<Section
			title={intl.formatMessage({ id: Strings.items_received })}
			headerNodeRight={<CombatResultCoins catalog={catalog} coins={coins} />}>
			{!is.null(notCoins) ? (
				<UlGrid columns={1}>
					{notCoins.map((i, index) => (
						<li key={index}>
							<ItemSingle catalog={catalog} item={i} quantity={i.Amount} showQuantity />
						</li>
					))}
				</UlGrid>
			) : null}
		</Section>
	);
};
