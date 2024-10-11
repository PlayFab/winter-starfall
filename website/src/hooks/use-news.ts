/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { PlayFabError } from "..";
import { siteSlice } from "../redux/slice-site";
import { usePlayFab } from "./use-playfab";

interface IResults {
	isLoading: boolean;
	error: PlayFabError | undefined;

	onRefresh: () => void;
}

export function useNews(): IResults {
	const dispatch = useDispatch();
	const { isLoading, error, setError, ClientGetTitleNews } = usePlayFab();

	const onRefresh = useCallback(() => {
		ClientGetTitleNews({})
			.then(data => {
				dispatch(siteSlice.actions.titleNews(data.News));
			})
			.catch(setError);
	}, [ClientGetTitleNews, dispatch, setError]);

	useEffect(() => {
		onRefresh();
	}, [onRefresh]);

	return {
		error,
		isLoading,
		onRefresh,
	};
}
