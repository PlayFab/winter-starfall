/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { PropsWithChildren, useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import { AppState } from "./redux/reducer";
import { is } from "./shared/is";

// This is not a state variable because of race conditions when fetching the locale
let isLoadingStrings = false;

export const LocaleProvider: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
	const [siteStrings, setSiteStrings] = useState<Record<string, string>>({});
	const locale = useSelector((state: AppState) => state.site.locale);

	useEffect(() => {
		if (isLoadingStrings || is.null(locale)) {
			return;
		}

		isLoadingStrings = true;

		fetch(`/strings/strings.${locale}.json`)
			.then(file => {
				file.json().then(setSiteStrings);
				isLoadingStrings = false;
			})
			.catch(() => {
				// Unable to load strings for language
			});
	}, [locale]);

	if (Object.keys(siteStrings).length === 0) {
		// Don't show anything if strings haven't come back
		return null;
	}

	return (
		<IntlProvider locale={locale} messages={siteStrings}>
			{children}
		</IntlProvider>
	);
};
