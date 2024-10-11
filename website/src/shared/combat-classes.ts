/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { clampNumber, isCombatantEqual, randomNumber } from "./helpers";
import { is } from "./is";
import {
	CombatValueMeaning,
	CombatantTemporaryCombatEffect,
	CombatantType,
	ICombatEventMeaning,
	ICombatGuest,
	ICombatant,
	ICombatantBase,
	ICombatantTemporaryCombatEffectGroup,
	IEconomyArmor,
	IEconomyEffect,
	IEconomyItem,
	IEconomySpell,
	IEconomyWeapon,
	IEnemy,
	IEnemyThreat,
	IUserDataReadOnlyPlayerCharacter,
	PlayerCharacterCombat,
} from "./types";

export class CombatantBase {
	private combatant: ICombatant;
	private baseStats: ICombatantBase;

	private defense = 0;
	private attack = 0;
	private attackRange = 0;
	private level = 0;

	public uniqueId = "";
	private threat: IEnemyThreat[] = [];

	constructor(
		combatant: ICombatant,
		data: PlayerCharacterCombat | IEnemy | ICombatGuest,
		catalog: PlayFabEconomyModels.CatalogItem[]
	) {
		this.combatant = combatant;
		this.baseStats = {
			hp: data.hp,
			maxHP: data.maxHP,
			maxMP: data.maxMP,
			mp: data.mp,
		};

		this.setData(combatant.type, data);
		this.setDefense(combatant.type, data, catalog);
		this.setAttack(combatant.type, data, catalog);
	}

	public toReadOnlyCharacter(): Partial<IUserDataReadOnlyPlayerCharacter> {
		return {
			hp: this.baseStats.hp,
			mp: this.baseStats.mp,
		};
	}

	public toEnemy(): Partial<IEnemy> {
		return {
			hp: this.baseStats.hp,
			threat: this.threat,
			mp: this.baseStats.mp,
		};
	}

	public getDefense(effects: ICombatantTemporaryCombatEffectGroup[]): number {
		return this.defense + this.getDefenseEffectModifier(effects);
	}

	public getAttackRaw(): number {
		return this.attack;
	}

	public getAttack(): number {
		return this.attack + Math.floor(randomNumber(this.attack * -1, this.attack) * this.attackRange);
	}

	public estimateValueFrom(
		eventMeaning: ICombatEventMeaning,
		effects: ICombatantTemporaryCombatEffectGroup[]
	): number {
		switch (eventMeaning.meaning) {
			case CombatValueMeaning.Healing:
				return this.calculateHealing(eventMeaning.value);
			case CombatValueMeaning.Revive:
				return this.calculateRevive(eventMeaning.value);
			case CombatValueMeaning.Damage:
			default:
				return Math.max(0, eventMeaning.value - this.getDefense(effects));
		}
	}

	public takeDamage(source: ICombatant | undefined, damage: number): void {
		this.baseStats.hp = clampNumber(0, this.baseStats.maxHP, this.baseStats.hp - damage);

		if (source) {
			this.addThreat(source, damage);
		}
	}

	public calculateHealing(healing: number): number {
		return healing;
	}

	public takeHealing(healing: number): void {
		if (this.baseStats.hp <= 0) {
			return;
		}

		this.baseStats.hp = clampNumber(0, this.baseStats.maxHP, this.baseStats.hp + healing);
	}

	public calculateRevive(percentage: number): number {
		return Math.ceil((percentage / 100) * this.baseStats.maxHP);
	}

	public takeRevive(healing: number): void {
		if (this.baseStats.hp > 0) {
			return;
		}

		this.baseStats.hp = clampNumber(0, this.baseStats.maxHP, this.baseStats.hp + healing);
	}

	public getStats(): ICombatantBase {
		return this.baseStats;
	}

	public isYou(combatant: ICombatant): boolean {
		return isCombatantEqual(this.combatant, combatant);
	}

	public canCast(spell: CombatSpell): boolean {
		return this.baseStats.mp >= spell.getMPCost();
	}

	public castSpell(spell: CombatSpell): void {
		this.baseStats.mp = Math.max(0, this.baseStats.mp - spell.getMPCost());
	}

	private xpThresholds: number[] = [0, 100, 300, 900, 2000, 5000, 7500, 10000];

	public getXPToNextLevel(): number {
		if (this.level + 1 > this.xpThresholds.length) {
			return Number.MAX_SAFE_INTEGER;
		}

		return this.xpThresholds[this.level];
	}

	public getXPToCurrentLevel(): number {
		if (this.level < 2) {
			return this.xpThresholds[0];
		}

		return this.xpThresholds[this.level - 1];
	}

	public getXPRemainingToNextLevel(): number {
		return Math.max(0, this.getXPToNextLevel() - this.getXPToCurrentLevel());
	}

	public getXPToNextLevelAdjusted(xp: number): number {
		return Math.max(0, xp - this.getXPToCurrentLevel());
	}

	public canReceiveHealing(): boolean {
		return this.baseStats.hp > 0 && this.baseStats.hp < this.baseStats.maxHP;
	}

	public canBeRevived(): boolean {
		return this.baseStats.hp <= 0;
	}

	public isDead(): boolean {
		return this.baseStats.hp <= 0;
	}

	// ----- Private functions ----- //

	private addThreat(source: ICombatant, damage: number): void {
		if (this.combatant.type !== CombatantType.Enemy) {
			return;
		}

		if (is.null(this.threat.find(t => isCombatantEqual(t.combatant, source)))) {
			this.threat.push({ combatant: source, threat: damage });
			return;
		}

		this.threat = this.threat.map(t => {
			if (isCombatantEqual(t.combatant, source)) {
				return {
					...t,
					threat: t.threat + damage,
				};
			}

			return t;
		});
	}

	private setData(type: CombatantType, data: PlayerCharacterCombat | IEnemy | ICombatGuest): void {
		let enemy: IEnemy;
		let character: PlayerCharacterCombat;

		switch (type) {
			case CombatantType.Character:
				character = data as PlayerCharacterCombat;
				this.level = character.level;
				break;
			case CombatantType.Enemy:
				enemy = data as IEnemy;
				this.threat = enemy.threat as IEnemyThreat[];
				this.uniqueId = enemy.uniqueId as string;
				break;
		}
	}

	private setDefense(
		type: CombatantType,
		data: PlayerCharacterCombat | IEnemy | ICombatGuest,
		catalog: PlayFabEconomyModels.CatalogItem[]
	): void {
		let character: PlayerCharacterCombat;
		let enemy: IEnemy;
		let characterArmor: IEconomyArmor | undefined;

		switch (type) {
			case CombatantType.Character:
				character = data as PlayerCharacterCombat;
				characterArmor = catalog.find(c => c.Id === character.armor)?.DisplayProperties as IEconomyArmor;

				this.defense += character.defense;
				this.defense += characterArmor?.defense || 0;
				break;
			case CombatantType.Enemy:
				enemy = data as IEnemy;
				// TODO: Defense for enemies?
				enemy.toString();
				break;
		}
	}

	private setAttack(
		type: CombatantType,
		data: PlayerCharacterCombat | IEnemy | ICombatGuest,
		catalog: PlayFabEconomyModels.CatalogItem[]
	): void {
		let character: PlayerCharacterCombat;
		let enemy: IEnemy;
		let guest: ICombatGuest;
		let characterWeapon: CombatWeapon | undefined;

		switch (type) {
			case CombatantType.Character:
				character = data as PlayerCharacterCombat;

				if (!is.null(character.weapon)) {
					characterWeapon = new CombatWeapon(character.weapon, catalog);

					this.attack += character.attack;
					this.attack += characterWeapon.getValue(CombatValueMeaning.Damage, this);
					this.attackRange = characterWeapon.getAttackRange();
				}
				break;
			case CombatantType.Enemy:
				enemy = data as IEnemy;
				this.attack += enemy.damage;
				this.attackRange = enemy.range;
				break;
			case CombatantType.Guest:
				guest = data as ICombatGuest;
				this.attack += guest.damage;
				this.attackRange = guest.range;
				break;
		}
	}

	private getDefenseEffectModifier(effects: ICombatantTemporaryCombatEffectGroup[]): number {
		const yourEfffects = effects.find(e => isCombatantEqual(e.combatant, this.combatant));

		if (is.null(yourEfffects)) {
			return 0;
		}

		return (
			yourEfffects!.effects.find(e => e.effect === CombatantTemporaryCombatEffect.defense && e.duration > 0)
				?.value || 0
		);
	}
}

export abstract class CombatEconomyItem {
	protected id = "";
	protected effects: IEconomyEffect[] = [];

	public isYou(id: string | undefined): boolean {
		return this.id === id;
	}

	public getValue(meaning: CombatValueMeaning, combatant: CombatantBase): number {
		// Go through the effects and filter to those whose type (converted) matches this meaning
		// Then sum the values of those effects.
		// Combatant is necessary because the revive effect is a percentage of the max HP

		// Short-circuit for just revive items
		if (meaning === CombatValueMeaning.Revive) {
			const revivePercentage = this.effects.find(e => e.type === "revive")?.value || 0;

			return combatant.calculateRevive(revivePercentage);
		}

		return this.effects
			.filter(current => {
				switch (meaning) {
					case CombatValueMeaning.Healing:
						return current.type === "healing";
					case CombatValueMeaning.Damage:
					default:
						return current.type === "damage";
				}
			})
			.reduce((acc, current) => acc + current.value, 0);
	}

	public getMeanings(): CombatValueMeaning[] {
		return this.effects.map(current => {
			switch (current.type) {
				case "healing":
					return CombatValueMeaning.Healing;
				case "revive":
					return CombatValueMeaning.Revive;
				case "damage":
				default:
					return CombatValueMeaning.Damage;
			}
		});
	}

	public abstract isSpell(): boolean;
}

export class CombatWeapon extends CombatEconomyItem {
	constructor(id: string | undefined, catalog: PlayFabEconomyModels.CatalogItem[]) {
		super();
		const catalogItem = catalog.find(c => c.Id === id)!;
		const weapon = catalogItem.DisplayProperties as IEconomyWeapon;

		this.id = id as string;
		this.effects = weapon.effects;
	}

	public getAttackRange(): number {
		return this.effects.filter(e => e.type === "damage").reduce((acc, current) => acc + (current.range || 0), 0);
	}

	public isSpell(): boolean {
		return false;
	}
}

export class CombatSpell extends CombatEconomyItem {
	private mp: number;

	constructor(id: string | undefined, catalog: PlayFabEconomyModels.CatalogItem[]) {
		super();
		const catalogItem = catalog.find(c => c.Id === id)!;
		const spell = catalogItem.DisplayProperties as IEconomySpell;

		this.id = id as string;
		this.effects = spell.effects;
		this.mp = spell.mp;
	}

	public getMPCost(): number {
		return this.mp;
	}

	public isSpell(): boolean {
		return true;
	}
}

export class CombatItem extends CombatEconomyItem {
	private amount: number = 0;

	constructor(
		id: string | undefined,
		catalog: PlayFabEconomyModels.CatalogItem[],
		inventory: PlayFabEconomyModels.InventoryItem[]
	) {
		super();

		if (is.null(id)) {
			return;
		}

		const catalogItem = catalog.find(c => c.Id === id)!;
		const item = catalogItem.DisplayProperties as IEconomyItem;

		this.id = id as string;
		this.effects = item.effects;
		this.amount = inventory.find(i => i.Id === id)?.Amount || 0;
	}

	public canUse(): boolean {
		return this.amount > 0;
	}

	public canBeUsedOn(combatant: CombatantBase): boolean {
		let canBeUsed = false;
		const meanings = this.getMeanings();

		if (meanings.some(m => m === CombatValueMeaning.Healing) && combatant.canReceiveHealing()) {
			canBeUsed = true;
		} else if (meanings.some(m => m === CombatValueMeaning.Revive) && combatant.canBeRevived()) {
			canBeUsed = true;
		} else if (meanings.some(m => m === CombatValueMeaning.Damage) && !combatant.isDead()) {
			canBeUsed = true;
		}

		return canBeUsed;
	}

	public getAmount(): number {
		return this.amount;
	}

	public use(quantity = 1): void {
		this.amount = Math.max(0, this.amount - quantity);
	}

	public isSpell(): boolean {
		return false;
	}
}
