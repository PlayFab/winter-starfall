/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useIntl } from "react-intl";
import Strings from "../../../strings";
import { Section } from "../../tailwind";
import { PlayerCurrencyList } from "./list";

export const PlayerCurrenciesSection: React.FunctionComponent = () => {
	const intl = useIntl();

	return (
		<Section title={intl.formatMessage({ id: Strings.currencies })} showTitleUnderline={false}>
			<PlayerCurrencyList />
		</Section>
	);
};
