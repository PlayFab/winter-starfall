/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../redux/reducer";
import { siteSlice } from "../redux/slice-site";
import Strings from "../strings";

export function useNotifications() {
	const intl = useIntl();
	const dispatch = useDispatch();

	const notifications = useSelector((state: AppState) => state.site.userDataPlayer.notifications);
	const hasPartyTabCheckpoint =
		useSelector((state: AppState) => state.site.userDataReadOnly.completed.checkpoints).indexOf("party") !== -1;

	const hasPartyTabUserData = notifications.indexOf("party") !== -1;
	const [didHaveParty] = useState(hasPartyTabCheckpoint || hasPartyTabUserData);

	useEffect(() => {
		if (hasPartyTabUserData || didHaveParty || !hasPartyTabCheckpoint) {
			return;
		}

		dispatch(
			siteSlice.actions.notificationAdd({
				title: intl.formatMessage({ id: Strings.notification_party_tab_title }),
				id: "party",
				description: intl.formatMessage({ id: Strings.notification_party_tab_description }),
				icon: "Info",
				iconColor: "text-green-700",
				actionButtons: [],
			})
		);
	}, [didHaveParty, dispatch, hasPartyTabCheckpoint, hasPartyTabUserData, intl]);
}
