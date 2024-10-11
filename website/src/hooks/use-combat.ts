/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../redux/reducer";
import { siteSlice } from "../redux/slice-site";
import { CombatItem, CombatantBase } from "../shared/combat-classes";
import {
	createPlayerCharacterCombat,
	getCombatCharacters,
	whoDoesEnemyWantToAttack,
	whoDoesGuestWantToAttack,
} from "../shared/helpers";
import { is } from "../shared/is";
import {
	CombatActionType,
	CombatAnimatedEventType,
	CombatantType,
	ICombatGuest,
	ICombatant,
	IEnemy,
	ILocationArea,
	PlayerCharacterCombat,
} from "../shared/types";

interface IResults {
	characters: PlayerCharacterCombat[];
	characterWhoseTurnItIs: PlayerCharacterCombat | undefined;

	enemies: IEnemy[];
	guests: ICombatGuest[];

	selectedAction: CombatActionType;
	selectedTarget: ICombatant | undefined;
	selectedItem: string | undefined;
	selectedSpell: string | undefined;

	isCombatOver: boolean;
	didPlayerWin: boolean;
	wasVictoryRecorded: boolean;

	setSelectedAction: (actionType: CombatActionType) => void;
	setSelectedTarget: (target: ICombatant) => void;
	setSelectedItem: (item: string) => void;
	setSelectedSpell: (spell: string) => void;
	isCombatantSelectable: (combatant: ICombatant) => boolean;
}

export function useLocationAreaCombat(area: ILocationArea): IResults {
	const dispatch = useDispatch();

	const enemies = useSelector((state: AppState) => state.site.combatEnemies);
	const guests = useSelector((state: AppState) => state.site.combatGuests);
	const combatStatus = useSelector((state: AppState) => state.site.combatStatus);
	const animations = useSelector((state: AppState) => state.site.combatAnimations);
	const catalog = useSelector((state: AppState) => state.site.catalog);
	const inventory = useSelector((state: AppState) => state.site.inventory);
	const partyWriteable = useSelector((state: AppState) => state.site.userDataPlayer.party);
	const charactersWriteable = partyWriteable.characters;
	const partyReadOnly = useSelector((state: AppState) => state.site.userDataReadOnly.party);
	const charactersReadOnly = partyReadOnly.characters.filter(c => c.available);
	const entityWhoseTurnItIs = useSelector((state: AppState) =>
		!is.null(state.site.combatStatus.combatants)
			? state.site.combatStatus.combatants[state.site.combatStatus.active]
			: undefined
	);

	const [selectedAction, setSelectedAction] = useState<CombatActionType>(CombatActionType.None);
	const [selectedTarget, setSelectedTarget] = useState<ICombatant>();
	const [selectedItem, setSelectedItem] = useState<string>();
	const [selectedSpell, setSelectedSpell] = useState<string>();

	const isCombatOver = combatStatus.isCombatOver;
	const wasVictoryRecorded = !is.null(combatStatus.results);

	const characters = useMemo<PlayerCharacterCombat[]>(
		() => getCombatCharacters(charactersWriteable, charactersReadOnly),
		[charactersReadOnly, charactersWriteable]
	);

	const didPlayerWin = useMemo(
		() => enemies.every(e => e.hp === 0) || (characters.every(c => c.hp === 0) && combatStatus.canLose),
		[characters, combatStatus.canLose, enemies]
	);

	const characterWhoseTurnItIs = useMemo(() => {
		if (isCombatOver) {
			return undefined;
		}

		return entityWhoseTurnItIs?.type === CombatantType.Character
			? characters.find(c => c.id === entityWhoseTurnItIs?.id)
			: undefined;
	}, [characters, entityWhoseTurnItIs?.id, entityWhoseTurnItIs?.type, isCombatOver]);

	const isCombatantSelectable = useCallback(
		(combatant: ICombatant) => {
			if (is.null(selectedAction)) {
				return false;
			}

			let combatantFull: CombatantBase;

			switch (combatant.type) {
				case CombatantType.Character:
					combatantFull = new CombatantBase(
						combatant,
						createPlayerCharacterCombat(combatant.id as number, partyWriteable, partyReadOnly),
						catalog
					);
					break;
				case CombatantType.Enemy:
					combatantFull = new CombatantBase(
						combatant,
						enemies.find(e => e.uniqueId === combatant.id)!,
						catalog
					);
					break;
				case CombatantType.Guest:
					combatantFull = new CombatantBase(combatant, guests.find(g => g.id === combatant.id)!, catalog);
					break;
			}

			switch (selectedAction) {
				case CombatActionType.Attack:
					// Don't let the player attack dead enemies
					if (combatant.type === CombatantType.Enemy) {
						const enemy = enemies.find(e => e.uniqueId === combatant.id);
						if (is.null(enemy) || enemy!.hp === 0) {
							return false;
						}
					}

					return combatant.type === CombatantType.Enemy;
				case CombatActionType.Item:
					if (is.null(selectedItem) || combatant.type === CombatantType.Enemy) {
						return false;
					}

					return new CombatItem(selectedItem, catalog, inventory).canBeUsedOn(combatantFull!);
				case CombatActionType.Spell:
					if (is.null(selectedSpell)) {
						return false;
					}

					return (
						combatant.type === CombatantType.Enemy &&
						new CombatItem(selectedSpell, catalog, inventory).canBeUsedOn(combatantFull!)
					);
				case CombatActionType.Defend:
					return combatant.type === CombatantType.Character || combatant.type === CombatantType.Guest;
				default:
					return false;
			}
		},
		[
			catalog,
			enemies,
			guests,
			inventory,
			partyReadOnly,
			partyWriteable,
			selectedAction,
			selectedItem,
			selectedSpell,
		]
	);

	const onSelectTarget = useCallback(
		(target: ICombatant) => {
			setSelectedTarget(target);

			switch (selectedAction) {
				case CombatActionType.Attack:
					dispatch(
						siteSlice.actions.combatAnimation({
							destination: target,
							source: entityWhoseTurnItIs as ICombatant,
							action: selectedAction,
						})
					);
					break;
				case CombatActionType.Item:
					dispatch(
						siteSlice.actions.combatAnimation({
							destination: target,
							source: entityWhoseTurnItIs as ICombatant,
							action: selectedAction,
							item: selectedItem,
						})
					);
					break;
				case CombatActionType.Spell:
					dispatch(
						siteSlice.actions.combatAnimation({
							destination: target,
							source: entityWhoseTurnItIs as ICombatant,
							action: selectedAction,
							spell: selectedSpell,
						})
					);
					break;
				case CombatActionType.Defend:
					dispatch(
						siteSlice.actions.combatAnimation({
							destination: target,
							source: entityWhoseTurnItIs as ICombatant,
							action: selectedAction,
						})
					);
					break;
			}

			setSelectedAction(CombatActionType.None);
		},
		[dispatch, entityWhoseTurnItIs, selectedAction, selectedItem, selectedSpell]
	);

	const onSetSelectedAction = useCallback((action: CombatActionType) => {
		setSelectedAction(action);

		setSelectedTarget(undefined);
		setSelectedSpell(undefined);
		setSelectedItem(undefined);
	}, []);

	useEffect(() => {
		// Begin combat
		dispatch(siteSlice.actions.combat(area));
	}, [area, dispatch]);

	useEffect(() => {
		// Enemy and guest actions
		if (isCombatOver) {
			return;
		}

		switch (entityWhoseTurnItIs?.type) {
			case CombatantType.Enemy:
				dispatch(
					siteSlice.actions.combatAnimation({
						action: CombatActionType.Attack,
						source: { type: CombatantType.Enemy, id: entityWhoseTurnItIs?.id },
						destination: whoDoesEnemyWantToAttack(
							enemies.find(e => e.uniqueId === entityWhoseTurnItIs?.id),
							enemies,
							characters,
							guests
						)!,
					})
				);
				break;
			case CombatantType.Guest:
				dispatch(
					siteSlice.actions.combatAnimation({
						action: CombatActionType.Attack,
						source: { type: CombatantType.Guest, id: entityWhoseTurnItIs?.id },
						destination: whoDoesGuestWantToAttack(enemies)!,
					})
				);
				break;
			case CombatantType.Character:
			default:
				// Do nothing
				break;
		}
	}, [characters, dispatch, enemies, entityWhoseTurnItIs, guests, isCombatOver]);

	useEffect(() => {
		const timeouts: any[] = [];
		animations
			.filter(a => a.type === CombatAnimatedEventType.dispatch)
			.forEach(a => {
				timeouts.push(
					setTimeout(() => {
						dispatch(a.dispatch);
					}, a.delay * 1000)
				);
			});

		animations
			.filter(a => a.type === CombatAnimatedEventType.finished)
			.forEach(a => {
				timeouts.push(
					setTimeout(() => {
						dispatch(siteSlice.actions.combatAdvance());
						setSelectedTarget(undefined);
					}, a.delay * 1000)
				);
			});

		return () => timeouts.forEach(t => clearTimeout(t));
	}, [animations, dispatch]);

	return {
		characters,
		characterWhoseTurnItIs,

		enemies,
		guests,

		selectedAction,
		selectedTarget,
		selectedItem,
		selectedSpell,

		isCombatOver,
		didPlayerWin,
		wasVictoryRecorded,

		setSelectedAction: onSetSelectedAction,
		setSelectedTarget: onSelectTarget,
		setSelectedItem,
		setSelectedSpell,
		isCombatantSelectable,
	};
}
