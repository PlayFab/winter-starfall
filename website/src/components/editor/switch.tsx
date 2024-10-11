/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { EditorContentType } from "../../hooks/use-editor";
import { Loading } from "../loading";
import { EditorPageContentCinematics } from "./cinematics";
import { EditorPageContentEnemies } from "./enemies";
import { EditorPageContentLocations } from "./locations";
import { EditorPageContentScripts } from "./scripts";

export interface IEditorPageContentProps {
	content: any;
	contentType: EditorContentType;
	activeScriptId: string;
	availableScripts: string[];
	availableCinematicProgressions: string[];
	availableLocations: string[];
	availableAreas: string[];
	isLoading: boolean;
	onChange: (value: any) => void;
	onSave: () => void;
	onNewLocation: (script: string) => void;
}

export const EditorPageContentSwitch: React.FunctionComponent<IEditorPageContentProps> = props => {
	if (props.isLoading) {
		return <Loading />;
	}

	switch (props.contentType) {
		case EditorContentType.Cinematics:
			return <EditorPageContentCinematics {...props} />;
		case EditorContentType.Locations:
			return <EditorPageContentLocations {...props} />;
		case EditorContentType.Enemies:
			return <EditorPageContentEnemies {...props} />;
		case EditorContentType.Scripts:
			return <EditorPageContentScripts {...props} />;
		default:
			return null;
	}
};
