/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useIntl } from "react-intl";
import { ICinematic } from "../../shared/types";
import Strings from "../../strings";
import { EditorFooter, EditorHeader } from "./header";
import { EditorPageContentScriptCinematic } from "./script/cinematic";
import { EditorMainList } from "./styles";
import { IEditorPageContentProps } from "./switch";

export const EditorPageContentScripts: React.FunctionComponent<IEditorPageContentProps> = ({
	activeScriptId,
	availableLocations,
	availableAreas,
	onSave,
	onChange,
	content,
	availableCinematicProgressions,
}) => {
	const intl = useIntl();
	const availableCinematics = content.map((c: ICinematic) => c.id);

	return (
		<>
			<EditorHeader
				title={activeScriptId}
				onSave={onSave}
				newItemOnClick={() =>
					onChange(content.concat({ id: `script-${content.length}`, bubble: false, events: [], watch: [] }))
				}
				newItemTitle={intl.formatMessage({ id: Strings.editor_new_cinematic })}
			/>
			<EditorMainList>
				{(content as ICinematic[])?.map((cinematic, index) => {
					const onChangeLocal = (value: any) => {
						onChange(content.map((c: ICinematic, i: number) => (i === index ? value : c)));
					};

					const onDelete = () => {
						onChange(content.filter((_: ICinematic, i: number) => i !== index));
					};

					return (
						<EditorPageContentScriptCinematic
							key={index}
							cinematic={cinematic}
							onChange={onChangeLocal}
							onDelete={onDelete}
							index={index}
							availableCinematics={availableCinematics}
							availableLocations={availableLocations}
							availableAreas={availableAreas}
							availableCinematicProgressions={availableCinematicProgressions}
						/>
					);
				})}
			</EditorMainList>
			<EditorFooter
				title={activeScriptId}
				onSave={onSave}
				newItemOnClick={() => onChange(content.concat({ id: `script-${content.length}`, events: [] }))}
				newItemTitle={intl.formatMessage({ id: Strings.editor_new_cinematic })}
			/>
		</>
	);
};
