/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useIntl } from "react-intl";
import { getCharacterName } from "../../shared/helpers";
import { CinematicEventSpeaker } from "../../shared/types";
import { CinematicEventSpeakerImage } from "../cinematics/images";
import { Section } from "../tailwind";

interface IProps {
	id: CinematicEventSpeaker;
}

export const PartyGuest: React.FunctionComponent<IProps> = ({ id }) => {
	const intl = useIntl();

	const name = getCharacterName(id, intl);

	return (
		<Section title={name} showTitleUnderline={false}>
			<div className="flex items-end">
				<div className="shrink-0">
					<CinematicEventSpeakerImage
						speaker={id}
						className="relative -left-4 top-4 h-36 w-36 rounded-bl-xl bg-cover"
					/>
				</div>
			</div>
		</Section>
	);
};
