/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import AudioPlayer from "react-h5-audio-player";
import titleMusic from "../static/music/title-screen.mp3";
import { DivCard } from "./tailwind";

export const WSMusicPlayer: React.FunctionComponent = () => {
	return (
		<DivCard className="my-4 p-2">
			<AudioPlayer src={titleMusic} showJumpControls={false} className="shadow-none" />
		</DivCard>
	);
};
