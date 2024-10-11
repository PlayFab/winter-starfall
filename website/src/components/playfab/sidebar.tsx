/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/reducer";
import { IPlayFabEvent, playfabSlice } from "../../redux/slice-playfab";
import { routes } from "../../router";
import { trackEvent } from "../../shared/app-insights";
import { combineClassNames } from "../../shared/helpers";
import { is } from "../../shared/is";
import { links } from "../../shared/links";
import Strings from "../../strings";
import { WSButton } from "../button";
import { WSLink } from "../link";
import { PlayFabLogo } from "../logo";
import { WSPopupCloseButton } from "../popups";
import { H1PopupTitle, HeaderPopup } from "../tailwind";
import { PlayFabActivityStatus } from "./status";

export const PlayFabActivitySidebar: React.FunctionComponent = () => {
	const dispatch = useDispatch();
	const isPlayFabActivityVisible = useSelector((state: AppState) => state.playfab.isVisible);
	const isSignedIn = !is.null(useSelector((state: AppState) => state.site.playFabId));

	const onClose = useCallback(() => {
		dispatch(playfabSlice.actions.isVisible(false));
	}, [dispatch]);

	if (!isPlayFabActivityVisible || !isSignedIn) {
		return null;
	}

	return (
		<div className="relative border-orange-500 pl-2 border-l-2">
			<HeaderPopup className="!border-b-0">
				<H1PopupTitle className="flex items-center gap-2">
					<PlayFabLogo className="!h-6" />
					<FormattedMessage id={Strings.playfab_activity} />
				</H1PopupTitle>
				<WSPopupCloseButton onDismiss={onClose} />
			</HeaderPopup>
			<PlayFabActivityList />
		</div>
	);
};

const PlayFabActivityList: React.FunctionComponent = () => {
	const dispatch = useDispatch();
	const events = useSelector((state: AppState) => state.playfab.events);
	const titleId = useSelector((state: AppState) => state.site.titleId);

	const onClearEvents = useCallback(() => {
		dispatch(playfabSlice.actions.clearHistory());
	}, [dispatch]);

	if (is.null(events)) {
		return (
			<p className="mt-6 text-center italic">
				<FormattedMessage id={Strings.playfab_activity_none} />
			</p>
		);
	}

	return (
		<>
			<ul className="mt-4 max-h-playfab-activity overflow-y-auto">
				{events.map((event, index) => (
					<li key={index} className="border-t first:border-t-0 border-border">
						<PlayFabActivityListItem event={event} />
					</li>
				))}
			</ul>
			<div className="flex justify-between items-start mt-8 mb-4 px-4">
				<WSButton onClick={onClearEvents} style="light" className="!text-sm">
					<FormattedMessage id={Strings.clear} />
				</WSButton>

				<ul className="text-right grid grid-cols-1 px-4 text-sm">
					<li>
						<WSLink
							to={links.playfab}
							onClick={() => {
								trackEvent({ name: "PlayFab.com link clicked", properties: {} });
							}}
							isExternal
							target="_blank">
							<FormattedMessage id={Strings.playfab_dotcom} />
						</WSLink>
					</li>
					<li>
						<WSLink
							to={links.titleOverviewDashboard(titleId)}
							isExternal
							target="_blank"
							onClick={() => {
								trackEvent({ name: "View title clicked", properties: { titleId } });
							}}>
							<FormattedMessage id={Strings.title_id} values={{ titleId }} />
						</WSLink>
					</li>
					<li>
						<WSLink to={routes.About()}>
							<FormattedMessage id={Strings.about_site} />
						</WSLink>
					</li>
				</ul>
			</div>
		</>
	);
};

const PlayFabActivityListItem: React.FunctionComponent<{ event: IPlayFabEvent }> = ({ event }) => {
	const dispatch = useDispatch();

	const apiNameShort = event.api.replace("Api", "");

	const onSelectEvent = useCallback(() => {
		dispatch(playfabSlice.actions.setPopupEvent(event));
		const eventTitle = event.title;
		trackEvent({ name: "Playfab Activity clicked", properties: { apiNameShort, eventTitle } });
	}, [dispatch, event, apiNameShort]);

	let apiColorClassName = "bg-gray-700";
	switch (apiNameShort) {
		case "Client":
			apiColorClassName = "bg-sky-500";
			break;
		case "Economy":
			apiColorClassName = "bg-emerald-500";
			break;
		case "CloudScript":
			apiColorClassName = "bg-fuchsia-500";
			break;
	}

	return (
		<div className="flex items-center gap-2 py-1">
			<PlayFabActivityStatus isSuccessful={event.isSuccessful} />
			<span className="flex items-center gap-1 font-mono">
				<button
					className={combineClassNames(
						"rounded px-1 py-0.5 text-xs font-semibold text-white",
						apiColorClassName
					)}
					onClick={onSelectEvent}>
					{apiNameShort}
				</button>
				<WSButton onClick={onSelectEvent} style="link">
					{event.title}
				</WSButton>
			</span>
		</div>
	);
};
