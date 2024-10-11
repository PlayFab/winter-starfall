/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { routes } from "../router";
import { is } from "../shared/is";

interface IProps {
	requiresTitleId: boolean;
}

export const TitleSecurity: React.FunctionComponent<IProps> = ({ requiresTitleId = true }) => {
	const { titleid } = useParams();

	if (requiresTitleId && is.null(titleid)) {
		return <Navigate to={routes.Index()} />;
	}

	return null;
};
