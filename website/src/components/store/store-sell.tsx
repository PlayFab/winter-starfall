/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { usePopups } from "../../hooks/use-popups";
import { useEconomyStoreSell } from "../../hooks/use-store";
import { AppState } from "../../redux/reducer";
import { CURRENCY_TYPE } from "../../shared/types";
import Strings from "../../strings";
import { WSButton } from "../button";
import { Errors } from "../errors";
import { ItemSingle } from "../items/item-single";
import { PlayerInventory } from "../party/inventory";
import { WSPopup, WSPopupCloseButton } from "../popups";
import { DivConfirmFooter, H1PopupTitle, HeaderPopup, Section, UlConfirmButtons } from "../tailwind";
import { WSTextField } from "../text-field";
import { getStorePrice } from "./helpers";

const sellPopupId = "sell";

export const StoreSell: React.FunctionComponent = () => {
	const intl = useIntl();
	const { hide, show, isVisible } = usePopups();
	const { isLoading, error, onSell } = useEconomyStoreSell();
	const catalog = useSelector((state: AppState) => state.site.catalog);
	const [sellItemId, setSellItemId] = useState("");
	const [sellAmount, setSellAmount] = useState(1);
	const inventory = useSelector((state: AppState) => state.site.inventory).filter(
		item => item.Type !== CURRENCY_TYPE
	);
	const sellMultiplier = useSelector((state: AppState) => state.site.multipliers.sell);

	const itemToSell = inventory.find(i => i.Id === sellItemId);
	const catalogItem = catalog.find(i => i.Id === sellItemId);

	const onSellLocal = useCallback(
		(itemId: string, amount: number) => {
			setSellItemId(itemId);
			setSellAmount(amount);
			show(sellPopupId);
		},
		[show]
	);

	const onDismiss = useCallback(() => {
		if (isLoading) {
			return;
		}

		hide(sellPopupId);
	}, [hide, isLoading]);

	const onSellConfirm = useCallback(() => {
		onSell(sellItemId, sellAmount).then(() => {
			hide(sellPopupId);
		});
	}, [hide, onSell, sellAmount, sellItemId]);

	const onChangeAmount = useCallback(
		(_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string | undefined) => {
			let newValue = Math.min(itemToSell?.Amount as number, Math.max(1, parseInt(value as string)));

			if (isNaN(newValue)) {
				newValue = "" as any;
			}

			setSellAmount(newValue);
		},
		[itemToSell?.Amount]
	);

	return (
		<>
			<Section title={intl.formatMessage({ id: Strings.inventory })}>
				<Errors error={error} />
				<PlayerInventory title="Sell" items={inventory} actions={["sell"]} onSell={onSellLocal} />
			</Section>
			{itemToSell && (
				<WSPopup isOpen={isVisible(sellPopupId)} onDismiss={onDismiss} isBlocking={false}>
					<HeaderPopup>
						<H1PopupTitle>
							<FormattedMessage id={Strings.sell_this_item} />
						</H1PopupTitle>
						<WSPopupCloseButton onDismiss={onDismiss} />
					</HeaderPopup>
					<div className="p-4">
						<Errors error={error} />
						<ItemSingle
							catalog={catalog}
							item={itemToSell}
							showQuantity
							quantity={itemToSell.Amount}
							prices={getStorePrice(catalogItem?.PriceOptions, sellMultiplier).map(p => ({
								...p,
								amount: p.amount * (sellAmount || 1),
							}))}
						/>
						<div className="ml-36 max-w-36">
							<WSTextField
								label={intl.formatMessage({ id: Strings.quantity })}
								onChange={onChangeAmount}
								value={sellAmount.toString()}
								autoFocus
								type="number"
							/>
						</div>
					</div>
					<DivConfirmFooter>
						<UlConfirmButtons>
							<WSButton onClick={onSellConfirm} disabled={isLoading} isLoading={isLoading}>
								<FormattedMessage id={Strings.sell_for_price_button} />
							</WSButton>
							<WSButton onClick={onDismiss} disabled={isLoading} style="light">
								<FormattedMessage id={Strings.cancel} />
							</WSButton>
						</UlConfirmButtons>
					</DivConfirmFooter>
				</WSPopup>
			)}
		</>
	);
};
