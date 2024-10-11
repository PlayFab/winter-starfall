/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../redux/reducer";
import { siteSlice } from "../redux/slice-site";
import { is } from "../shared/is";
import { ILocationArea } from "../shared/types";

interface IResults {
	resetCurrentArea: () => void;
}

export function useArea(area: ILocationArea): IResults {
	const dispatch = useDispatch();
	const playerCinematicProgression = useSelector((state: AppState) => state.site.userDataPlayer.cinematicProgression);
	const siteCinematicProgression = useSelector((state: AppState) => state.site.cinematicData.progressions);

	useEffect(() => {
		// Figure out which cinematic is the current one
		let cinematicName = "";
		let cinematicId = "";
		let shouldAddCinematicProgression = false;

		if (!is.null(area.cinematic)) {
			cinematicName = area.cinematic!;
		} else if (!is.null(area.cinematicProgression)) {
			const matchingPlayerProgression = playerCinematicProgression.find(p => p.id === area.cinematicProgression);
			const matchingCinematicProgression = siteCinematicProgression.find(p => p.id === area.cinematicProgression);

			if (!matchingCinematicProgression) {
				// Something is deeply wrong
				return;
			}

			cinematicId = matchingCinematicProgression.id;

			if (!matchingPlayerProgression) {
				// You've never been here. Start at the beginning.
				cinematicName = matchingCinematicProgression.cinematics[0];
				shouldAddCinematicProgression = true;
			} else {
				// You've done at least one of this cinematic progression
				// Have you been here specifically before?
				const thisAreaCinematicProgressionIndex = matchingPlayerProgression.cinematics.findIndex(
					c => c === area.id
				);

				if (thisAreaCinematicProgressionIndex === -1) {
					// Haven't done this before.
					cinematicName =
						matchingCinematicProgression.cinematics[matchingPlayerProgression.cinematics.length];
					shouldAddCinematicProgression = true;
				} else {
					// Have
					cinematicName = matchingCinematicProgression.cinematics[thisAreaCinematicProgressionIndex];
				}
			}
		}

		if (shouldAddCinematicProgression) {
			dispatch(
				siteSlice.actions.cinematicProgressionAdd({
					cinematicId: cinematicId,
					areaId: area.id,
				})
			);
		}

		dispatch(siteSlice.actions.exploreCinematicSet(cinematicName));
	}, [area, siteCinematicProgression, dispatch, playerCinematicProgression]);

	const resetCurrentArea = useCallback(() => {
		dispatch(siteSlice.actions.exploreAreaReset());
	}, [dispatch]);

	return {
		resetCurrentArea,
	};
}
