/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useIntl } from "react-intl";
import { getCharacterImageUrl, getCharacterName } from "../../shared/helpers";
import { is } from "../../shared/is";
import { CinematicEventSpeaker, IPropsClassName } from "../../shared/types";

interface ICinematicEventSpeakerImageProps extends IPropsClassName {
	speaker: CinematicEventSpeaker | undefined;
}

export const CinematicEventSpeakerImage: React.FunctionComponent<ICinematicEventSpeakerImageProps> = ({
	speaker,
	className,
}) => {
	const intl = useIntl();
	const speakerName = getCharacterName(speaker, intl);

	if (is.null(speaker)) {
		return null;
	}

	return (
		<img
			src={getCharacterImageUrl(speaker)}
			alt={speakerName}
			title={speakerName}
			aria-label={speakerName}
			className={className}
		/>
	);
};
