/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useState } from "react";

interface IPopupHooks {
	ids: string[];
	show(id: string): void;
	hide(id: string, isInProgress?: boolean): void;
	isVisible(id: string): boolean;
}

export function usePopups(): IPopupHooks {
	const [ids, setIds] = useState<string[]>([]);

	const isVisible = useCallback((id: string) => ids.includes(id), [ids]);

	const show = useCallback(
		(id: string) => setIds(prevIds => (prevIds.includes(id) ? prevIds : prevIds.concat(id))),
		[]
	);

	const hide = useCallback((id: string, isInProgress?: boolean) => {
		// Don't allow popups to close during a save action
		if (isInProgress === true) {
			return;
		}

		setIds(prevIds => prevIds.filter(popup => popup !== id));
	}, []);

	return { ids, show, hide, isVisible };
}
