/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Strings from "../strings";
import { IWSLink, WSLink } from "./link";

interface IProps {
	link: IWSLink;
}

export const BackLink: React.FunctionComponent<IProps> = ({ link }) => {
	const intl = useIntl();

	return (
		<nav aria-label={intl.formatMessage({ id: Strings.back })} className="inline-block my-2">
			<WSLink {...link} className="flex items-center font-medium text-sm hover:no-underline">
				&laquo;&nbsp;
				<span className="hover:underline">
					<FormattedMessage id={Strings.back} />
				</span>
			</WSLink>
		</nav>
	);
};
