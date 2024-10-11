/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayFabError } from "..";
import { AppState } from "../redux/reducer";
import { siteSlice } from "../redux/slice-site";
import { is } from "../shared/is";
import { FRIENDLYID, SEARCH_ITEMS_MAX_COUNT } from "../shared/types";
import { useForm } from "./use-form";
import { usePlayFab } from "./use-playfab";

function getPriceAmount(
	item: PlayFabEconomyModels.CatalogItem,
	amount: number
): PlayFabEconomyModels.PurchasePriceAmount[] {
	return (
		item?.PriceOptions?.Prices![0].Amounts?.map<PlayFabEconomyModels.CatalogPriceAmount>(a => ({
			...a,
			Amount: a.Amount * amount,
		})) ?? [
			{
				Amount: amount,
			},
		]
	);
}

interface IEconomyStoreSingleResults {
	isLoading: boolean;
	error?: PlayFabError;
	store: PlayFabEconomyModels.CatalogItem | undefined;
}

let isStoreLoading = false;

export function useEconomyStoreSingle(storeName: string): IEconomyStoreSingleResults {
	const dispatch = useDispatch();
	const store = useSelector((state: AppState) => state.site.stores).find(store =>
		store.AlternateIds?.find(friendlyId => friendlyId.Type === FRIENDLYID && friendlyId.Value === storeName)
	);
	const { isLoading, error, setError, EconomyGetItem } = usePlayFab();

	useEffect(() => {
		if (!is.null(store) || isStoreLoading) {
			return;
		}

		isStoreLoading = true;

		EconomyGetItem({
			AlternateId: { Type: FRIENDLYID, Value: storeName },
		})
			.then(results => {
				dispatch(siteSlice.actions.storeAdd(results.Item as PlayFabEconomyModels.CatalogItem));
			})
			.catch(setError)
			.finally(() => {
				isStoreLoading = false;
			});
	}, [EconomyGetItem, dispatch, setError, store, storeName]);

	return {
		error,
		isLoading,
		store,
	};
}

interface IEconomyStoreSinglePurchaseResults {
	quantity: number;
	onChange: (event: string | React.FormEvent<Element>, value: any) => void;
	isLoading: boolean;
	error?: PlayFabError;

	onPurchase: (itemId: string, amount: number) => Promise<void>;
}

interface IEconomyStoreSinglePurchaseForm {
	quantity: number;
}

export function useEconomyStoreSinglePurchase(
	store: PlayFabEconomyModels.CatalogItem
): IEconomyStoreSinglePurchaseResults {
	const { error, setError, EconomyPurchaseItems } = usePlayFab();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);

	const { data, onChange } = useForm<IEconomyStoreSinglePurchaseForm>({
		quantity: 1,
	});

	// My kingdom for some automated data validation
	useEffect(() => {
		if (!is.numeric(data.quantity) || data.quantity < 1) {
			onChange("quantity", 1);
		}
	}, [data.quantity, onChange]);

	const onPurchase = useCallback(
		(itemId: string, amount: number) => {
			const itemInStore = store?.ItemReferences?.find(i => i.Id === itemId) as PlayFabEconomyModels.CatalogItem;
			const priceAmountSingular = getPriceAmount(itemInStore, 1);
			const priceAmountMultiple = getPriceAmount(itemInStore, amount);
			setIsLoading(true);

			return new Promise<void>((resolve, reject) => {
				EconomyPurchaseItems({
					DeleteEmptyStacks: true,
					Item: {
						Id: itemId,
					},
					Amount: amount,
					PriceAmounts: priceAmountSingular,
					StoreId: store?.Id,
				})
					.then(() => {
						dispatch(
							siteSlice.actions.inventoryPurchase({
								item: {
									Amount: amount,
									Id: itemId,
								},
								price: priceAmountMultiple,
							})
						);
						setIsLoading(false);
						resolve();
					})
					.catch(issue => {
						setIsLoading(false);
						setError(issue);
						reject(issue);
					});
			});
		},
		[EconomyPurchaseItems, dispatch, setError, store?.Id, store?.ItemReferences]
	);

	return {
		error,
		isLoading,
		quantity: data.quantity,
		onChange,

		onPurchase,
	};
}

interface IEconomyStoreSellItemResults {
	isLoading: boolean;
	error?: PlayFabError;

	onSell: (itemId: string, amount: number) => Promise<void>;
}

export function useEconomyStoreSell(): IEconomyStoreSellItemResults {
	const { isLoading, error, setError, CloudScriptExecuteFunction, EconomyGetInventoryItems } = usePlayFab();
	const dispatch = useDispatch();

	const onSell = useCallback(
		(itemId: string, amount: number) => {
			return new Promise<void>((resolve, reject) => {
				CloudScriptExecuteFunction({
					FunctionName: "SellItem",
					FunctionParameter: {
						ItemId: itemId,
						Amount: amount,
					},
				})
					.then(() => EconomyGetInventoryItems({ Count: SEARCH_ITEMS_MAX_COUNT }))
					.then(data => {
						dispatch(siteSlice.actions.inventory(data.Items));
						resolve();
					})
					.catch(issue => {
						setError(issue);
						reject(issue);
					});
			});
		},
		[CloudScriptExecuteFunction, EconomyGetInventoryItems, dispatch, setError]
	);

	return {
		error,
		isLoading,

		onSell,
	};
}
