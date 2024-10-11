/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/reducer";
import { siteSlice } from "../../redux/slice-site";
import { ILocationBase } from "../../shared/types";
import theEndArt from "../../static/events/the-end.jpg";
import { BackLink } from "../back-link";
import { DivCard, H2Centered } from "../tailwind";
import { LocationSplitWithImage } from "./split-image";

interface IProps {
	location: ILocationBase;
}

export const ExploreTheEnd: React.FunctionComponent<IProps> = ({ location }) => {
	const dispatch = useDispatch();
	const isTheEnd = useSelector((state: AppState) => state.site.isTheEnd);

	const onClick = useCallback(() => {
		dispatch(siteSlice.actions.isTheEnd(false));
	}, [dispatch]);

	if (!isTheEnd) {
		return null;
	}

	return (
		<LocationSplitWithImage location={location}>
			<BackLink
				link={{
					to: "",
					onClick,
				}}
			/>
			<DivCard className="mt-4">
				<div className="py-4 text-center">
					<H2Centered className="text-2xl !font-bold">The End</H2Centered>
					<p>You&apos;ve reached the end of our content for Winter Starfall.</p>
					<p>Check back in a few weeks!</p>
				</div>
				<img src={theEndArt} alt="The End" className="rounded-bl-xl rounded-br-xl" />
			</DivCard>
		</LocationSplitWithImage>
	);
};
