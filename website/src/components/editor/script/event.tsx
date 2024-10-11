/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage } from "react-intl";
import { CinematicEventType } from "../../../shared/types";
import Strings from "../../../strings";
import { WSButton } from "../../button";
import { CinematicEventSwitch } from "../../cinematics/events";
import { WSDropdown } from "../../dropdown";
import { DivCard, DivCardFooter, UlCardFooterLinks } from "../../tailwind";
import { EditorPageContentScriptCinematicEventType } from "./event-type";
import { IEditorPageContentScriptCinematicEventProps } from "./types";

export const EditorPageContentScriptCinematicEvent: React.FunctionComponent<
	IEditorPageContentScriptCinematicEventProps
> = ({
	availableAreas,
	availableCinematicProgressions,
	availableCinematics,
	availableLocations,
	cinematicId,
	event,
	eventIndex,
	onChange,
	onCreate,
	onDelete,
	onMove,
}) => {
	return (
		<DivCard>
			<div className="p-4">
				<div className="gap-4 grid grid-cols-2">
					<div>
						<WSDropdown
							label="Type"
							options={[
								{
									key: CinematicEventType.Messages,
									text: "Messages",
								},
								{
									key: CinematicEventType.Image,
									text: "Image",
								},
								{
									key: CinematicEventType.Button,
									text: "Button",
								},
								{
									key: CinematicEventType.ActionExecute,
									text: "Actions",
								},
								{
									key: CinematicEventType.Heading,
									text: "Heading",
								},
							]}
							selectedKey={event.type}
							onChange={value =>
								onChange(
									{ ...event, type: parseInt(value as string) as CinematicEventType },
									eventIndex
								)
							}
						/>
						<div className="mt-4">
							<CinematicEventSwitch
								event={event}
								canSkipCinematic={false}
								onSkipCinematic={() => {}}
								totalEvents={2}
							/>
						</div>
					</div>
					<div>
						<EditorPageContentScriptCinematicEventType
							availableAreas={availableAreas}
							availableCinematicProgressions={availableCinematicProgressions}
							availableCinematics={availableCinematics}
							availableLocations={availableLocations}
							cinematicId={cinematicId}
							event={event}
							eventIndex={eventIndex}
							onChange={onChange}
							onCreate={onCreate}
							onDelete={onDelete}
							onMove={onMove}
						/>
					</div>
				</div>
			</div>
			<DivCardFooter>
				<UlCardFooterLinks>
					<li>
						<WSButton onClick={() => onCreate(eventIndex, true)} style="light">
							<FormattedMessage id={Strings.editor_new_event_above} />
						</WSButton>
					</li>
					<li>
						<WSButton onClick={() => onCreate(eventIndex, false)} style="light">
							<FormattedMessage id={Strings.editor_new_event_below} />
						</WSButton>
					</li>
					<li>
						<WSButton onClick={() => onMove(eventIndex, true)} style="light">
							<FormattedMessage id={Strings.editor_move_up} />
						</WSButton>
					</li>
					<li>
						<WSButton onClick={() => onMove(eventIndex, false)} style="light">
							<FormattedMessage id={Strings.editor_move_down} />
						</WSButton>
					</li>
					<li>
						<WSButton onClick={onDelete} style="light">
							<FormattedMessage id={Strings.editor_delete} />
						</WSButton>
					</li>
				</UlCardFooterLinks>
			</DivCardFooter>
		</DivCard>
	);
};
