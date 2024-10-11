/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useCinematicEventActions } from "../../hooks/use-events";
import { combineClassNames, getEventImageUrl } from "../../shared/helpers";
import { is } from "../../shared/is";
import {
	CinematicEventType,
	ICinematicEventActionExecute,
	ICinematicEventBase,
	ICinematicEventButton,
	ICinematicEventHeading,
	ICinematicEventHeadshot,
	ICinematicEventImage,
	ICinematicEventMessages,
} from "../../shared/types";
import Strings from "../../strings";
import { WSButton } from "../button";
import { DivConfirmFooter, H2Left } from "../tailwind";
import { CinematicEventSpeakerImage } from "./images";
import { DivEventWrapper } from "./wrappers";

interface ICinematicEventProps {
	event: ICinematicEventBase;
	totalEvents: number;
	canSkipCinematic: boolean;
	onSkipCinematic: () => void;
}

export const CinematicEventSwitch: React.FunctionComponent<ICinematicEventProps> = ({
	event,
	onSkipCinematic,
	canSkipCinematic,
	totalEvents,
}) => {
	switch (event.type) {
		case CinematicEventType.Heading:
			return <CinematicEventType0 event={event as ICinematicEventHeading} />;
		case CinematicEventType.Messages:
			return (
				<CinematicEventType1
					event={event as ICinematicEventMessages}
					key={Math.random()}
					hasSubsequentEvent={totalEvents > 1}
				/>
			);
		case CinematicEventType.Image:
			return <CinematicEventType2 event={event as ICinematicEventImage} />;
		case CinematicEventType.Headshot:
			return <CinematicEventType3 event={event as ICinematicEventHeadshot} key={Math.random()} />;
		case CinematicEventType.Button:
			return (
				<CinematicEventType4
					event={event as ICinematicEventButton}
					key={Math.random()}
					onSkipCinematic={onSkipCinematic}
					canSkipCinematic={canSkipCinematic}
				/>
			);
		case CinematicEventType.ActionExecute:
			return <CinematicEventType5 event={event as ICinematicEventActionExecute} />;
		default:
			return null;
	}
};

interface ICinematicEventType0Props {
	event: ICinematicEventHeading;
	isMobile?: boolean;
}

const CinematicEventType0: React.FunctionComponent<ICinematicEventType0Props> = ({ event, isMobile }) => {
	return (
		<DivEventWrapper
			className={combineClassNames(
				isMobile ? "" : "rounded-tl-xl rounded-tr-xl",
				event.thought ? "bg-gradient-to-l from-white to-gray-200" : "",
				isMobile && event.thought ? "mb-2" : ""
			)}>
			<H2Left className={combineClassNames("!mt-0", event.thought ? "text-opacity-60" : "")}>{event.text}</H2Left>
		</DivEventWrapper>
	);
};

interface ICinematicEventType1Props {
	event: ICinematicEventMessages;
	hasSubsequentEvent: boolean;
}

const CinematicEventType1: React.FunctionComponent<ICinematicEventType1Props> = ({ event, hasSubsequentEvent }) => {
	let cinematicEventSpeakerImageClassName = "h-48 w-48";

	if (!hasSubsequentEvent) {
		cinematicEventSpeakerImageClassName = combineClassNames(
			cinematicEventSpeakerImageClassName,
			"md:rounded-bl-xl"
		);
	}

	return (
		<>
			<div className={is.null(event.speaker) ? "block" : "hidden md:block"}>
				<CinematicEventType0
					event={{ text: event.text, type: CinematicEventType.Heading, thought: event.thought }}
				/>
			</div>
			<div className="flex flex-wrap md:flex-nowrap mt-2">
				{!is.null(event.speaker) && (
					<div className="border-gray-200 mt-2 md:mt-0 md:mr-4 md:mb-0 border-b md:border-b-0 border-solid md:grow-0 grow self-end md:shrink-0">
						<CinematicEventSpeakerImage
							speaker={event.speaker}
							className={cinematicEventSpeakerImageClassName}
						/>
					</div>
				)}
				<div className={is.null(event.speaker) ? "hidden" : "block grow basis-full md:hidden"}>
					<CinematicEventType0
						event={{ text: event.text, type: CinematicEventType.Heading, thought: event.thought }}
						isMobile
					/>
				</div>
				<div className="basis-full grow md:basis-auto">
					<DivEventWrapper className="!pt-0">
						{event.messages?.map((message, index) => (
							<p
								key={index}
								className={combineClassNames("mt-4 first:mt-0", event.thought ? "italic" : "")}>
								{message}
							</p>
						))}
					</DivEventWrapper>
				</div>
			</div>
		</>
	);
};

interface ICinematicEventType2Props {
	event: ICinematicEventImage;
}

const CinematicEventType2: React.FunctionComponent<ICinematicEventType2Props> = ({ event }) => {
	return (
		<div>
			<img src={getEventImageUrl(event.image)} alt={event.alt} className="w-full" />
		</div>
	);
};

interface ICinematicEventType3Props {
	event: ICinematicEventHeadshot;
}

const CinematicEventType3: React.FunctionComponent<ICinematicEventType3Props> = ({ event }) => {
	return (
		<div className="border-gray-200 border-b border-solid">
			<CinematicEventSpeakerImage
				speaker={event.speaker}
				className="bg-cover rounded-tl-xl rounded-tr-xl w-full h-auto"
			/>
		</div>
	);
};

interface ICinematicEventType4Props {
	event: ICinematicEventButton;
	canSkipCinematic: boolean;
	onSkipCinematic: () => void;
}

const CinematicEventType4: React.FunctionComponent<ICinematicEventType4Props> = ({
	event,
	onSkipCinematic,
	canSkipCinematic,
}) => {
	const intl = useIntl();
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const { onRunActions } = useCinematicEventActions(event.actions);

	const onClick = useCallback(() => {
		if (is.null(event.loading)) {
			return onRunActions(event.sequential);
		}

		setIsLoading(true);
		setIsDisabled(true);
		onRunActions(event.sequential);
	}, [event, onRunActions]);

	// Prevent quick clicking
	useEffect(() => {
		const timeout = setTimeout(() => {
			setIsDisabled(false);
			setIsLoading(false);
		}, 750);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<DivConfirmFooter className="border-gray-300 !bg-white border-t border-solid rounded-bl-xl rounded-br-xl text-center sm:text-left">
			<div className="flex justify-between items-center">
				<WSButton onClick={onClick} disabled={isDisabled} isLoading={isLoading} className="!px-12">
					{is.null(event.text) ? <FormattedMessage id={Strings.continue} /> : <>{event.text}</>}
				</WSButton>

				{canSkipCinematic && (
					<WSButton
						onClick={onSkipCinematic}
						style="link"
						className="font-medium !text-sm"
						aria-label={intl.formatMessage({ id: Strings.skip_cinematics })}>
						<FormattedMessage id={Strings.skip_cinematics} /> &raquo;
					</WSButton>
				)}
			</div>
		</DivConfirmFooter>
	);
};

interface ICinematicEventType5Props {
	event: ICinematicEventActionExecute;
}

const CinematicEventType5: React.FunctionComponent<ICinematicEventType5Props> = ({ event }) => {
	const { onRunActions } = useCinematicEventActions(event.actions);

	useEffect(() => {
		onRunActions(event.sequential);
	}, [event.sequential, onRunActions]);

	return null;
};
