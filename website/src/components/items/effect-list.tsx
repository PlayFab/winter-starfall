/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { is } from "../../shared/is";
import {
	ARMOR_CONTENT_TYPE,
	CONSUMABLE_CONTENT_TYPE,
	IEconomyArmor,
	IEconomyItem,
	IEconomySpell,
	IEconomyWeapon,
	IPropsChildren,
	SPELL_CONTENT_TYPE,
	WEAPON_CONTENT_TYPE,
} from "../../shared/types";
import { ItemEffectListItem } from "./effect-list-item";

interface IItemEffectsProps {
	item: PlayFabEconomyModels.CatalogItem | undefined;
}

export const ItemEffectList: React.FunctionComponent<IItemEffectsProps> = ({ item }) => {
	if (is.null(item) || is.null(item?.DisplayProperties)) {
		return null;
	}

	const displayProperties: IEconomyWeapon | IEconomyArmor | IEconomyItem | IEconomySpell = item?.DisplayProperties;

	switch (item?.ContentType) {
		case WEAPON_CONTENT_TYPE:
			return (
				<UlItemEffectListItemWrapper>
					{(displayProperties as IEconomyWeapon).effects.map((effect, index) => (
						<li key={index}>
							<ItemEffectListItem {...effect} />
						</li>
					))}
				</UlItemEffectListItemWrapper>
			);
		case ARMOR_CONTENT_TYPE:
			return (
				<UlItemEffectListItemWrapper>
					<li>
						<ItemEffectListItem type="defense" value={(displayProperties as IEconomyArmor).defense} />
					</li>
				</UlItemEffectListItemWrapper>
			);
		case CONSUMABLE_CONTENT_TYPE:
			return (
				<UlItemEffectListItemWrapper>
					{(displayProperties as IEconomyItem).effects.map((effect, index) => (
						<li key={index}>
							<ItemEffectListItem {...effect} />
						</li>
					))}
				</UlItemEffectListItemWrapper>
			);
		case SPELL_CONTENT_TYPE:
			return (
				<UlItemEffectListItemWrapper>
					<li>
						<ItemEffectListItem type="mp" value={(displayProperties as IEconomySpell).mp} />
					</li>
					{(displayProperties as IEconomySpell).effects.map((effect, index) => (
						<li key={index}>
							<ItemEffectListItem {...effect} />
						</li>
					))}
				</UlItemEffectListItemWrapper>
			);
	}
};

const UlItemEffectListItemWrapper: React.FunctionComponent<IPropsChildren> = ({ children }) => (
	<ul className="flex min-h-8 flex-wrap items-center gap-x-4 gap-y-2">{children}</ul>
);
