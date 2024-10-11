/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useMemo } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { combineClassNames } from "../../../shared/helpers";
import { is } from "../../../shared/is";
import { IPropsClassName } from "../../../shared/types";
import { WSIcon } from "../../icon";

interface ICharacterStatisticProps extends IPropsClassName {
	textId: string;
	value: number | undefined;
	max?: number | undefined;
	next?: number | undefined;
}

enum NumberEquality {
	Increase,
	Decrease,
	Equal,
}

export const CharacterStatistic: React.FunctionComponent<ICharacterStatisticProps> = ({
	textId,
	value,
	max,
	next,
	className,
}) => {
	const numberEquality = useMemo<NumberEquality>(() => {
		if (is.null(next) || is.null(value)) {
			return NumberEquality.Equal;
		}

		if (next! > value!) {
			return NumberEquality.Increase;
		}

		if (next! < value!) {
			return NumberEquality.Decrease;
		}

		return NumberEquality.Equal;
	}, [next, value]);

	const icon = getIconForNumberEquality(numberEquality);

	return (
		<li
			className={combineClassNames(
				getClassNamesForNumberEquality(numberEquality),
				"flex basis-full items-baseline gap-1 rounded-xl p-0.5",
				className!
			)}>
			<span className="px-1 w-5 h-5 basis-5 self-center shrink-0">
				{!is.null(icon) && (
					<WSIcon
						icon={icon}
						size={16}
						className={combineClassNames("h-5 w-5", getIconClassNameForNumberEquality(numberEquality))}
						aria-hidden
					/>
				)}
			</span>
			<div className="flex flex-wrap basis-full grow">
				<span className="text-sm leading-4 basis-full grow">
					<FormattedMessage id={textId} />
				</span>
				<span className="font-bold leading-4">
					{!(!is.null(next) && next !== value) && <FormattedNumber value={value!} />}
					{!is.null(max) && (
						<>
							<FormattedNumber value={value!} />
							{"/"}
							<FormattedNumber value={max!} />
						</>
					)}
					{!is.null(next) && next !== value && <FormattedNumber value={next!} />}
				</span>
			</div>
		</li>
	);
};

function getClassNamesForNumberEquality(numberEquality: NumberEquality): string {
	switch (numberEquality) {
		case NumberEquality.Increase:
			return "bg-green-100 text-green-800";
		case NumberEquality.Decrease:
			return "bg-red-100 text-red-800";
		case NumberEquality.Equal:
			return "bg-transparent text-gray-700";
	}
}

function getIconClassNameForNumberEquality(numberEquality: NumberEquality): string {
	switch (numberEquality) {
		case NumberEquality.Increase:
			return "text-green-500";
		case NumberEquality.Decrease:
			return "text-red-500";
		case NumberEquality.Equal:
			return "";
	}
}

function getIconForNumberEquality(numberEquality: NumberEquality): string {
	switch (numberEquality) {
		case NumberEquality.Increase:
			return "Up";
		case NumberEquality.Decrease:
			return "Down";
		case NumberEquality.Equal:
			return "";
	}
}
