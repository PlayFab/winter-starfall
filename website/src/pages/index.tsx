/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Page } from "../components/page";
import { PlayLearnMoreArea } from "../components/play-learn-more";
import { AppState } from "../redux/reducer";
import { routes } from "../router";
import { combineClassNames } from "../shared/helpers";
import { is } from "../shared/is";
import { IPropsClassName } from "../shared/types";
import imgLogoText from "../static/logo-text.png";
import Strings from "../strings";

export const IndexPage: React.FunctionComponent = () => {
	const titleId = useSelector((state: AppState) => state.site.titleId);
	const playFabId = useSelector((state: AppState) => state.site.playFabId);
	const loginProgress = useSelector((state: AppState) => state.site.loginProgress);
	const isLoginInProgress = is.null(loginProgress) || loginProgress.some(progress => !progress);

	if (!is.null(titleId) && !is.null(playFabId) && !isLoginInProgress) {
		return <Navigate to={routes.Explore()} />;
	}

	return (
		<Page title="" isPlayFabIdRequired={false} isTitleIdRequired={false} useBackgroundKeyArt shouldHaveTopPadding>
			<div className="flex h-screen flex-col items-center justify-end xl:-mt-24">
				<IndexPageTitleLogo />
				<div className="mb-16 mt-4 sm:mt-8">
					<PlayLearnMoreArea />
				</div>
			</div>
		</Page>
	);
};

const IndexPageTitleLogo: React.FunctionComponent<IPropsClassName> = ({ className }) => {
	const intl = useIntl();

	return (
		<h1 className={combineClassNames("text-center", className!)}>
			<img src={imgLogoText} alt={intl.formatMessage({ id: Strings.site_title })} className="h-48 w-auto" />
		</h1>
	);
};
