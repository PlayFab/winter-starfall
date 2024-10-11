/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/reducer";
import { is } from "../../shared/is";
import { ProgressBar } from "../progress-bar";

export const LoginProgressBar: React.FunctionComponent = () => {
	const loginProgress = useSelector((state: AppState) => state.site.loginProgress);

	const loginPercentage = loginProgress.filter(l => l).length / loginProgress.filter(l => !l).length;

	if (is.null(loginProgress)) {
		return null;
	}

	return (
		<div className="my-4">
			<ProgressBar max={1} value={loginPercentage} type="login" showNumbers={false} />
		</div>
	);
};
