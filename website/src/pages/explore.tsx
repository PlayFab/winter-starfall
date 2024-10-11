/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { ExploreLocationArea } from "../components/locations/area";
import { ExploreLocation } from "../components/locations/location";
import { ExploreTheEnd } from "../components/locations/the-end";
import { Page } from "../components/page";
import { AppState } from "../redux/reducer";
import { is } from "../shared/is";
import { ILocation, ILocationArea } from "../shared/types";
import Strings from "../strings";

export const ExplorePage: React.FunctionComponent = () => {
	const intl = useIntl();

	return (
		<Page title={intl.formatMessage({ id: Strings.nav_explore })}>
			<ExplorePageContent />
		</Page>
	);
};

const ExplorePageContent: React.FunctionComponent = () => {
	const locations = useSelector((state: AppState) => state.site.locations);
	const playerMap = useSelector((state: AppState) => state.site.userDataPlayer.location.map);
	const playerLocationId = useSelector((state: AppState) => state.site.userDataPlayer.location.id);
	const currentAreaId = useSelector((state: AppState) => state.site.currentAreaId);
	const isTheEnd = useSelector((state: AppState) => state.site.isTheEnd);

	const location = locations.locations.find(location => location.id === playerLocationId);
	const areas = location?.areas?.filter(area => is.inArray(playerMap, area.id));
	const area = areas?.find(a => a.id === currentAreaId);

	useEffect(() => {
		// Scroll to top when the "page" changes
		window.scrollTo(0, 0);
	}, [playerLocationId, currentAreaId]);

	if (isTheEnd) {
		return <ExploreTheEnd location={is.null(area) ? (location as ILocation) : (area as ILocationArea)} />;
	}

	if (is.null(area)) {
		return <ExploreLocation location={location as ILocation} />;
	}

	return <ExploreLocationArea area={area as ILocationArea} />;
};
