/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/reducer";
import { combineClassNames, getCharacterImageUrl, getCharacterName, getEnemyImageUrl } from "../../../shared/helpers";
import { is } from "../../../shared/is";
import {
	CombatantType,
	ICombatGuest,
	ICombatant,
	IEnemy,
	IPropsClassName,
	IUserDataReadOnlyPlayerCharacter,
} from "../../../shared/types";
import Strings from "../../../strings";
import { WSButton } from "../../button";
import { CombatFloatingNumberList, CombatFloatingNumbersWrapper } from "../floating-numbers";
import { IEnemySpriteSize, getEnemySpriteSizeClassNames } from "../helpers";
import { CombatantBrand } from "./brand";
import { CombatantEffectList } from "./effect-list";

interface IProps extends IPropsClassName {
	combatant: ICombatant;
	showCombatEffects: boolean;
	setSelectedTarget: (target: ICombatant) => void;
	isCombatantSelectable: (combatant: ICombatant) => boolean;
}

export const CombatCombatant: React.FunctionComponent<IProps> = ({
	combatant,
	className,
	showCombatEffects,
	setSelectedTarget,
	isCombatantSelectable,
}) => {
	const intl = useIntl();
	const enemies = useSelector((state: AppState) => state.site.combatEnemies);
	const guests = useSelector((state: AppState) => state.site.combatGuests);
	const characters = useSelector((state: AppState) => state.site.userDataReadOnly.party.characters);

	let hp = 0;
	let name = "";
	let description = "";
	let image = "";
	let entityClassName = "w-24 h-24";
	let brand = "";

	let character: IUserDataReadOnlyPlayerCharacter | undefined;
	let enemy: IEnemy | undefined;
	let guest: ICombatGuest | undefined;
	let enemySpriteSizeClassNames: IEnemySpriteSize;

	switch (combatant.type) {
		case CombatantType.Character:
			character = characters.find(c => c.id === combatant.id)!;
			hp = character.hp as number;
			name = getCharacterName(character.id, intl);
			description = name;
			image = getCharacterImageUrl(character.id, "combat");
			break;
		case CombatantType.Guest:
			guest = guests.find(c => c.id === combatant.id)!;
			hp = guest.hp;
			description = name;
			name = getCharacterName(guest.id, intl);
			image = getCharacterImageUrl(guest.id, "combat");
			break;
		case CombatantType.Enemy:
			enemy = enemies.find(e => e.uniqueId === combatant.id)!;
			hp = enemy.hp;
			if (is.null(enemy.brand)) {
				name = enemy.name;
			} else {
				name = intl.formatMessage({ id: Strings.enemy_name }, { name: enemy.name, brand: enemy.brand });
			}
			description = enemy.description;
			image = getEnemyImageUrl(enemy.image);
			enemySpriteSizeClassNames = getEnemySpriteSizeClassNames(enemy.size);
			entityClassName = combineClassNames(enemySpriteSizeClassNames.width, enemySpriteSizeClassNames.height);
			brand = enemy.brand!;
			break;
	}

	const isDead = hp <= 0;
	const isSelectable = isCombatantSelectable(combatant);

	const onClick = useCallback(() => {
		if (!isSelectable) {
			return;
		}

		setSelectedTarget(combatant);
	}, [combatant, isSelectable, setSelectedTarget]);

	return (
		<CombatFloatingNumbersWrapper>
			<WSButton
				onClick={onClick}
				style="link"
				disabled={!isSelectable}
				className={combineClassNames(
					"rounded-xl border-2 border-solid border-transparent transition-all",
					isSelectable ? "!border-link !shadow-xl" : ""
				)}>
				<img
					src={image}
					alt={description}
					title={name}
					aria-label={name}
					className={combineClassNames(isDead ? "opacity-50" : "", entityClassName, className!)}
				/>
				<CombatantEffectList combatant={combatant} showCombatEffects={showCombatEffects} />
				<CombatantBrand brand={brand} isDead={isDead} />
			</WSButton>
			<CombatFloatingNumberList combatant={combatant} shouldBeShown={showCombatEffects} />
		</CombatFloatingNumbersWrapper>
	);
};
