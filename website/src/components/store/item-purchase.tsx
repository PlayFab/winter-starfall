/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { usePopups } from "../../hooks/use-popups";
import { useEconomyStoreSinglePurchase } from "../../hooks/use-store";
import { AppState } from "../../redux/reducer";
import { getCatalogItemName } from "../../shared/helpers";
import { CURRENCY_TYPE } from "../../shared/types";
import Strings from "../../strings";
import { WSButton } from "../button";
import { Errors } from "../errors";
import { ItemSingle } from "../items/item-single";
import { ItemPurchasePrices } from "../items/purchase-prices";
import { WSLabel } from "../label";
import { PlayerCurrencyList } from "../party/currency/list";
import { WSPopup, WSPopupCloseButton } from "../popups";
import { DivConfirmFooter, H1PopupTitle, HeaderPopup, UlConfirmButtons } from "../tailwind";
import { WSTextField } from "../text-field";
import { IStorePrice, canAfford } from "./helpers";

const purchasePopupId = "purchase";

interface IStorePurchaseProps {
	prices: IStorePrice[];
	store: PlayFabEconomyModels.CatalogItem;
	item: PlayFabEconomyModels.CatalogItem;
	catalog: PlayFabEconomyModels.CatalogItem[];
	isLoading: boolean;
}

export const StoreItemPurchase: React.FunctionComponent<IStorePurchaseProps> = ({ prices, catalog, item, store }) => {
	const intl = useIntl();
	const { isLoading, error, onPurchase, quantity, onChange } = useEconomyStoreSinglePurchase(store);
	const { hide, show, isVisible } = usePopups();
	const playerCurrencies = useSelector((state: AppState) => state.site.inventory).filter(
		i => i.Type === CURRENCY_TYPE
	);

	const resetQuantity = useCallback(() => {
		onChange("quantity", 1);
	}, [onChange]);

	const onPurchasePopup = useCallback(() => {
		show(purchasePopupId);
	}, [show]);

	const onPurchaseConfirm = useCallback(() => {
		onPurchase!(item.Id as string, quantity).then(() => {
			hide(purchasePopupId);
			resetQuantity();
		});
	}, [hide, item.Id, onPurchase, quantity, resetQuantity]);

	const onDismiss = useCallback(() => {
		if (isLoading) {
			return;
		}

		resetQuantity();
		hide(purchasePopupId);
	}, [hide, isLoading, resetQuantity]);

	const canAffordItem = useMemo(
		() => canAfford(item, quantity, playerCurrencies),
		[item, playerCurrencies, quantity]
	);

	const multipliedPrices = useMemo<IStorePrice[]>(
		() => prices.map(p => ({ ...p, amount: p.amount * quantity })),
		[prices, quantity]
	);

	return (
		<>
			<WSButton onClick={onPurchasePopup} disabled={!canAffordItem}>
				<FormattedMessage id={Strings.buy} />
			</WSButton>
			<WSPopup
				onDismiss={onDismiss}
				isOpen={isVisible(purchasePopupId)}
				isBlocking={false}
				styles={{ main: { maxWidth: "512px" } }}>
				<HeaderPopup>
					<H1PopupTitle>
						<FormattedMessage id={Strings.buy_this_item} />
					</H1PopupTitle>
					<WSPopupCloseButton onDismiss={onDismiss} />
				</HeaderPopup>
				<div className="p-4">
					<Errors error={error} />
					<ItemSingle catalog={catalog} item={item} prices={prices} />
				</div>
				<div className="flex justify-between p-4">
					<div>
						<div className="flex gap-6">
							<WSTextField
								label={intl.formatMessage({ id: Strings.quantity })}
								type="number"
								name="quantity"
								min={1}
								value={quantity.toString()}
								onChange={onChange}
								disabled={isLoading}
								className="!w-20"
							/>
							<div>
								<WSLabel htmlFor="">
									<FormattedMessage id={Strings.total_cost} />
								</WSLabel>
								<ItemPurchasePrices prices={multipliedPrices} catalog={catalog} className="mt-2" />
							</div>
						</div>
					</div>
					<div>
						<WSLabel htmlFor="">
							<FormattedMessage id={Strings.your_currency} />
						</WSLabel>
						<PlayerCurrencyList filterToCurrencyIds={prices.map(p => p.itemId)} className="mt-2" />
					</div>
				</div>
				<DivConfirmFooter>
					<UlConfirmButtons>
						<WSButton
							onClick={onPurchaseConfirm}
							disabled={!canAffordItem || isLoading}
							isLoading={isLoading}>
							<FormattedMessage
								id={Strings.buy_for_price_button}
								values={{ name: getCatalogItemName(catalog, item.Id) }}
							/>
						</WSButton>
						<WSButton onClick={onDismiss} disabled={isLoading} style="light">
							<FormattedMessage id={Strings.cancel} />
						</WSButton>
					</UlConfirmButtons>
				</DivConfirmFooter>
			</WSPopup>
		</>
	);
};
