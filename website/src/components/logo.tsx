/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppState } from "../redux/reducer";
import { routes } from "../router";
import { combineClassNames } from "../shared/helpers";
import { is } from "../shared/is";
import { IPropsClassName } from "../shared/types";
import imgLogoSquare from "../static/logo-square.png";
import playFabLogo from "../static/playfab-logo.png";
import Strings from "../strings";

export const SiteLogo: React.FunctionComponent<IPropsClassName> = ({ className }) => {
	const intl = useIntl();
	const isSignedIn = !is.null(useSelector((state: AppState) => state.site.playFabId));

	const link = isSignedIn ? routes.Explore() : routes.Index();

	return (
		<Link to={link}>
			<img
				className={combineClassNames("h-16 w-auto", className!)}
				src={imgLogoSquare}
				title={intl.formatMessage({ id: Strings.site_title })}
				aria-label={intl.formatMessage({ id: Strings.site_title })}
			/>
		</Link>
	);
};

export const PlayFabLogo: React.FunctionComponent<IPropsClassName> = ({ className }) => {
	const intl = useIntl();
	return (
		<img
			src={playFabLogo}
			alt={intl.formatMessage({ id: Strings.playfab })}
			className={combineClassNames("h-16 w-auto", className!)}
		/>
	);
};
