/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { is } from "../../shared/is";
import FacebookLogo from "../../static/facebook-logo.svg";
import GoogleLogo from "../../static/google-logo.svg";
import MicrosoftLogo from "../../static/microsoft-logo.svg";
import Strings from "../../strings";
import { WSButton } from "../button";
import { WSIcon } from "../icon";

interface ILoginOptionsProps {
	canLoginWithFacebook: boolean;
	canLoginWithGoogle: boolean;
	canLoginWithMicrosoft: boolean;
	isLoading: boolean;
	onLoginWithFacebook: () => void;
	onLoginWithGoogle: () => void;
	onLoginWithMicrosoft: () => void;
	onSetLogin: () => void;
}

export const SocialLoginOptions: React.FunctionComponent<ILoginOptionsProps> = ({
	onSetLogin,
	onLoginWithGoogle,
	onLoginWithFacebook,
	onLoginWithMicrosoft,
	canLoginWithGoogle,
	canLoginWithFacebook,
	canLoginWithMicrosoft,
	isLoading,
}) => {
	const intl = useIntl();

	if (isLoading) {
		return null;
	}

	return (
		<ul className="flex flex-col flex-wrap gap-2">
			<li className="grow">
				<WSButton
					style="light-big"
					onClick={onSetLogin}
					className="flex items-start gap-2 w-full"
					title={intl.formatMessage({ id: Strings.login_playfab })}
					aria-label={intl.formatMessage({ id: Strings.login_playfab })}>
					<WSIcon icon="Mail" className="w-6 h-6" size={24} />
					<FormattedMessage id={Strings.email_address} />
				</WSButton>
			</li>
			{canLoginWithMicrosoft && (
				<li className="grow">
					<WSButton
						style="light-big"
						onClick={onLoginWithMicrosoft}
						className="flex items-center gap-2 w-full"
						disabled={isLoading}
						title={intl.formatMessage({ id: Strings.login_microsoft })}
						aria-label={intl.formatMessage({ id: Strings.login_microsoft })}>
						<img
							src={MicrosoftLogo}
							alt={intl.formatMessage({ id: Strings.microsoft })}
							className="w-6 h-6"
						/>
						<FormattedMessage id={Strings.microsoft} />
					</WSButton>
				</li>
			)}
			{canLoginWithGoogle && (
				<li className="grow">
					<WSButton
						style="light-big"
						onClick={onLoginWithGoogle}
						className="flex items-center gap-2 w-full"
						disabled={!canLoginWithGoogle || isLoading}
						title={intl.formatMessage({ id: Strings.login_google })}
						aria-label={intl.formatMessage({ id: Strings.login_google })}>
						<img src={GoogleLogo} alt={intl.formatMessage({ id: Strings.google })} className="w-6 h-6" />
						<FormattedMessage id={Strings.google} />
					</WSButton>
				</li>
			)}
			{canLoginWithFacebook && (
				<li className="grow">
					<WSButton
						style="light-big"
						onClick={onLoginWithFacebook}
						className="flex items-center gap-2 w-full"
						disabled={!canLoginWithFacebook || isLoading}
						title={intl.formatMessage({ id: Strings.login_facebook })}
						aria-label={intl.formatMessage({ id: Strings.login_facebook })}>
						<img
							src={FacebookLogo}
							alt={intl.formatMessage({ id: Strings.facebook })}
							className="w-6 h-6"
						/>
						<FormattedMessage id={Strings.facebook} />
					</WSButton>
				</li>
			)}
			{is.production() && is.standalone() && (
				<li className="grow">
					<WSButton
						style="light-big"
						onClick={() => window.location.reload()}
						className="flex items-start gap-2 w-full"
						disabled={isLoading}
						title={intl.formatMessage({ id: Strings.refresh })}
						aria-label={intl.formatMessage({ id: Strings.refresh })}>
						<WSIcon icon="Refresh" className="w-6 h-6" size={24} />
						<FormattedMessage id={Strings.refresh} />
					</WSButton>
				</li>
			)}
		</ul>
	);
};
