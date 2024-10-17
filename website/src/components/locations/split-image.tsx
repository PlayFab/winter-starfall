/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/reducer";
import { getLocationImageUrl } from "../../shared/helpers";
import { is } from "../../shared/is";
import { ILocationBase, IPropsChildren } from "../../shared/types";
import { Header } from "../header";
import { WSMusicPlayer } from "../music";

interface IProps extends IPropsChildren {
	location: ILocationBase | undefined;
}

export const LocationSplitWithImage: React.FunctionComponent<IProps> = ({ children, location }) => {
	const isPlayFabActivityVisible = useSelector((state: AppState) => state.playfab.isVisible);
	const isSignedIn = !is.null(useSelector((state: AppState) => state.site.playFabId));

	let imgClassName = "absolute inset-0 h-full w-full bg-gray-50 object-cover xl:rounded-bl-3xl";

	if (isPlayFabActivityVisible && isSignedIn) {
		imgClassName = "absolute inset-0 h-full w-full bg-gray-50 object-cover";
	}

	return (
		<div className="relative">
			<div className="mx-auto max-w-site lg:flex lg:justify-between lg:px-8 xl:justify-end">
				<div className="lg:flex lg:w-1/2 lg:shrink lg:grow-0 xl:absolute xl:inset-y-0 xl:right-1/2 xl:w-1/2">
					<div className="relative h-80 lg:-ml-8 lg:h-auto lg:w-full lg:grow xl:ml-0">
						<img
							src={getLocationImageUrl(location?.image as string, "full")}
							alt={location?.description}
							className={imgClassName}
						/>
					</div>
				</div>
				<div className="px-3 sm:px-6 lg:contents">
					<div className="mx-auto max-w-2xl pb-12 lg:ml-8 lg:mr-0 lg:w-full lg:max-w-lg lg:flex-none xl:w-1/2">
						<Header />
						<WSMusicPlayer />
						<div className="sm:py-20">{children}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
