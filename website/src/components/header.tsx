/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHeader } from "../hooks/use-header";
import { usePopups } from "../hooks/use-popups";
import { trackEvent } from "../shared/app-insights";
import Strings from "../strings";
import { WSButton } from "./button";
import { HeaderProfileButton } from "./header/profile";
import { HeaderResetPlayerPopup } from "./header/reset-popup";
import { PlayFabLogo } from "./logo";
import { PartyPopup } from "./party/party";
import { TitleNewsPopup } from "./title-news";

const partyId = "party";

export const Header: React.FunctionComponent = () => {
	const intl = useIntl();
	const { hide, isVisible, show } = usePopups();
	const {
		canSeePartyTab,
		error,
		isLoading,
		isPlayFabActivityVisible,
		isResetPopupVisible,
		isTitleNewsPopupVisible,
		onHideResetPopup,
		onHideTitleNewsPopup,
		onResetPlayer,
		playerNavigation,
		setIsPlayFabActivityVisible,
	} = useHeader();

	const onPlayFabActivityClickHandler = useCallback(() => {
		setIsPlayFabActivityVisible(!isPlayFabActivityVisible);
		// Since isPlayFabActivityVisible has not yet been updated here, check if it's false
		if (!isPlayFabActivityVisible) {
			trackEvent({ name: "Playfab activity sidebar opened" });
		}
	}, [isPlayFabActivityVisible]);

	return (
		<>
			<div className="flex justify-between bg-white shadow my-4 px-4 border-border rounded-xl h-20">
				<div className="flex items-center gap-4">
					{canSeePartyTab && (
						<WSButton onClick={() => show(partyId)} style="light">
							<FormattedMessage id={Strings.nav_party} />
						</WSButton>
					)}
				</div>
				<div className="flex items-center gap-4">
					<WSButton
						onClick={onPlayFabActivityClickHandler}
						style="link"
						className="sm:flex items-center gap-1 hidden"
						title={intl.formatMessage({ id: Strings.playfab_activity })}
						aria-label={intl.formatMessage({ id: Strings.playfab_activity })}>
						<PlayFabLogo className="!h-6" />
					</WSButton>
					<div className="relative ml-3">
						<HeaderProfileButton playerNavigation={playerNavigation} />
					</div>
				</div>
			</div>
			<HeaderResetPlayerPopup
				isLoading={isLoading}
				isVisible={isResetPopupVisible}
				onDismiss={onHideResetPopup}
				onResetPlayer={onResetPlayer}
				error={error}
			/>
			<TitleNewsPopup isVisible={isTitleNewsPopupVisible} onDismiss={onHideTitleNewsPopup} />
			<PartyPopup isVisible={isVisible(partyId)} onDismiss={() => hide(partyId)} />
		</>
	);
};
