/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { combineReducers } from "@reduxjs/toolkit";
import { playfabSlice } from "./slice-playfab";
import { siteSlice } from "./slice-site";

export const rootReducer = combineReducers({ site: siteSlice.reducer, playfab: playfabSlice.reducer });
export type AppState = ReturnType<typeof rootReducer>;
