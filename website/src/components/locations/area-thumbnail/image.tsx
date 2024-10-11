/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { combineClassNames } from "../../../shared/helpers";
import { ILocationArea, IPropsClassName } from "../../../shared/types";

interface IAreaThumbnailImageProps extends IPropsClassName {
	imageUri: string;
	visited: boolean;
	area: ILocationArea;
	onClick: () => void;
}

export const AreaThumbnailImage: React.FunctionComponent<IAreaThumbnailImageProps> = ({
	area,
	onClick,
	visited,
	imageUri,
	className,
}) => (
	<img
		src={imageUri}
		title={area.name}
		aria-label={area.name}
		alt={area.description}
		className={combineClassNames(
			"m-1 h-28 w-28 shrink-0 cursor-pointer rounded-bl-xl rounded-tl-xl bg-white object-cover md:h-48 md:w-48",
			visited ? "opacity-50" : "",
			className!
		)}
		onClick={onClick}
	/>
);
