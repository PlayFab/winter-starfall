/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ICinematicEventBase } from "../../../shared/types";

export interface IEditorPageContentScriptCinematicEventBaseProps {
	availableCinematics: string[];
	availableLocations: string[];
	availableAreas: string[];
	availableCinematicProgressions: string[];
	cinematicId: string;
	eventIndex: number;
	onDelete: () => void;
}

export interface IEditorPageContentScriptCinematicEventProps {
	availableCinematics: string[];
	availableLocations: string[];
	availableCinematicProgressions: string[];
	availableAreas: string[];
	cinematicId: string;
	event: ICinematicEventBase;
	eventIndex: number;
	onChange: (event: ICinematicEventBase, index: number) => void;
	onDelete: () => void;
	onCreate: (index: number, above: boolean) => void;
	onMove: (index: number, up: boolean) => void;
}
