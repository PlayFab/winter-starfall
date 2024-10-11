/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useCallback, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/reducer";
import { CombatantBase } from "../../../shared/combat-classes";
import { combineClassNames, createPlayerCharacterCombat, getCharacterName } from "../../../shared/helpers";
import { is } from "../../../shared/is";
import { CinematicEventSpeaker, CombatantType, IUserDataReadOnlyPlayerCharacter } from "../../../shared/types";
import Strings from "../../../strings";
import { WSButton } from "../../button";
import { CinematicEventSpeakerImage } from "../../cinematics/images";
import { ProgressBar } from "../../progress-bar";
import { Section } from "../../tailwind";
import { PartyCharacterEquipmentList } from "./equipment-list";
import { CharacterStatistic } from "./statistic";

interface IProps {
	id: CinematicEventSpeaker;

	lastCharacterReadOnly?: IUserDataReadOnlyPlayerCharacter;
	onSelect?: (id: CinematicEventSpeaker) => void;
	overrideCharacterReadOnly?: IUserDataReadOnlyPlayerCharacter;
	showEquipment?: boolean;
	showStats?: boolean;
}

export const PartyCharacter: React.FunctionComponent<IProps> = ({
	id,
	lastCharacterReadOnly,
	onSelect,
	overrideCharacterReadOnly,
	showEquipment,
	showStats,
}) => {
	const intl = useIntl();
	const partyWriteable = useSelector((state: AppState) => state.site.userDataPlayer.party);
	const partyReadOnly = useSelector((state: AppState) => state.site.userDataReadOnly.party);
	const catalog = useSelector((state: AppState) => state.site.catalog);

	const characterReadOnly = is.null(overrideCharacterReadOnly)
		? partyReadOnly.characters.find(c => c.id === id)!
		: overrideCharacterReadOnly!;

	const name = getCharacterName(id, intl);
	const hasMP = (characterReadOnly?.maxMP || 0) > 0;
	const showSelect = !is.null(onSelect);

	const onSelectLocal = useCallback(() => {
		if (!showSelect) {
			return;
		}

		onSelect!(id);
	}, [id, onSelect, showSelect]);

	const lastCombatantClass = useMemo<CombatantBase | undefined>(
		() =>
			is.null(lastCharacterReadOnly)
				? undefined
				: new CombatantBase(
						{ id, type: CombatantType.Character },
						createPlayerCharacterCombat(id, partyWriteable, { characters: [lastCharacterReadOnly!] }),
						catalog
					),
		[catalog, id, lastCharacterReadOnly, partyWriteable]
	);

	const combatantClass = useMemo<CombatantBase>(
		() =>
			new CombatantBase(
				{ id, type: CombatantType.Character },
				createPlayerCharacterCombat(id, partyWriteable, { characters: [characterReadOnly] }),
				catalog
			),
		[catalog, characterReadOnly, id, partyWriteable]
	);

	return (
		<Section title={name} showTitleUnderline={false}>
			<PartyCharacterEquipmentList id={id} isVisible={showEquipment} />
			<div
				className={combineClassNames(
					"grid gap-4",
					showEquipment ? "mt-4" : "",
					hasMP ? "grid-cols-2" : "grid-cols-1"
				)}>
				<ProgressBar
					type="hp"
					value={characterReadOnly.hp}
					max={characterReadOnly.maxHP}
					className={hasMP ? "" : "col-span-2"}
					showLabels
					showNumbers
					showMax
				/>
				{hasMP && (
					<ProgressBar
						type="mp"
						value={characterReadOnly.mp}
						max={characterReadOnly.maxMP}
						showLabels
						showNumbers
						showMax
					/>
				)}
			</div>
			{showStats && (
				<ProgressBar
					type="xp"
					zero={characterReadOnly.xpToCurrentLevel}
					max={characterReadOnly.xpToNextLevel}
					value={characterReadOnly.xp}
					className="my-4"
					showLabels
					showMax
				/>
			)}

			<div className="flex items-end">
				<div className="shrink-0">
					<CinematicEventSpeakerImage
						speaker={id}
						className="relative top-4 -left-4 bg-cover rounded-bl-xl w-32 h-32"
					/>
				</div>
				<div className="flex justify-center items-center grow self-center">
					{showSelect && (
						<div className="text-center">
							<WSButton onClick={onSelectLocal}>
								<FormattedMessage id={Strings.use_on_character} values={{ name }} />
							</WSButton>
						</div>
					)}
					{showStats && (
						<ul className="flex flex-col gap-2 mt-4 basis-full">
							<CharacterStatistic
								textId={Strings.statistic_level}
								value={lastCharacterReadOnly?.level || characterReadOnly.level}
								next={characterReadOnly.level}
							/>
							<CharacterStatistic
								textId={Strings.statistic_attack}
								value={lastCombatantClass?.getAttackRaw() || combatantClass.getAttackRaw()}
								next={combatantClass.getAttackRaw()}
							/>
							<CharacterStatistic
								textId={Strings.statistic_defense}
								value={lastCombatantClass?.getDefense([]) || combatantClass.getDefense([])}
								next={combatantClass.getDefense([])}
							/>
						</ul>
					)}
				</div>
			</div>
		</Section>
	);
};
