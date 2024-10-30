/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { IndexLoginMode, useIndex } from "../hooks/use-index";
import { usePopups } from "../hooks/use-popups";
import { routes } from "../router";
import { is } from "../shared/is";
import Strings from "../strings";
import { WSButton } from "./button";
import { cookie } from "./cookies";
import { WSLink } from "./link";
import { SocialLoginRunner } from "./login/runner";
import { WSPopup } from "./popups";

const popup = "play";

export const PlayLearnMoreArea: React.FunctionComponent = () => {
	const intl = useIntl();
	const { loginMode, onSetLogin, onSetNone } = useIndex();
	const { show, hide, isVisible } = usePopups();

	const onPlay = useCallback(() => show(popup), [show]);
	const onHidePlay = useCallback(() => {
		hide(popup);
		onSetNone();
	}, [hide, onSetNone]);

	const titleStringId = useMemo(() => {
		switch (loginMode) {
			case IndexLoginMode.Login:
				return Strings.login_player;
			case IndexLoginMode.None:
			default:
				return Strings.sign_in_with;
		}
	}, [loginMode]);

	const subtleLinkClassName = "text-xs !text-gray-700";

	return (
		<>
			<div className="rounded-xl border border-solid border-border bg-white px-4 py-3 shadow">
				<div className="flex flex-nowrap items-center justify-center gap-4">
					<div className="basis-full text-center sm:basis-auto">
						<WSButton onClick={onPlay}>
							<FormattedMessage id={Strings.sign_in_with} />
						</WSButton>
					</div>
					<div className="flex justify-center">
						<WSLink to={routes.About()}>
							<FormattedMessage id={Strings.learn_more} /> &raquo;
						</WSLink>
					</div>
				</div>
				<ul className="mt-2 flex flex-wrap justify-center gap-4">
					<li>
						<WSLink to={routes.Privacy()} className={subtleLinkClassName}>
							<FormattedMessage id={Strings.privacy_policy_title} />
						</WSLink>
					</li>
					{cookie.isConsentRequired() && (
						<li>
							<WSButton
								style="link"
								onClick={() => cookie.manageConsent()}
								className={subtleLinkClassName}>
								<FormattedMessage id={Strings.manage_cookies} />
							</WSButton>
						</li>
					)}
					{!is.production() && (
						<li>
							<WSLink to={routes.Editor()} className={subtleLinkClassName}>
								Editor
							</WSLink>
						</li>
					)}
				</ul>
			</div>
			<WSPopup
				onDismiss={onHidePlay}
				isOpen={isVisible(popup)}
				isBlocking={false}
				title={intl.formatMessage({ id: titleStringId })}>
				<div className="xxs:min-w-popup-1 xs:min-w-popup-2">
					<SocialLoginRunner loginMode={loginMode} onSetLogin={onSetLogin} onSetNone={onSetNone} />
				</div>
			</WSPopup>
		</>
	);
};
