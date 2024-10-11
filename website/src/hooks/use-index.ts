/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useState } from "react";

export enum IndexLoginMode {
	None,
	Login,
}

interface IResults {
	loginMode: IndexLoginMode;
	onSetLogin: () => void;
	onSetNone: () => void;
}

export function useIndex(): IResults {
	const [loginMode, setLoginMode] = useState(IndexLoginMode.None);

	const onSetLogin = useCallback(() => {
		setLoginMode(IndexLoginMode.Login);
	}, []);

	const onSetNone = useCallback(() => {
		setLoginMode(IndexLoginMode.None);
	}, []);

	return {
		loginMode,
		onSetLogin,
		onSetNone,
	};
}
