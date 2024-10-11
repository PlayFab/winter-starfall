/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useEffect, useMemo, useState } from "react";
import { FormattedNumber } from "react-intl";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/reducer";
import { combineClassNames } from "../../shared/helpers";
import {
	COMBAT_ANIMATION_TIME_FLOATING_NUMBER,
	CombatActionType,
	CombatValueMeaning,
	ICombatant,
	IPropsChildrenClassName,
} from "../../shared/types";

interface ICombatFloatingNumberListProps {
	shouldBeShown: boolean;
	combatant: ICombatant;
}

export const CombatFloatingNumberList: React.FunctionComponent<ICombatFloatingNumberListProps> = ({
	combatant,
	shouldBeShown,
}) => {
	const history = useSelector((state: AppState) => state.site.combatHistory);
	const [isVisible, setIsVisible] = useState(false);

	const lastHistoryItem = history.length === 0 ? undefined : history[history.length - 1];

	const isTargetingYou = !(
		!lastHistoryItem ||
		lastHistoryItem.destination.type !== combatant.type ||
		lastHistoryItem.destination.id !== combatant.id ||
		lastHistoryItem.action === CombatActionType.Defend
	);

	useEffect(() => {
		if (!isTargetingYou) {
			return;
		}

		setIsVisible(true);

		const timeout = setTimeout(() => {
			setIsVisible(false);
		}, COMBAT_ANIMATION_TIME_FLOATING_NUMBER);

		return () => clearTimeout(timeout);
	}, [isTargetingYou, history]);

	if (!isVisible || !shouldBeShown || !lastHistoryItem) {
		return null;
	}

	return (
		<CombatFloatingNumbersWrapper>
			{lastHistoryItem!.values!.map((value, index) => (
				<CombatFloatingNumberListItem key={index} meaning={value.meaning} value={value.value} />
			))}
		</CombatFloatingNumbersWrapper>
	);
};

interface ICombatFloatingNumberListItemProps {
	meaning: CombatValueMeaning;
	value: number;
}

export const CombatFloatingNumberListItem: React.FunctionComponent<ICombatFloatingNumberListItemProps> = ({
	meaning,
	value,
}) => {
	const numberStyle = useMemo<string>(() => {
		switch (meaning) {
			case CombatValueMeaning.Healing:
				return "bg-green-700";
			case CombatValueMeaning.Damage:
			default:
				return "bg-black";
		}
	}, [meaning]);

	return (
		<span className="absolute bottom-1 left-1/2 flex h-32 animate-bounce items-end">
			<span
				className={combineClassNames(
					"-ml-4 flex h-8 w-8 items-center justify-center rounded-full font-bold text-white",
					numberStyle
				)}>
				<FormattedNumber value={value} />
			</span>
		</span>
	);
};

export const CombatFloatingNumbersWrapper: React.FunctionComponent<IPropsChildrenClassName> = ({
	children,
	className,
}) => {
	return <div className={combineClassNames("relative", className!)}>{children}</div>;
};
