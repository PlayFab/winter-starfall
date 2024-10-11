/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage } from "react-intl";
import { PlayFabError } from "../..";
import Strings from "../../strings";
import { WSButton } from "../button";
import { Errors } from "../errors";
import { WSPopup, WSPopupCloseButton, WSPopupContent, WSPopupFooter } from "../popups";
import { H1PopupTitle, HeaderPopup, UlConfirmButtons } from "../tailwind";

interface IHeaderResetPlayerPopupProps {
	onDismiss: () => void;
	onResetPlayer: () => void;
	isLoading: boolean;
	isVisible: boolean;
	error?: PlayFabError;
}

export const HeaderResetPlayerPopup: React.FunctionComponent<IHeaderResetPlayerPopupProps> = ({
	isLoading,
	isVisible,
	onDismiss,
	onResetPlayer,
	error,
}) => {
	return (
		<WSPopup isBlocking={false} onDismiss={onDismiss} isOpen={isVisible}>
			<HeaderPopup>
				<H1PopupTitle>Reset your player?</H1PopupTitle>
				<WSPopupCloseButton onDismiss={onDismiss} />
			</HeaderPopup>
			<WSPopupContent>
				<Errors error={error} />
				<p>All progress will be erased.</p>
				<p className="mt-4">This will take about 10 seconds.</p>
			</WSPopupContent>
			<WSPopupFooter>
				<UlConfirmButtons>
					<WSButton onClick={onResetPlayer} disabled={isLoading} isLoading={isLoading}>
						Reset account
					</WSButton>
					<WSButton onClick={onDismiss} disabled={isLoading} style="light">
						<FormattedMessage id={Strings.cancel} />
					</WSButton>
				</UlConfirmButtons>
			</WSPopupFooter>
		</WSPopup>
	);
};
