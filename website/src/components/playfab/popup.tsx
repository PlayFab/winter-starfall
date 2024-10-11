/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/reducer";
import { IPlayFabEvent, playfabSlice } from "../../redux/slice-playfab";
import { is } from "../../shared/is";
import { links } from "../../shared/links";
import Strings from "../../strings";
import { WSButton } from "../button";
import { WSIcon } from "../icon";
import { WSLink } from "../link";
import { PlayFabLogo } from "../logo";
import { WSPopup, WSPopupCloseButton } from "../popups";
import { H1PopupTitle, HeaderPopup } from "../tailwind";
import { PlayFabActivityDateTime } from "./date-time";
import { PlayFabActivityStatus } from "./status";

export const PlayFabActivityPopup: React.FunctionComponent = () => {
	const dispatch = useDispatch();
	const event = useSelector((state: AppState) => state.playfab.popupEvent);

	const onHideEvent = useCallback(() => {
		dispatch(playfabSlice.actions.clearPopupEvent());
	}, [dispatch]);

	const isPopupVisible = event !== null;

	return <EventPopup event={event} isVisible={isPopupVisible} onDismiss={onHideEvent} />;
};

interface IEventPopupProps {
	isVisible: boolean;
	event: IPlayFabEvent | null;

	onDismiss: () => void;
}

const EventPopup: React.FunctionComponent<IEventPopupProps> = ({ event, isVisible, onDismiss }) => {
	const intl = useIntl();
	const [localEvent, setLocalEvent] = useState(event);

	useEffect(() => {
		if (!is.null(event)) {
			setLocalEvent(event);
		}
	}, [event]);

	if (is.null(localEvent)) {
		return null;
	}

	return (
		<WSPopup isOpen={isVisible} onDismiss={onDismiss}>
			<HeaderPopup>
				<PlayFabActivityStatus isSuccessful={localEvent?.isSuccessful} />
				<H1PopupTitle className="font-mono">
					{localEvent?.api}.{localEvent?.title}
				</H1PopupTitle>
				<div className="mr-4">
					<EventPopupPlayFabDocs event={localEvent} />
				</div>
				<PlayFabActivityDateTime date={localEvent?.date as number} showDate />
				<WSPopupCloseButton onDismiss={onDismiss} />
			</HeaderPopup>
			<div className="grid grid-cols-2 bg-gray-100">
				<ActivityJSON title={intl.formatMessage({ id: Strings.request })} json={localEvent?.request} />
				<ActivityJSON title={intl.formatMessage({ id: Strings.response })} json={localEvent?.result} />
			</div>
		</WSPopup>
	);
};

interface IEventPopupPlayFabDocsProps {
	event: IPlayFabEvent | null;
}

const EventPopupPlayFabDocs: React.FunctionComponent<IEventPopupPlayFabDocsProps> = ({ event }) => {
	return (
		<WSLink
			to={links.apiDocumentation(event?.api, event?.title)}
			isExternal
			target="_blank"
			className="flex items-center gap-2 text-sm">
			<PlayFabLogo className="!h-4" />
			<FormattedMessage id={Strings.docs} />
		</WSLink>
	);
};

interface IActivityJSON {
	title: string;
	json: any;
}

const ActivityJSON: React.FunctionComponent<IActivityJSON> = ({ json, title }) => {
	const intl = useIntl();
	const [hasCopied, setHasCopied] = useState(false);

	const jsonText = useMemo(() => JSON.stringify(json, null, 2), [json]);

	const onCopy = useCallback(() => {
		navigator.clipboard.writeText(jsonText);
		setHasCopied(true);

		setTimeout(() => {
			setHasCopied(false);
		}, 3000);
	}, [jsonText]);

	return (
		<div className="p-4">
			<h3 className="flex items-center gap-2">
				<span className="font-semibold text-lg">{title}</span>
				<WSButton
					onClick={onCopy}
					style="icon"
					disabled={hasCopied}
					className="!bg-transparent"
					title={intl.formatMessage({ id: Strings.copy })}>
					<WSIcon
						size={14}
						icon={hasCopied ? "Checkmark" : "Copy"}
						className={hasCopied ? "text-green-800" : "text-gray-700"}
					/>
				</WSButton>
			</h3>
			<pre className="border-gray-300 bg-white my-2 p-2 border border-solid max-h-96 text-sm overflow-auto">
				{jsonText}
			</pre>
		</div>
	);
};
