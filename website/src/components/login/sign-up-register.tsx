/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { IFormHooks } from "../../hooks/use-form";
import { IRegisterFormModel } from "../../hooks/use-login";
import Strings from "../../strings";
import { WSButton } from "../button";
import { Errors } from "../errors";
import { WSForm } from "../form";
import { WSPopupContent, WSPopupFooter } from "../popups";
import { WSTabs } from "../tabs";
import { UlConfirmButtonsProgress, UlFormFields } from "../tailwind";
import { WSTextField } from "../text-field";
import { LoginProgressBar } from "./bar";

interface ISocialLoginSignUpRegisterProps extends IFormHooks<IRegisterFormModel> {
	onSignIn: () => void;
	onRegister: () => void;
	onCancel: () => void;
	data: IRegisterFormModel;
	isLoading: boolean;
	error: PlayFabModule.IPlayFabError | undefined;
}

export const SocialLoginSignUpRegister: React.FunctionComponent<ISocialLoginSignUpRegisterProps> = ({
	onRegister,
	onSignIn,
	onCancel,
	isLoading,
	error,
	data,
	onChange,
}) => {
	const intl = useIntl();
	const [tab, setTab] = useState(0);

	return (
		<>
			<WSPopupContent className="pb-0">
				<WSTabs
					tabs={[
						{
							isCurrent: tab === 0,
							onClick: () => setTab(0),
							text: intl.formatMessage({ id: Strings.login }),
						},
						{
							isCurrent: tab === 1,
							onClick: () => setTab(1),
							text: intl.formatMessage({ id: Strings.register }),
						},
					]}
				/>
			</WSPopupContent>
			<SocialLoginSignUpRegisterSwitch
				data={data}
				error={error}
				isLoading={isLoading}
				onCancel={onCancel}
				onChange={onChange}
				onRegister={onRegister}
				onSignIn={onSignIn}
				tab={tab}
			/>
		</>
	);
};

interface ISocialLoginSignUpRegisterSwitchProps extends ISocialLoginSignUpRegisterProps {
	tab: number;
}

const SocialLoginSignUpRegisterSwitch: React.FunctionComponent<ISocialLoginSignUpRegisterSwitchProps> = ({
	tab,
	onRegister,
	onSignIn,
	onCancel,
	isLoading,
	error,
	data,
	onChange,
}) => {
	const intl = useIntl();

	switch (tab) {
		case 0:
			return (
				<WSForm onSubmit={onSignIn}>
					<WSPopupContent>
						<Errors error={error} />
						<UlFormFields>
							<li>
								<WSTextField
									label={intl.formatMessage({ id: Strings.email_address })}
									value={data.email}
									name="email"
									id="email"
									autoComplete="email"
									onChange={onChange}
									disabled={isLoading}
									onSubmit={onSignIn}
									autoFocus
								/>
							</li>
							<li>
								<WSTextField
									label={intl.formatMessage({ id: Strings.password })}
									type="password"
									id="password"
									value={data.password}
									name="password"
									autoComplete="current-password"
									onChange={onChange}
									disabled={isLoading}
									onSubmit={onSignIn}
								/>
							</li>
						</UlFormFields>
					</WSPopupContent>
					<WSPopupFooter>
						<UlConfirmButtonsProgress
							submit={
								<WSButton
									type="submit"
									onClick={onSignIn}
									disabled={isLoading}
									isLoading={isLoading}
									className="block w-full">
									<FormattedMessage id={Strings.login} />
								</WSButton>
							}
							cancel={
								<WSButton
									type="button"
									style="light"
									onClick={onCancel}
									disabled={isLoading}
									className="block w-full">
									<FormattedMessage id={Strings.cancel} />
								</WSButton>
							}
							progress={<LoginProgressBar />}
							isLoading={isLoading}
						/>
					</WSPopupFooter>
				</WSForm>
			);
		case 1:
			return (
				<WSForm onSubmit={onRegister}>
					<WSPopupContent>
						<Errors error={error} />
						<UlFormFields>
							<li>
								<WSTextField
									label={intl.formatMessage({ id: Strings.email_address })}
									value={data.email}
									name="email"
									id="email"
									autoComplete="email"
									onChange={onChange}
									disabled={isLoading}
									onSubmit={onRegister}
									autoFocus
								/>
							</li>
							<li>
								<WSTextField
									label={intl.formatMessage({ id: Strings.password })}
									type="password"
									id="password"
									value={data.password}
									name="password"
									autoComplete="current-password"
									onChange={onChange}
									disabled={isLoading}
									onSubmit={onRegister}
								/>
							</li>
							<li>
								<WSTextField
									label={intl.formatMessage({ id: Strings.password_confirm })}
									type="password"
									value={data.password_confirm}
									name="password_confirm"
									id="password_confirm"
									autoComplete="new-password"
									onChange={onChange}
									onSubmit={onRegister}
									disabled={isLoading}
								/>
							</li>
						</UlFormFields>
					</WSPopupContent>
					<WSPopupFooter>
						<UlConfirmButtonsProgress
							submit={
								<WSButton
									type="submit"
									onClick={onRegister}
									disabled={isLoading}
									isLoading={isLoading}
									className="block w-full">
									<FormattedMessage id={Strings.register} />
								</WSButton>
							}
							cancel={
								<WSButton
									type="button"
									style="light"
									onClick={onCancel}
									disabled={isLoading}
									className="block w-full">
									<FormattedMessage id={Strings.cancel} />
								</WSButton>
							}
							progress={<LoginProgressBar />}
							isLoading={isLoading}
						/>
					</WSPopupFooter>
				</WSForm>
			);
		default:
			return null;
	}
};
