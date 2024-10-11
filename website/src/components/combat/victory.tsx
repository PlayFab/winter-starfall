/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage } from "react-intl";
import { useCombatVictory } from "../../hooks/use-combat-victory";
import Strings from "../../strings";
import { Errors } from "../errors";
import { Loading } from "../loading";
import { H1Left } from "../tailwind";

export const CombatVictory: React.FunctionComponent = () => {
	const { isLoading, error, onRetry } = useCombatVictory();

	return (
		<>
			<H1Left>
				<FormattedMessage id={Strings.combat_victory} />
			</H1Left>
			<div className="my-4">
				{isLoading ? (
					<Loading isLoading={isLoading} />
				) : (
					<>
						<Errors error={error} onRetry={onRetry} />
					</>
				)}
			</div>
		</>
	);
};
