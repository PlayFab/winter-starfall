/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { PropsWithChildren } from "react";
import { useDispatch } from "react-redux";
import { siteSlice } from "../redux/slice-site";

declare let WcpConsent: any;

let siteConsent: any;

const WcpCookiesProvider: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
	const dispatch = useDispatch();

	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	WcpConsent &&
		WcpConsent.init(
			"en-US",
			"cookie-banner",
			(err: any, _siteConsent: any) => {
				if (!err) {
					siteConsent = _siteConsent!;
					dispatch(siteSlice.actions.siteConsent(siteConsent));
				}
			},
			onConsentChanged
		);

	return <>{children}</>;
};

const onConsentChanged = () => {
	window.location.reload();
};

const manageConsent = () => {
	siteConsent.manageConsent();
};

const hasAnalyticsConsent = () => siteConsent.getConsentFor(WcpConsent.consentCategories.Analytics);

export { hasAnalyticsConsent, manageConsent, WcpCookiesProvider };
