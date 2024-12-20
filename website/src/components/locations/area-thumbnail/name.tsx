/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { combineClassNames } from "../../../shared/helpers";
import { ILocationArea } from "../../../shared/types";
import { WSButton } from "../../button";
import { H2LeftAsH3, PSubtitle } from "../../tailwind";

interface IAreaThumbnailNameDescriptionProps {
	description: string;
	visited: boolean;
	area: ILocationArea;
	onClick: () => void;
	onFocus: () => void;
	onBlur: () => void;
}

export const AreaThumbnailNameDescription: React.FunctionComponent<IAreaThumbnailNameDescriptionProps> = ({
	area,
	description,
	visited,
	onClick,
	onFocus,
	onBlur,
}) => (
	<>
		<H2LeftAsH3 className="!mt-0">
			<WSButton
				style="link"
				onClick={onClick}
				className={combineClassNames(
					"text-left !text-lg !font-semibold !leading-6",
					visited ? "!text-gray-400" : ""
				)}
				onFocus={onFocus}
				onBlur={onBlur}>
				{area.name}
			</WSButton>
		</H2LeftAsH3>
		<PSubtitle>{description}</PSubtitle>
	</>
);
