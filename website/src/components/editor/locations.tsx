/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { is } from "../../shared/is";
import { ILocation, ILocationArea, ILocationBase, LocationAreaType } from "../../shared/types";
import Strings from "../../strings";
import { WSButton } from "../button";
import { WSDropdown } from "../dropdown";
import { H3Left } from "../tailwind";
import { WSTextField } from "../text-field";
import { EditorFooter, EditorHeader } from "./header";
import { EditorPageContentLocationArea } from "./location/area";
import { EditorPageContentLocationBase } from "./location/base";
import { EditorFormFieldList, EditorMainList, EditorMainListItem } from "./styles";
import { IEditorPageContentProps } from "./switch";

const newArea = {
	id: "",
	name: "",
	description: "",
	descriptionHover: "",
	script: "",
	backLink: "",
	layout: "grid",
	areas: [],
	image: "",
	imageHover: "",
	type: LocationAreaType.Cinematic,
} as ILocationArea;

export const EditorPageContentLocations: React.FunctionComponent<IEditorPageContentProps> = ({
	content,
	onChange,
	onSave,
	onNewLocation,
	availableScripts,
	availableCinematicProgressions,
}) => {
	const intl = useIntl();

	const [currentScript, setCurrentScript] = React.useState(availableScripts[0]);

	const availableLocations = content.locations.map((l: ILocation) => l.id);
	const availableAreas = content.locations.map((l: ILocation) => l.areas.map((a: ILocationArea) => a.id)).flat();

	return (
		<>
			<EditorHeader
				title={intl.formatMessage({ id: Strings.editor_locations })}
				newItemOnClick={() => onNewLocation(currentScript)}
				newItemTitle={intl.formatMessage({ id: Strings.editor_new_location })}
				onSave={onSave}
			/>
			<EditorMainList>
				<EditorFormFieldList>
					<WSDropdown
						label={intl.formatMessage({ id: Strings.editor_filter_to_script })}
						id="filter-to-script"
						selectedKey={currentScript}
						options={[{ key: "", text: intl.formatMessage({ id: Strings.editor_all_scripts }) }].concat(
							availableScripts.map(a => ({ key: a, text: a }))
						)}
						onChange={value => setCurrentScript(value as string)}
					/>
				</EditorFormFieldList>
				{content.locations.map((location: ILocation, locationIndex: number) => {
					const onChangeLocal = (loc: ILocation | ILocationBase) => {
						onChange({
							...content,
							locations: content.locations.map((p: ILocation, i: number) =>
								i === locationIndex ? loc : p
							),
						});
					};

					const onNewArea = () => {
						onChangeLocal({
							...location,
							areas: location.areas.concat([newArea]),
						});
					};

					const isVisible =
						is.null(currentScript) ||
						location.script === currentScript ||
						location.areas?.some(a => a.script === currentScript);

					if (!isVisible) {
						return null;
					}

					return (
						<EditorMainListItem key={locationIndex}>
							<EditorPageContentLocationBase
								location={location}
								onChange={onChangeLocal}
								locationIndex={locationIndex}
								availableScripts={availableScripts}
							/>

							<EditorFormFieldList>
								<div className="gap-4 grid grid-cols-2 mt-4">
									<WSTextField
										label={intl.formatMessage({ id: Strings.editor_back_to_cinematic })}
										name="backLink"
										id={`location-${location.id}-backLink-${locationIndex}`}
										value={location.backLink}
										onChange={(_, value) =>
											onChangeLocal({ ...location, backLink: value as string })
										}
									/>
									<WSDropdown
										label={intl.formatMessage({ id: Strings.editor_layout })}
										id={`location-${location.id}-layout-${locationIndex}`}
										selectedKey={location.layout}
										options={["areas", "grid"].map(a => ({ key: a, text: a }))}
										onChange={value => onChangeLocal({ ...location, layout: value as any })}
									/>
								</div>
							</EditorFormFieldList>
							<div className="flex items-start gap-6 mt-6">
								<div className="shrink-0">
									<H3Left className="!mt-0">
										<FormattedMessage id={Strings.editor_area} />
									</H3Left>
									<ul>
										<li>
											<WSButton onClick={onNewArea} style="light">
												<FormattedMessage id={Strings.editor_new_area} />
											</WSButton>
										</li>
									</ul>
								</div>
								<div className="gap-4 grid grid-cols-1">
									{location.areas.map((area: ILocationArea, areaIndex: number) => {
										const onChangeArea = (area: ILocationArea | ILocationBase) => {
											onChangeLocal({
												...location,
												areas: location.areas.map((a: ILocationArea, i: number) =>
													i === areaIndex ? (area as ILocationArea) : a
												),
											});
										};

										const onCreateArea = (above: boolean) => {
											const newAreas = [...location.areas];
											newAreas.splice(above ? areaIndex : areaIndex + 1, 0, newArea);

											onChangeLocal({
												...location,
												areas: newAreas,
											});
										};

										const onDeleteArea = () => {
											const newAreas = [...location.areas];
											newAreas.splice(areaIndex, 1);

											onChangeLocal({
												...location,
												areas: newAreas,
											});
										};

										const onMoveArea = (up: boolean) => {
											const newAreas = [...location.areas];
											const newIndex = up ? areaIndex - 1 : areaIndex + 1;
											if (newIndex < 0 || newIndex >= newAreas.length) {
												return;
											}

											const tmp = newAreas[areaIndex];
											newAreas[areaIndex] = newAreas[newIndex];
											newAreas[newIndex] = tmp;

											onChangeLocal({
												...location,
												areas: newAreas,
											});
										};

										return (
											<EditorPageContentLocationArea
												locationIndex={locationIndex}
												key={areaIndex}
												area={area}
												onChange={onChangeArea}
												availableScripts={availableScripts}
												availableCinematicProgressions={availableCinematicProgressions}
												availableAreas={availableAreas}
												availableLocations={availableLocations}
												onCreate={onCreateArea}
												onDelete={onDeleteArea}
												onMove={onMoveArea}
											/>
										);
									})}
								</div>
							</div>
						</EditorMainListItem>
					);
				})}
				<EditorFooter
					title={intl.formatMessage({ id: Strings.editor_locations })}
					newItemOnClick={() => onNewLocation(currentScript)}
					newItemTitle={intl.formatMessage({ id: Strings.editor_new_location })}
					onSave={onSave}
				/>
			</EditorMainList>
		</>
	);
};
