/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { LoginMethodInProgress } from "../../hooks/use-login";
import FacebookLogo from "../../static/facebook-logo.svg";
import GoogleLogo from "../../static/google-logo.svg";
import MicrosoftLogo from "../../static/microsoft-logo.svg";
import Strings from "../../strings";
import { H2Left } from "../tailwind";

interface ILoginMethodInProgressProps {
	loginMethodInProgress: LoginMethodInProgress | undefined;
}

export const SocialLoginProgress: React.FunctionComponent<ILoginMethodInProgressProps> = ({
	loginMethodInProgress,
}) => {
	const intl = useIntl();

	switch (loginMethodInProgress) {
		case "microsoft":
			return (
				<H2Left className="flex items-center gap-4">
					<img
						src={MicrosoftLogo}
						alt={intl.formatMessage({ id: Strings.microsoft })}
						className="w-10 h-10"
					/>
					<FormattedMessage id={Strings.login_microsoft} />
				</H2Left>
			);
		case "google":
			return (
				<H2Left className="flex items-center gap-4">
					<img src={GoogleLogo} alt={intl.formatMessage({ id: Strings.google })} className="w-10 h-10" />
					<FormattedMessage id={Strings.login_google} />
				</H2Left>
			);
		case "facebook":
			return (
				<H2Left className="flex items-center gap-4">
					<img src={FacebookLogo} alt={intl.formatMessage({ id: Strings.facebook })} className="w-10 h-10" />
					<FormattedMessage id={Strings.login_facebook} />
				</H2Left>
			);
		default:
			return null;
	}
};
