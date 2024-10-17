/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useEffect } from "react";
import { useArea } from "../../hooks/use-area";
import { trackEvent } from "../../shared/app-insights";
import { is } from "../../shared/is";
import { ILocationArea, IPropsChildren } from "../../shared/types";
import { BackLink } from "../back-link";
import { Cinematic } from "../cinematics/cinematic";
import { ExploreLocationAreaCombat } from "../combat/combat";
import { StoreSingle } from "../store/store-single";
import { LocationSplitWithImage } from "./split-image";

interface IProps {
	area: ILocationArea;
}

export const ExploreLocationArea: React.FunctionComponent<IProps> = ({ area }) => {
	const { resetCurrentArea } = useArea(area);

	useEffect(() => {
		trackEvent({ name: "Area", properties: { location: area.name } });
	}, [area.name]);

	switch (area.type) {
		case 0:
			return (
				<ExploreLocationAreaWrapper area={area} resetCurrentArea={resetCurrentArea}>
					{!is.null(area.script) && (
						<div className="mb-8 mt-4">
							<Cinematic script={area.script as string} />
						</div>
					)}
					<div className="mt-4">
						<StoreSingle storeName={area.store as string} description={area.description as string} />
					</div>
				</ExploreLocationAreaWrapper>
			);
		case 1:
			return (
				<ExploreLocationAreaWrapper area={area} resetCurrentArea={resetCurrentArea} hideBackLink>
					<div className="mt-4">
						<ExploreLocationAreaCombat area={area} />
					</div>
				</ExploreLocationAreaWrapper>
			);
		case 2:
			return (
				<ExploreLocationAreaWrapper area={area} resetCurrentArea={resetCurrentArea}>
					<div className="mt-4">
						<Cinematic script={area.script as string} />
					</div>
				</ExploreLocationAreaWrapper>
			);
	}
};

interface IExploreLocationAreaWrapperProps extends IPropsChildren {
	area: ILocationArea;
	hideBackLink?: boolean;

	resetCurrentArea: () => void;
}

const ExploreLocationAreaWrapper: React.FunctionComponent<IExploreLocationAreaWrapperProps> = ({
	area,
	children,
	hideBackLink,
	resetCurrentArea,
}) => {
	return (
		<LocationSplitWithImage location={area}>
			{!hideBackLink && (
				<BackLink
					link={{
						to: "",
						text: area.name,
						onClick: resetCurrentArea,
					}}
				/>
			)}
			{children}
		</LocationSplitWithImage>
	);
};
