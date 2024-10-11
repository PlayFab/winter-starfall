/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useEffect, useState } from "react";
import { is } from "../../../shared/is";
import { ANIMATION_TIME_WATCH_BAR_FILL, IPlayerCharacterReadonlyComparison } from "../../../shared/types";
import { PartyCharacter } from "../../party/character/character";
import { UlGrid } from "../../tailwind";

interface ICombatResultCharacterListProps {
	characters: IPlayerCharacterReadonlyComparison[];
}

export const CombatResultCharacterList: React.FunctionComponent<ICombatResultCharacterListProps> = ({ characters }) => {
	const [shouldOverrideCharacter, setShouldOverrideCharacter] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => setShouldOverrideCharacter(true), ANIMATION_TIME_WATCH_BAR_FILL);

		return () => clearTimeout(timeout);
	}, []);

	if (is.null(characters)) {
		return null;
	}

	return (
		<UlGrid columns={2}>
			{characters.map((c, index) => (
				<li key={index}>
					<PartyCharacter
						id={c.after.id}
						overrideCharacterReadOnly={shouldOverrideCharacter ? c.after : c.before}
						lastCharacterReadOnly={shouldOverrideCharacter ? c.before : undefined}
						showEquipment={false}
						showStats
					/>
				</li>
			))}
		</UlGrid>
	);
};
