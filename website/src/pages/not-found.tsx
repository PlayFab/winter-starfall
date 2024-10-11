/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { Page } from "../components/page";
import { DivPageWrapper, H1Centered, PSubtitle } from "../components/tailwind";

export const NotFoundPage: React.FunctionComponent = () => {
	return (
		<Page title="Page Not Found">
			<DivPageWrapper>
				<H1Centered>Page Not Found</H1Centered>
				<PSubtitle>Sorry, we couldn&apos;t find that page.</PSubtitle>
			</DivPageWrapper>
		</Page>
	);
};
