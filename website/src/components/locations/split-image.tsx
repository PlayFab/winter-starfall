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
			<div className="lg:flex lg:justify-between xl:justify-end mx-auto lg:px-8 max-w-site">
				<div className="xl:right-1/2 lg:flex lg:w-1/2 lg:shrink xl:absolute xl:inset-y-0 lg:grow-0 xl:w-1/2">
					<div className="relative lg:-ml-8 xl:ml-0 lg:w-full h-80 lg:h-auto lg:grow">
						<img
							src={getLocationImageUrl(location?.image as string, "full")}
							alt={location?.description}
							className={imgClassName}
						/>
					</div>
				</div>
				<div className="px-3 sm:px-6 lg:contents">
					<div className="lg:flex-none mx-auto lg:mr-0 lg:ml-8 pb-12 lg:w-full xl:w-1/2 max-w-2xl lg:max-w-lg">
						<Header />
						<div className="sm:py-20">{children}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
