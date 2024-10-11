/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { PlayFabError } from "..";
import { combineClassNames } from "../shared/helpers";
import { is } from "../shared/is";
import { IPropsChildrenClassName } from "../shared/types";
import Strings from "../strings";
import { WSButton } from "./button";
import { WSIcon } from "./icon";

interface IProps {
	error?: PlayFabError;
	onRetry?: () => void;
}

export const Errors: React.FunctionComponent<IProps> = ({ error, onRetry }) => {
	const intl = useIntl();

	const details = useMemo(() => {
		const messages: string[] = [];

		if (is.null(error?.errorDetails)) {
			return messages;
		}

		for (const detail in error?.errorDetails) {
			for (const detailMessage in error?.errorDetails[detail]) {
				messages.push(error?.errorDetails[detail][detailMessage]);
			}
		}

		return messages;
	}, [error?.errorDetails]);

	if (is.null(error) || is.null(error?.error)) {
		return null;
	}

	return (
		<div className="bg-red-50 mx-auto my-8 p-4 border border-red-300 border-solid rounded-md max-w-screen-lg">
			<div className="flex">
				<div className="flex-shrink-0">
					<WSIcon icon="StatusErrorFull" className="w-5 h-5 text-red-400" />
				</div>
				<div className="ml-3 overflow-auto">
					<h3 className="font-medium text-red-800 text-sm break-words">
						<FormattedMessage
							id={Strings.error_code_message}
							values={{
								code: error?.code || -1,
								message: error?.errorMessage || intl.formatMessage({ id: Strings.error_unknown }),
							}}
						/>
					</h3>
					<div className="mt-2 text-red-700 text-sm">
						<ul role="list" className="space-y-1 pl-5 list-disc">
							{details.map((detail, index) => (
								<li key={index}>{detail}</li>
							))}
						</ul>
					</div>
					{!is.null(onRetry) && (
						<div className="mt-4">
							<WSButton style="light" onClick={onRetry!}>
								<FormattedMessage id={Strings.retry} />
							</WSButton>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export const Warning: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<div className={combineClassNames("rounded-md bg-yellow-50 p-4", className!)}>
		<div className="flex">
			<div className="flex-shrink-0">
				<WSIcon icon="Warning" className="-mt-2 text-yellow-400" />
			</div>
			<div className="ml-3">
				<h3 className="font-medium text-sm text-yellow-800">{children}</h3>
			</div>
		</div>
	</div>
);
