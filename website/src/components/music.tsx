/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import AudioPlayer from "react-h5-audio-player";
import { useSelector } from "react-redux";
import { AppState } from "../redux/reducer";
import titleMusic from "../static/music/title-screen.mp3";

export const WSMusicPlayer: React.FunctionComponent = () => {
	const isMusicVisible = useSelector((state: AppState) => state.site.isMusicVisible);

	if (!isMusicVisible) {
		return null;
	}

	return <AudioPlayer src={titleMusic} showJumpControls={false} className="shadow-none" />;
};
