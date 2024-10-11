/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { isPlayFabResultSuccessful } from "../shared/helpers";
import { is } from "../shared/is";

export interface IPlayFabEvent {
	title: string;
	api: string;
	date: number;
	isSuccessful?: boolean;
	request: PlayFabModule.IPlayFabRequestCommon;
	result?: PlayFabModule.IPlayFabResultCommon;
}

interface IPlayFabEventRequestPayload {
	title: string;
	api: string;
	date: number;
	request: PlayFabModule.IPlayFabRequestCommon;
}

interface IPlayFabEventResultPayload {
	date: number;
	result: PlayFabModule.IPlayFabResultCommon;
	problem: PlayFabModule.IPlayFabError;
}

interface IPlayFabState {
	isVisible: boolean;
	events: IPlayFabEvent[];
	popupEvent: IPlayFabEvent;
}

const initialState: IPlayFabState = {
	isVisible: false,
	events: [],
	popupEvent: null as any,
};

const redacted = "***";

export const playfabSlice = createSlice({
	name: "playfab",
	initialState,
	reducers: {
		isVisible(state, action: PayloadAction<boolean>) {
			state.isVisible = action.payload;
		},
		setPopupEvent(state, action: PayloadAction<IPlayFabEvent>) {
			state.popupEvent = action.payload;
		},
		clearPopupEvent(state) {
			state.popupEvent = initialState.popupEvent;
		},
		clearHistory(state) {
			state.events = initialState.events;
			state.popupEvent = initialState.popupEvent;
		},
		addRequest(state, action: PayloadAction<IPlayFabEventRequestPayload>) {
			const cleanedRequest = {
				...action.payload.request,
			} as any;

			// Don't show people's passwords or access tokens
			if (!is.null(cleanedRequest.Password)) {
				cleanedRequest.Password = redacted;
			}

			if (!is.null(cleanedRequest.AccessToken)) {
				cleanedRequest.AccessToken = redacted;
			}

			state.events.unshift({
				api: action.payload.api,
				title: action.payload.title,
				date: action.payload.date,
				request: cleanedRequest,
			});
		},
		setResult(state, action: PayloadAction<IPlayFabEventResultPayload>) {
			state.events = state.events.map(event => {
				if (event.date !== action.payload.date) {
					return event;
				}

				let result = { ...action.payload.result } as any;

				if (!is.null(action.payload.problem)) {
					result = { ...action.payload.problem };
				}

				// Remove any request object
				if (!is.null(result.Request)) {
					delete result.Request;
				}

				// Don't show passwords and sensitive things
				if (!is.null(result.data?.SessionTicket)) {
					result.data.SessionTicket = redacted;
				}

				if (!is.null(result.data?.EntityToken?.EntityToken)) {
					result.data.EntityToken.EntityToken = redacted;
				}

				return {
					...event,
					isSuccessful: isPlayFabResultSuccessful(result),
					result,
				};
			});
		},
	},
});
