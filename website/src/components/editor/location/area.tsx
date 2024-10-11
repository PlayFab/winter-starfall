/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage } from "react-intl";
import { ILocationArea, ILocationBase } from "../../../shared/types";
import Strings from "../../../strings";
import { WSButton } from "../../button";
import { WSDropdown } from "../../dropdown";
import { DivCard, DivCardFooter, UlCardFooterLinks } from "../../tailwind";
import { WSTextField } from "../../text-field";
import { EditorFormFieldList } from "../styles";
import { EditorPageContentLocationBase } from "./base";
import { noneOptionArray } from "./types";

interface IEditorPageContentLocationAreaProps {
	area: ILocationArea;
	availableAreas: string[];
	availableCinematicProgressions: string[];
	availableLocations: string[];
	availableScripts: string[];
	locationIndex: number;
	onChange: (area: ILocationArea | ILocationBase) => void;
	onCreate: (above: boolean) => void;
	onMove: (up: boolean) => void;
	onDelete: () => void;
}

export const EditorPageContentLocationArea: React.FunctionComponent<IEditorPageContentLocationAreaProps> = ({
	area,
	availableAreas,
	availableCinematicProgressions,
	availableLocations,
	availableScripts,
	locationIndex,
	onChange,
	onCreate,
	onDelete,
	onMove,
}) => {
	return (
		<DivCard>
			<div className="p-4">
				<EditorPageContentLocationBase
					location={area}
					onChange={onChange}
					availableScripts={availableScripts}
					locationIndex={locationIndex}
					hasThumbnail
				/>
				<EditorFormFieldList>
					<WSTextField
						label="Store"
						value={area.store}
						onChange={(_, value) => onChange({ ...area, store: value as string })}
					/>
					<div className="gap-4 grid grid-cols-2">
						<WSTextField
							label="Cinematic"
							value={area.cinematic}
							onChange={(_, value) => onChange({ ...area, cinematic: value as string })}
						/>
						<WSDropdown
							label="Cinematic progression"
							selectedKey={area.cinematicProgression}
							options={noneOptionArray.concat(
								availableCinematicProgressions.map(a => ({ key: a, text: a }))
							)}
							onChange={value => onChange({ ...area, cinematicProgression: value as string })}
						/>
						<WSTextField
							label="Enemy group"
							value={area.enemyGroup}
							onChange={(_, value) => onChange({ ...area, enemyGroup: value as string })}
						/>
						<WSTextField
							label="Enemy group progression"
							value={area.enemyGroupProgression}
							onChange={(_, value) => onChange({ ...area, enemyGroupProgression: value as string })}
						/>
						<WSDropdown
							label="Post combat location"
							selectedKey={area.postCombatLocation}
							options={noneOptionArray.concat(availableLocations.map(a => ({ key: a, text: a })))}
							onChange={value => onChange({ ...area, postCombatLocation: value as string })}
						/>
						<WSDropdown
							label="Post combat area"
							selectedKey={area.postCombatArea}
							options={noneOptionArray.concat(availableAreas.map(a => ({ key: a, text: a })))}
							onChange={value => onChange({ ...area, postCombatArea: value as string })}
						/>
					</div>
				</EditorFormFieldList>
			</div>
			<DivCardFooter>
				<UlCardFooterLinks>
					<li>
						<WSButton style="light" onClick={() => onCreate(true)}>
							<FormattedMessage id={Strings.editor_new_area_above} />
						</WSButton>
					</li>
					<li>
						<WSButton style="light" onClick={() => onCreate(false)}>
							<FormattedMessage id={Strings.editor_new_area_below} />
						</WSButton>
					</li>
					<li>
						<WSButton style="light" onClick={() => onMove(true)}>
							<FormattedMessage id={Strings.editor_move_up} />
						</WSButton>
					</li>
					<li>
						<WSButton style="light" onClick={() => onMove(false)}>
							<FormattedMessage id={Strings.editor_move_down} />
						</WSButton>
					</li>
					<li>
						<WSButton style="light" onClick={onDelete}>
							<FormattedMessage id={Strings.editor_delete} />
						</WSButton>
					</li>
				</UlCardFooterLinks>
			</DivCardFooter>
		</DivCard>
	);
};
