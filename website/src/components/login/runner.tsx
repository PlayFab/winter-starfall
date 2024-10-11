/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback } from "react";
import { IndexLoginMode } from "../../hooks/use-index";
import { useLogin } from "../../hooks/use-login";
import { Errors } from "../errors";
import { WSPopupContent, WSPopupFooter } from "../popups";
import { LoginProgressBar } from "./bar";
import { SocialLoginOptions } from "./options";
import { SocialLoginProgress } from "./progress";
import { SocialLoginSignUpRegister } from "./sign-up-register";

interface ILoginSocialContentProps {
	loginMode: IndexLoginMode;

	onSetLogin: () => void;
	onSetNone: () => void;
}

export const SocialLoginRunner: React.FunctionComponent<ILoginSocialContentProps> = ({
	loginMode,
	onSetLogin,
	onSetNone,
}) => {
	const {
		canLoginWithFacebook,
		canLoginWithGoogle,
		canLoginWithMicrosoft,
		data,
		error,
		isLoading,
		loginMethodInProgress,
		onChange,
		onClearErrors,
		onLogin,
		onLoginWithFacebook,
		onLoginWithGoogle,
		onLoginWithMicrosoft,
		onRegister,
	} = useLogin();

	const onCancel = useCallback(() => {
		onClearErrors();
		onSetNone();
	}, [onClearErrors, onSetNone]);

	switch (loginMode) {
		case IndexLoginMode.Login:
			return (
				<SocialLoginSignUpRegister
					onSignIn={onLogin}
					onRegister={onRegister}
					onCancel={onCancel}
					data={data}
					isLoading={isLoading}
					error={error}
					onChange={onChange}
				/>
			);
		case IndexLoginMode.None:
		default:
			return (
				<>
					<WSPopupContent>
						<Errors error={error} />
						<SocialLoginProgress loginMethodInProgress={loginMethodInProgress} />
						<SocialLoginOptions
							canLoginWithFacebook={canLoginWithFacebook}
							canLoginWithGoogle={canLoginWithGoogle}
							canLoginWithMicrosoft={canLoginWithMicrosoft}
							isLoading={isLoading}
							onLoginWithFacebook={onLoginWithFacebook}
							onLoginWithGoogle={onLoginWithGoogle}
							onLoginWithMicrosoft={onLoginWithMicrosoft}
							onSetLogin={onSetLogin}
						/>
					</WSPopupContent>
					{isLoading && (
						<WSPopupFooter>
							<LoginProgressBar />
						</WSPopupFooter>
					)}
				</>
			);
	}
};
