/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../redux/reducer";
import { siteSlice } from "../redux/slice-site";
import { combineClassNames } from "../shared/helpers";
import { is } from "../shared/is";
import { INotification, NotificationActionButtonsDestination } from "../shared/types";
import Strings from "../strings";
import { WSButton } from "./button";
import { WSIcon } from "./icon";

export const WSNotification: React.FunctionComponent = () => {
	const dispatch = useDispatch();
	const notifications = useSelector((state: AppState) => state.site.notifications);

	const isVisible = !is.null(notifications);
	const onRemove = useCallback((index: number) => dispatch(siteSlice.actions.notificationRemove(index)), [dispatch]);

	if (!isVisible) {
		return null;
	}

	return (
		<>
			<div
				aria-live="assertive"
				className="z-50 fixed inset-0 flex items-start px-4 py-6 sm:p-6 pointer-events-none">
				<div className="flex flex-col items-center sm:items-end space-y-4 w-full">
					{notifications.map((notification, index) => (
						<WSNotificationListItem
							notification={notification}
							index={index}
							onDismiss={onRemove}
							key={index}
						/>
					))}
				</div>
			</div>
		</>
	);
};

interface IWSNotificationListItemProps {
	notification: INotification;
	index: number;
	onDismiss: (index: number) => void;
}

const defaultNotification: Partial<INotification> = {
	icon: "SkypeCircleCheck",
	iconColor: "text-green-700",
};

const WSNotificationListItem: React.FunctionComponent<IWSNotificationListItemProps> = ({
	index,
	notification,
	onDismiss,
}) => {
	const { title, description, icon, iconColor, actionButtons } = {
		...defaultNotification,
		...notification,
	} as INotification;

	const onDismissLocal = useCallback(() => {
		onDismiss(index);
	}, [index, onDismiss]);

	const onClickActionButton = useCallback((destination: NotificationActionButtonsDestination) => {
		switch (destination) {
			default:
				break;
		}
	}, []);

	return (
		<div className="bg-white ring-opacity-5 shadow-lg rounded-lg ring-1 ring-black w-full max-w-sm overflow-hidden pointer-events-auto">
			<div className="p-4">
				<div className="flex items-start">
					<div className="flex-shrink-0">
						<WSIcon
							icon={icon as string}
							size={24}
							className={combineClassNames("h-6 w-6", iconColor as string)}
							aria-hidden
						/>
					</div>
					<div className="flex-1 ml-3 pt-0.5 w-0">
						<p className="font-medium text-gray-900 text-sm">{title}</p>
						<p className="mt-1 text-gray-500 text-sm">{description}</p>
						{!is.null(actionButtons) && (
							<ul className="flex gap-4 mt-4">
								{actionButtons!.map((button, index) => (
									<li key={index}>
										<WSButton
											onClick={() => onClickActionButton(button.destination)}
											style={button.style}>
											{button.text}
										</WSButton>
									</li>
								))}
							</ul>
						)}
					</div>
					<div className="flex flex-shrink-0 ml-4">
						<button
							type="button"
							className="inline-flex bg-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-gray-600 hover:text-gray-800 focus:outline-none"
							onClick={onDismissLocal}>
							<span className="sr-only">
								<FormattedMessage id={Strings.close} />
							</span>
							<WSIcon icon="Cancel" size={16} className="w-5 h-5" aria-hidden />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
