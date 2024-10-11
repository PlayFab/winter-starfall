/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedNumber, IntlShape, useIntl } from "react-intl";
import { combineClassNames } from "../shared/helpers";
import { is } from "../shared/is";
import { IPropsClassName } from "../shared/types";
import Strings from "../strings";

type BarType = "hp" | "mp" | "xp" | "login";

interface IProps extends IPropsClassName {
	type: BarType;
	value: number;
	max: number;
	zero?: number;
	showNumbers?: boolean;
	showLabels?: boolean;
	overrideValue?: number;
	showMax?: boolean;
}

export const ProgressBar: React.FunctionComponent<IProps> = ({
	type,
	max,
	value,
	className,
	showLabels,
	showNumbers = true,
	showMax,
	overrideValue,
	zero = 0,
}) => {
	const intl = useIntl();
	const percentage = Math.floor(Math.min(100, Math.max(0, ((value - zero!) / (max - zero!)) * 100)));

	if (is.null(overrideValue)) {
		overrideValue = value;
	}

	if (max <= 0) {
		return null;
	}

	return (
		<div className="basis-full">
			<div className={className}>
				{showLabels && (
					<div className="flex w-full items-center justify-between">
						<span className="text-sm font-semibold">{getCombatBarName(type, true, intl)}</span>

						{showMax && (
							<span className="text-sm font-semibold">
								<FormattedNumber value={max} />
							</span>
						)}
					</div>
				)}
				<div className="relative">
					{showNumbers && (
						<div
							className="absolute -top-0.5 flex w-full items-baseline justify-center"
							title={getCombatBarName(type, true, intl)}>
							<span
								className={combineClassNames(
									"text-sm font-semibold transition-colors",
									percentage > 48 ? "text-white" : ""
								)}>
								<FormattedNumber value={overrideValue!} />
							</span>
						</div>
					)}
					<div className="h-4 w-full rounded-full bg-gray-200">
						<div
							className={combineClassNames("h-4 rounded-full transition-all", getCombatBarColor(type))}
							style={{ width: `${percentage}%` }}>
							&nbsp;
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

function getCombatBarName(type: BarType, short: boolean, intl: IntlShape): string {
	switch (type) {
		case "mp":
			return intl.formatMessage({ id: short ? Strings.combat_bar_mp : Strings.combat_bar_mp_long });
		case "hp":
			return intl.formatMessage({ id: short ? Strings.combat_bar_hp : Strings.combat_bar_hp_long });
		case "xp":
			return intl.formatMessage({ id: Strings.statistic_xp });
		default:
			return "";
	}
}

function getCombatBarColor(type: BarType): string {
	switch (type) {
		case "mp":
			return "bg-sky-600";
		case "hp":
			return "bg-emerald-600";
		case "xp":
			return "bg-neutral-600";
		case "login":
			return "bg-link";
		default:
			return "bg-sky-500";
	}
}
