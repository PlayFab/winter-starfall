/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { useIntl } from "react-intl";
import { is } from "../../../shared/is";
import { ILocationBase } from "../../../shared/types";
import Strings from "../../../strings";
import { WSDropdown } from "../../dropdown";
import { WSTextField } from "../../text-field";
import { EditorFormFieldList, EditorSimpleGrid } from "../styles";
import { noneOptionArray } from "./types";

interface IEditorPageContentLocationBaseProps {
	location: ILocationBase;
	hasThumbnail?: boolean;
	availableScripts: string[];
	locationIndex: number;
	onChange: (location: ILocationBase) => void;
}

export const EditorPageContentLocationBase: React.FunctionComponent<IEditorPageContentLocationBaseProps> = ({
	location,
	hasThumbnail,
	locationIndex,
	availableScripts,
	onChange,
}) => {
	const intl = useIntl();

	return (
		<EditorFormFieldList>
			<WSTextField
				label={intl.formatMessage({ id: Strings.editor_id })}
				id={`location-id-${locationIndex}`}
				name="id"
				value={location.id}
				onChange={(_, value) => onChange({ ...location, id: value as string })}
			/>
			<EditorSimpleGrid>
				<WSTextField
					label={intl.formatMessage({ id: Strings.editor_name })}
					id={`location-name-${locationIndex}`}
					name="name"
					value={location.name}
					onChange={(_, value) => onChange({ ...location, name: value as string })}
				/>
				<WSDropdown
					label={intl.formatMessage({ id: Strings.editor_script })}
					id={`location-script-${locationIndex}`}
					selectedKey={location.script}
					options={noneOptionArray.concat(availableScripts.map(a => ({ key: a, text: a })))}
					onChange={value => onChange({ ...location, script: value as string })}
				/>
			</EditorSimpleGrid>
			<EditorSimpleGrid>
				<WSTextField
					label={intl.formatMessage({ id: Strings.editor_description })}
					id={`location-description-${locationIndex}`}
					name="description"
					value={location.description}
					onChange={(_, value) => onChange({ ...location, description: value as string })}
				/>
				<WSTextField
					label={intl.formatMessage({ id: Strings.editor_description_hover })}
					id={`location-descriptionHover-${locationIndex}`}
					name="descriptionHover"
					value={location.descriptionHover}
					onChange={(_, value) => onChange({ ...location, descriptionHover: value as string })}
				/>
			</EditorSimpleGrid>
			<div className="gap-4 grid grid-cols-2">
				<WSTextField
					label={intl.formatMessage({ id: Strings.editor_image })}
					id={`location-image-${locationIndex}`}
					name="image"
					value={location.image}
					onChange={(_, value) => onChange({ ...location, image: value as string })}
				/>
				<WSTextField
					label={intl.formatMessage({ id: Strings.editor_image_hover })}
					id={`location-imageHover-${locationIndex}`}
					name="imageHover"
					value={location.imageHover}
					onChange={(_, value) => onChange({ ...location, imageHover: value as string })}
				/>
				{!is.null(location.image) && (
					<div className="gap-2 grid grid-cols-2">
						{hasThumbnail && (
							<a
								href={`/src/static/locations/${location.image}-thumbnail.jpg`}
								target="_blank"
								rel="noreferrer">
								<img
									src={`/src/static/locations/${location.image}-thumbnail.jpg`}
									alt={`${location.name} thumbnail`}
									className="border border-border"
								/>
							</a>
						)}
						<a href={`/src/static/locations/${location.image}-full.jpg`} target="_blank" rel="noreferrer">
							<img
								src={`/src/static/locations/${location.image}-full.jpg`}
								alt={`${location.name} full`}
								className="border border-border"
							/>
						</a>
					</div>
				)}
				{!is.null(location.imageHover) && (
					<div className="gap-2 grid grid-cols-2">
						{hasThumbnail && (
							<a
								href={`/src/static/locations/${location.imageHover}-thumbnail.jpg`}
								target="_blank"
								rel="noreferrer">
								<img
									src={`/src/static/locations/${location.imageHover}-thumbnail.jpg`}
									alt={`${location.name} thumbnail`}
									className="border border-border"
								/>
							</a>
						)}
						<a
							href={`/src/static/locations/${location.imageHover}-full.jpg`}
							target="_blank"
							rel="noreferrer">
							<img
								src={`/src/static/locations/${location.imageHover}-full.jpg`}
								alt={`${location.name} full`}
								className="border border-border"
							/>
						</a>
					</div>
				)}
			</div>
		</EditorFormFieldList>
	);
};
