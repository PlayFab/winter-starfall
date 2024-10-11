/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useCinematic } from "../../hooks/use-cinematic";
import { AppState } from "../../redux/reducer";
import { is } from "../../shared/is";
import { Loading } from "../loading";
import { CinematicEventSwitch } from "./events";
import { CinematicWrapper } from "./wrappers";

interface IProps {
	script: string;
}

export const Cinematic: React.FunctionComponent<IProps> = ({ script }) => {
	const currentCinematic = useSelector((state: AppState) => state.site.currentCinematic);
	const { cinematic, isLoading, onSkipCinematic, canSkipCinematic } = useCinematic(script, currentCinematic);
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!wrapperRef.current) {
			return;
		}

		if (window.scrollY < wrapperRef.current.offsetTop && window.matchMedia("(min-width: 768px)").matches) {
			return;
		}

		// Scroll to top when the cinematic changes
		window.scrollTo(0, wrapperRef.current.offsetTop);
	}, [currentCinematic]);

	if (isLoading) {
		return <Loading isLoading={isLoading} />;
	}

	if (is.null(cinematic) || is.null(cinematic?.events)) {
		return null;
	}

	return (
		<div ref={wrapperRef}>
			<CinematicWrapper cinematic={cinematic}>
				<ul>
					{cinematic?.events.map((event, index) => (
						<li key={index}>
							<CinematicEventSwitch
								event={event}
								onSkipCinematic={onSkipCinematic}
								canSkipCinematic={canSkipCinematic}
								totalEvents={cinematic.events.length}
							/>
						</li>
					))}
				</ul>
			</CinematicWrapper>
		</div>
	);
};
