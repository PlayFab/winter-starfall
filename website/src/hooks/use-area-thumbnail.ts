/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useState } from "react";
import { getLocationImageUrl } from "../shared/helpers";
import { is } from "../shared/is";
import { ILocationArea } from "../shared/types";

interface IResults {
	imageUri: string;
	description: string;
	isHovering: boolean;
	onClickArea: () => void;
	onMouseOverImage: () => void;
	onMouseOutImage: () => void;
}

export function useAreaThumbnail(area: ILocationArea, onClick: (id: string) => void): IResults {
	const imageUriOriginal = getLocationImageUrl(area.image, "thumbnail");
	const imageUriHover = getLocationImageUrl(area.imageHover as string, "thumbnail");
	const [isHovering, setIsHovering] = useState(false);

	const onMouseOverImage = useCallback(() => {
		if (!is.null(area.imageHover)) {
			setIsHovering(true);
		}
	}, [area.imageHover]);

	const onMouseOutImage = useCallback(() => {
		setIsHovering(false);
	}, []);

	const onClickArea = useCallback(() => {
		onClick(area.id);
	}, [area, onClick]);

	return {
		imageUri: isHovering ? imageUriHover || imageUriOriginal : imageUriOriginal,
		description: isHovering ? area.descriptionHover || area.description : area.description,
		isHovering,
		onClickArea,
		onMouseOutImage,
		onMouseOverImage,
	};
}
