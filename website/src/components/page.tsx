/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { AppState } from "../redux/reducer";
import { siteSlice } from "../redux/slice-site";
import { routes } from "../router";
import { trackPageView } from "../shared/app-insights";
import { combineClassNames } from "../shared/helpers";
import { is } from "../shared/is";
import { IPropsChildrenClassName } from "../shared/types";
import keyArt from "../static/key-art.jpg";
import Strings from "../strings";
import { WSNotification } from "./notification";
import { PlayFabActivitySidebar } from "./playfab/sidebar";

interface IProps extends IPropsChildrenClassName {
	title: string;

	isTitleIdRequired?: boolean;
	isPlayFabIdRequired?: boolean;
	useBackgroundKeyArt?: boolean;
	shouldHaveTopPadding?: boolean;
}

type IParams = "locale" | "titleid" | "cloud";

export const Page: React.FunctionComponent<IProps> = ({
	title,
	isPlayFabIdRequired = true,
	isTitleIdRequired = true,
	useBackgroundKeyArt,
	children,
	className,
	shouldHaveTopPadding,
}) => {
	const intl = useIntl();
	const params = useParams<Record<IParams, string>>();
	const dispatch = useDispatch();

	const titleId = useSelector((state: AppState) => state.site.titleId);
	const cloud = useSelector((state: AppState) => state.site.cloud);
	const playFabId = useSelector((state: AppState) => state.site.playFabId);
	const isPlayFabActivityVisible = useSelector((state: AppState) => state.playfab.isVisible);
	const isSignedIn = !is.null(playFabId);

	useEffect(() => {
		if (params.titleid !== titleId) {
			dispatch(siteSlice.actions.titleId(params.titleid as string));
		}

		if (params.cloud !== cloud) {
			dispatch(siteSlice.actions.cloud(params.cloud as string));
		}
	}, [cloud, dispatch, params, params.cloud, params.titleid, titleId]);

	useEffect(() => {
		// Scroll to top when the "page" changes
		window.scrollTo(0, 0);
		trackPageView({ name: title });
	}, [title]);

	if (isTitleIdRequired && is.null(titleId) && is.null(params.titleid)) {
		return <Navigate to={routes.Index()} />;
	}

	if (isPlayFabIdRequired && !isSignedIn) {
		return <Navigate to={routes.Index()} />;
	}

	let contentWrapperClassNameBase =
		"min-h-screen bg-gray-50 transition-all xl:mx-auto xl:min-h-0 xl:max-w-screen-xl xl:rounded-3xl xl:shadow-2xl xl:shadow-gray-500";
	const contentWrapperClassNameShouldHaveTopPadding = shouldHaveTopPadding
		? ""
		: "xl:rounded-tl-none xl:rounded-tr-none";
	const contentWrapperClassNameUseBackgroundKeyArt = useBackgroundKeyArt
		? "h-screen bg-cover bg-fixed bg-center bg-no-repeat xl:max-h-page-bg"
		: "";

	if (isPlayFabActivityVisible && isSignedIn) {
		contentWrapperClassNameBase =
			"min-h-screen bg-gray-50 transition-all xl:mx-auto xl:min-h-0 xl:max-w-screen-2xl xl:shadow-2xl xl:shadow-gray-500";
	}

	return (
		<HelmetProvider>
			<Helmet>
				<title>{`${intl.formatMessage({ id: Strings.site_title })}${is.null(title) ? "" : ` - ${title}`}`}</title>
			</Helmet>
			<div
				className={combineClassNames(
					shouldHaveTopPadding ? "xl:pb-16 xl:pt-8" : "",
					useBackgroundKeyArt ? "xl:overflow-y-hidden" : ""
				)}>
				<main
					className={combineClassNames(
						contentWrapperClassNameBase,
						contentWrapperClassNameShouldHaveTopPadding,
						contentWrapperClassNameUseBackgroundKeyArt,
						className!
					)}
					style={useBackgroundKeyArt ? { backgroundImage: `url('${keyArt}')` } : undefined}
					role="main">
					{isPlayFabActivityVisible && isSignedIn ? (
						<div className="grid grid-cols-playfab-visible">
							{children}
							<PlayFabActivitySidebar />
						</div>
					) : (
						<>{children}</>
					)}
				</main>
			</div>
			<WSNotification />
		</HelmetProvider>
	);
};
