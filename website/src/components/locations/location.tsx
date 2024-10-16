/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCinematic } from "../../hooks/use-cinematic";
import { AppState } from "../../redux/reducer";
import { siteSlice } from "../../redux/slice-site";
import { trackEvent } from "../../shared/app-insights";
import { is } from "../../shared/is";
import { ILocation } from "../../shared/types";
import { BackLink } from "../back-link";
import { CinematicEventSwitch } from "../cinematics/events";
import { WSMusicPlayer } from "../music";
import { H1Left, PSubtitle } from "../tailwind";
import { ExploreLocationAreaThumbnail } from "./area-thumbnail/layout-normal";
import { ExploreLocationAreaThumbnailTight } from "./area-thumbnail/layout-tight";
import { LocationSplitWithImage } from "./split-image";

interface IProps {
	location: ILocation;
}

export const ExploreLocation: React.FunctionComponent<IProps> = ({ location }) => {
	const [shouldRenderCinematics, setShouldRenderCinematics] = useState(false);
	const hasBackLink = !is.null(location?.backLink);

	const onBack = useCallback(() => {
		if (!hasBackLink) {
			return;
		}

		setShouldRenderCinematics(true);
	}, [hasBackLink]);

	useEffect(() => {
		trackEvent({ name: "Location", properties: { location: location?.name } });
	}, [location?.name]);

	return (
		<LocationSplitWithImage location={location}>
			{hasBackLink && (
				<BackLink
					link={{
						to: "",
						onClick: onBack,
					}}
				/>
			)}
			<div className={hasBackLink ? "mt-4" : ""}>
				<H1Left>{location?.name}</H1Left>
				<PSubtitle>{location?.description}</PSubtitle>
				<ExploreLocationLayout location={location} />
			</div>
			<ExploreLocationCinematics
				isVisible={shouldRenderCinematics}
				cinematicId={location?.backLink}
				script={location?.script}
			/>
			<WSMusicPlayer />
		</LocationSplitWithImage>
	);
};

interface IExploreLocationLayoutProps {
	location?: ILocation;
}

const ExploreLocationLayout: React.FunctionComponent<IExploreLocationLayoutProps> = ({ location }) => {
	const dispatch = useDispatch();

	const playerMap = useSelector((state: AppState) => state.site.userDataPlayer.location.map);
	const areas = location?.areas?.filter(area => is.inArray(playerMap, area.id));

	const onSetArea = useCallback(
		(id: string) => {
			dispatch(siteSlice.actions.exploreAreaSet(id));
		},
		[dispatch]
	);

	switch (location?.layout) {
		case "grid":
			return (
				<ul className="mt-12 grid grid-cols-2 gap-4">
					{areas?.map(area => (
						<li key={area.id}>
							<ExploreLocationAreaThumbnailTight area={area} onClick={onSetArea} />
						</li>
					))}
				</ul>
			);
		case "areas":
		default:
			return (
				<ul className="mt-12">
					{areas?.map(area => (
						<li key={area.id} className="mt-6 first:mt-0">
							<ExploreLocationAreaThumbnail area={area} onClick={onSetArea} />
						</li>
					))}
				</ul>
			);
	}
};

interface IExploreLocationCinematicsProps {
	isVisible: boolean;
	script?: string;
	cinematicId?: string;
}

const ExploreLocationCinematics: React.FunctionComponent<IExploreLocationCinematicsProps> = ({
	isVisible,
	cinematicId,
	script,
}) => {
	const { cinematic, onSkipCinematic, canSkipCinematic } = useCinematic(script || "", cinematicId || "");

	if (!isVisible) {
		return null;
	}

	// Hopefully this is only used for automated actions
	return (
		<>
			{cinematic?.events.map((event, index) => (
				<CinematicEventSwitch
					key={index}
					event={event}
					onSkipCinematic={onSkipCinematic}
					canSkipCinematic={canSkipCinematic}
					totalEvents={cinematic.events.length}
				/>
			))}
		</>
	);
};
