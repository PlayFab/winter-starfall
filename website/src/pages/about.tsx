/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback, useEffect, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { WSButton } from "../components/button";
import { WSIcon } from "../components/icon";
import { WSLink } from "../components/link";
import { SiteLogo } from "../components/logo";
import { Page } from "../components/page";
import { DivPageWrapper } from "../components/tailwind";
import { AppState } from "../redux/reducer";
import { routes } from "../router";
import { trackEvent } from "../shared/app-insights";
import { is } from "../shared/is";
import { links } from "../shared/links";
import gameLogoTextDark from "../static/logo-text-dark.png";
import gameLogoTextForcedColors from "../static/logo-text-forced-colors.png";
import playFabLogo from "../static/playfab-logo.png";
import Strings from "../strings";

export const AboutPage: React.FunctionComponent = () => {
	const intl = useIntl();

	return (
		<Page
			title={intl.formatMessage({ id: Strings.nav_about })}
			isPlayFabIdRequired={false}
			isTitleIdRequired={false}
			shouldHaveTopPadding>
			<DivPageWrapper>
				<div className="flex justify-center gap-12">
					<Link to={routes.Index()}>
						<img
							src={is.forcedColorsActive() ? gameLogoTextForcedColors : gameLogoTextDark}
							alt={intl.formatMessage({ id: Strings.site_title })}
							className="h-32"
						/>
					</Link>
					<SiteLogo className="w-32 h-32 shrink-0" />
				</div>
				<AboutPageFeature />
				<AboutPageLinks />
			</DivPageWrapper>
		</Page>
	);
};

const AboutPageFeature: React.FunctionComponent = () => {
	const intl = useIntl();
	const navigate = useNavigate();
	const isSignedIn = !is.null(useSelector((state: AppState) => state.site.playFabId));

	const features = useMemo(
		() => [
			{
				name: intl.formatMessage({ id: Strings.about_feature_1_title }),
				description: intl.formatMessage({ id: Strings.about_feature_1_description }),
				icon: "Code",
			},
			{
				name: intl.formatMessage({ id: Strings.about_feature_2_title }),
				description: intl.formatMessage({ id: Strings.about_feature_2_description }),
				icon: "PageData",
			},
			{
				name: intl.formatMessage({ id: Strings.about_feature_3_title }),
				description: intl.formatMessage({ id: Strings.about_feature_3_description }),
				icon: "ServerEnviroment",
			},
			{
				name: intl.formatMessage({ id: Strings.about_feature_4_title }),
				description: intl.formatMessage({ id: Strings.about_feature_4_description }),
				icon: "Starburst",
			},
		],
		[intl]
	);

	useEffect(() => {
		trackEvent({ name: `About page visited`, properties: {} });
	}, []);

	const onPlay = useCallback(() => {
		if (isSignedIn) {
			navigate(routes.Explore());
		} else {
			navigate(routes.Index());
		}
	}, [isSignedIn, navigate]);

	return (
		<div className="py-12">
			<div className="mx-auto px-6 lg:px-8 max-w-7xl">
				<div className="mx-auto max-w-2xl lg:text-center">
					<p className="mt-2 font-bold text-3xl text-gray-900 sm:text-4xl tracking-tight">
						<FormattedMessage id={Strings.about_title} />
					</p>
					<p className="mt-6 text-gray-600 text-lg leading-8">
						<FormattedMessage id={Strings.about_subtitle} />
					</p>
				</div>
				<div className="mx-auto max-w-2xl lg:text-center">
					<ul className="flex flex-wrap md:flex-nowrap justify-center items-center gap-4 mt-8 w-full">
						<li>
							<WSButton onClick={onPlay}>
								<FormattedMessage id={Strings.play_long} />
							</WSButton>
						</li>
						<li>
							<WSLink
								to={links.github}
								isExternal
								onClick={() => {
									trackEvent({ name: `Link to Github clicked`, properties: {} });
								}}>
								<FormattedMessage id={Strings.footer_vo_code} /> &raquo;
							</WSLink>
						</li>
					</ul>
				</div>
				<div className="mx-auto mt-16 sm:mt-20 lg:mt-24 max-w-2xl lg:max-w-4xl">
					<dl className="gap-x-8 gap-y-10 lg:gap-y-16 grid grid-cols-1 lg:grid-cols-2 max-w-xl lg:max-w-none">
						{features.map(feature => (
							<div key={feature.name} className="relative pl-16">
								<dt className="font-semibold text-base text-gray-900 leading-7">
									<div className="-top-1 left-0 absolute flex justify-center items-center w-12 h-12">
										<WSIcon
											icon={feature.icon}
											className="w-12 h-12 text-link"
											size={30}
											aria-hidden
										/>
									</div>
									{feature.name}
								</dt>
								<dd className="mt-2 text-base text-gray-600 leading-7">{feature.description}</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</div>
	);
};

const AboutPageLinks: React.FunctionComponent = () => {
	const intl = useIntl();

	const navigation = {
		microsoft: [
			{ name: intl.formatMessage({ id: Strings.microsoft }), href: links.microsoft },
			{ name: intl.formatMessage({ id: Strings.playfab }), href: links.playfab },
		],
		playfab: [
			{ name: intl.formatMessage({ id: Strings.documentation }), href: links.documentation },
			{ name: intl.formatMessage({ id: Strings.blog }), href: links.blog },
			{ name: intl.formatMessage({ id: Strings.forums }), href: links.forums },
			{ name: intl.formatMessage({ id: Strings.contact_us }), href: links.contactUs },
		],
		social: [
			{ name: intl.formatMessage({ id: Strings.facebook }), href: links.facebook },
			{ name: intl.formatMessage({ id: Strings.twitter }), href: links.twitter },
			{ name: intl.formatMessage({ id: Strings.linkedin }), href: links.linkedIn },
			{ name: intl.formatMessage({ id: Strings.discord }), href: links.discord },
			{ name: intl.formatMessage({ id: Strings.youtube }), href: links.youtube },
			{ name: intl.formatMessage({ id: Strings.github }), href: links.githubPlayFab },
		],
		legal: [
			{ name: intl.formatMessage({ id: Strings.privacy_policy_title }), href: routes.Privacy() },
			{ name: intl.formatMessage({ id: Strings.terms_of_service_title }), href: routes.Terms() },
		],
	};

	return (
		<footer aria-labelledby="footer-heading">
			<h2 id="footer-heading" className="sr-only">
				<FormattedMessage id={Strings.footer} />
			</h2>
			<div className="mx-auto px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32 pb-8 max-w-7xl">
				<div className="xl:gap-8 xl:grid xl:grid-cols-3">
					<div className="space-y-8">
						<a href={links.playfab} className="inline-block">
							<img className="h-12" src={playFabLogo} alt={intl.formatMessage({ id: Strings.playfab })} />
						</a>
						<p className="text-gray-600 text-sm leading-6">
							<FormattedMessage id={Strings.about_footer_tagline} />
						</p>
					</div>
					<div className="gap-8 grid grid-cols-2 xl:col-span-2 mt-16 xl:mt-0">
						<div className="md:gap-8 md:grid md:grid-cols-2">
							<div>
								<h3 className="font-semibold text-gray-900 text-sm leading-6">
									<FormattedMessage id={Strings.microsoft} />
								</h3>
								<ul role="list" className="space-y-4 mt-6">
									{navigation.microsoft.map(item => (
										<li key={item.name}>
											<WSLink to={item.href} className="text-sm">
												{item.name}
											</WSLink>
										</li>
									))}
								</ul>
							</div>
							<div className="mt-10 md:mt-0">
								<h3 className="font-semibold text-gray-900 text-sm leading-6">
									<FormattedMessage id={Strings.playfab} />
								</h3>
								<ul role="list" className="space-y-4 mt-6">
									{navigation.playfab.map(item => (
										<li key={item.name}>
											<WSLink to={item.href} className="text-sm">
												{item.name}
											</WSLink>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className="md:gap-8 md:grid md:grid-cols-2">
							<div>
								<h3 className="font-semibold text-gray-900 text-sm leading-6">
									<FormattedMessage id={Strings.social} />
								</h3>
								<ul role="list" className="space-y-4 mt-6">
									{navigation.social.map(item => (
										<li key={item.name}>
											<WSLink to={item.href} className="text-sm">
												{item.name}
											</WSLink>
										</li>
									))}
								</ul>
							</div>
							<div className="mt-10 md:mt-0">
								<h3 className="font-semibold text-gray-900 text-sm leading-6">
									<FormattedMessage id={Strings.legal} />
								</h3>
								<ul role="list" className="space-y-4 mt-6">
									{navigation.legal.map(item => (
										<li key={item.name}>
											<WSLink to={item.href} className="text-sm">
												{item.name}
											</WSLink>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
