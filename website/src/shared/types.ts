/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { WSButtonStyle } from "../components/button";

type TITLE_DATA_KEYS = "multipliers";
export const TITLE_DATA_KEYS_ALL: TITLE_DATA_KEYS[] = ["multipliers"];

type USER_DATA_KEYS_PLAYER =
	| "stats"
	| "location"
	| "party"
	| "notifications"
	| "cinematicProgression"
	| "enemyGroupProgression";
export const USER_DATA_KEYS_PLAYER_ALL: USER_DATA_KEYS_PLAYER[] = [
	"stats",
	"location",
	"party",
	"notifications",
	"cinematicProgression",
	"enemyGroupProgression",
];

type USER_DATA_KEYS_READONLY = "completed" | "party";
export const USER_DATA_KEYS_READONLY_ALL: USER_DATA_KEYS_READONLY[] = ["completed", "party"];

export const NEUTRAL = "NEUTRAL";
export const SEARCH_ITEMS_MAX_COUNT = 50;
export const FRIENDLYID = "FriendlyId";
export const CURRENCY_TYPE = "currency";
export const WEAPON_CONTENT_TYPE = "weapon";
export const ARMOR_CONTENT_TYPE = "armor";
export const CONSUMABLE_CONTENT_TYPE = "consumable";
export const SPELL_CONTENT_TYPE = "spell";
export const COMBAT_ANIMATION_TIME_FLOATING_NUMBER = 1000;
export const COMBAT_ANIMATION_TIME_ATTACKING = 1;
export const COMBAT_ANIMATION_TIME_SPELL = 0.5;
export const COMBAT_ANIMATION_TIME_BATTLE_OVER = 2000;
export const COMBAT_ANIMATION_TIME_SPACING = 250;
export const ANIMATION_TIME_WATCH_BAR_FILL = 1250;

export type PlayerInventoryItemActions = "sell" | "use";

// ----- Local data -----

export interface ILocalDataLocations {
	map: string[];
	locations: ILocation[];
}

export interface ILocalDataEnemies {
	enemies: IEnemy[];
	groups: IEnemyGroup[];
	progressions: IEnemyGroupProgression[];
}

export interface ILocalDataCinematics {
	progressions: ICinematicProgression[];
}

// ----- User data -----

type UserDataPlayerNotifications = "party";

export interface IUserDataPlayer {
	location: IUserDataLocation;
	party: IUserDataPlayerParty;
	notifications: UserDataPlayerNotifications[];
	cinematicProgression: IUserDataPlayerCinematicProgression[];
	enemyGroupProgression: IUserDataPlayerEnemyGroupProgression[];
}

export interface IUserDataPlayerCinematicProgression {
	id: string;
	cinematics: string[];
}

export interface IUserDataPlayerEnemyGroupProgression {
	id: string;
	index: number;
}

export interface IUserDataReadOnly {
	completed: IUserDataReadOnlyCompleted;
	party: IUserDataReadOnlyParty;
}

export type UserDataReadOnlyCompletedCheckpoints = "first-battle" | "party" | "uncaged" | "sara-magic" | "anarta";

interface IUserDataReadOnlyCompleted {
	initialGrant: boolean;
	checkpoints: UserDataReadOnlyCompletedCheckpoints[];
}

export interface IUserDataLocation {
	id: string;
	map: string[];
}

export interface IUserDataPlayerParty {
	characters: IUserDataPlayerPlayerCharacter[];
	guests: CinematicEventSpeaker[];
}

export interface IUserDataPlayerPlayerCharacter {
	id: number;
	weapon: string;
	armor: string;
	spells?: string[];
}

export interface IUserDataReadOnlyParty {
	characters: IUserDataReadOnlyPlayerCharacter[];
}

export interface ICombatantBase {
	hp: number;
	maxHP: number;
	mp: number;
	maxMP: number;
}

export interface IUserDataReadOnlyPlayerCharacter extends ICombatantBase {
	id: number;
	xp: number;
	xpToNextLevel: number;
	xpToCurrentLevel: number;
	level: number;
	attack: number;
	defense: number;
	available: boolean;
}

export interface ICombatantTemporaryCombatEffectGroup {
	combatant: ICombatant;
	effects: ICombatantTemporaryCombatEffect[];
}

export enum CombatantTemporaryCombatEffect {
	defense,
	poison,
}

export interface ICombatantTemporaryCombatEffect {
	effect: CombatantTemporaryCombatEffect;
	value: number;
	duration: number;
}

export type PlayerCharacterCombat = IUserDataPlayerPlayerCharacter & IUserDataReadOnlyPlayerCharacter;

export interface IPlayerCharacterReadonlyComparison {
	before: IUserDataReadOnlyPlayerCharacter;
	after: IUserDataReadOnlyPlayerCharacter;
}

// ----- Cloud Script -----

export interface ICloudScriptCombatVictoryRequest {
	party: IUserDataReadOnlyParty;
	xpEarned: number;
	reward: string;
	itemsUsed: ICloudScriptCombatVictoryItemsUsed;
}

export interface ICloudScriptCombatVictoryItemsUsed {
	[itemId: string]: number;
}

export interface ICloudScriptCombatVictoryResult {
	itemsGranted: PlayFabEconomyModels.CatalogItemReference[];
	characters: IUserDataReadOnlyPlayerCharacter[];
}

// ----- Locations -----

export interface ILocationBase {
	id: string;
	name: string;
	description: string;
	descriptionHover?: string;
	image: string;
	imageHover?: string;
	script?: string;
}

type LocationLayout = "areas" | "grid";

export interface ILocation extends ILocationBase {
	// Optional, but these two go together if you want a backlink
	backLink?: string;

	layout?: LocationLayout;
	areas: ILocationArea[];
}

export enum LocationAreaType {
	Shop = 0,
	Combat = 1,
	Cinematic = 2,
}

export interface ILocationArea extends ILocationBase {
	type: LocationAreaType;
	store?: string;
	enemyGroup?: string;
	enemyGroupProgression?: string;
	cinematic?: string;
	cinematicProgression?: string;
	postCombatLocation?: string;
	postCombatArea?: string;
}

// ----- Guests -----

export interface ICombatGuest extends ICombatantBase {
	id: CinematicEventSpeaker;
	damage: number;
	range: number;
}

// ----- Enemies -----

export interface IEnemy extends ICombatantBase {
	id: string;
	name: string;
	image: string;
	description: string;
	damage: number;
	range: number;
	xp: number;
	size: EnemySpriteSize;

	brand?: string;
	uniqueId?: string;
	threat?: IEnemyThreat[];
}

export enum EnemySpriteSize {
	Small = 0,
	Medium = 1,
}

export interface IEnemyThreat {
	combatant: ICombatant;
	threat: number;
	weightedThreat?: number;
	cumulativeThreat?: number;
}

export enum CombatGroupTurnOrder {
	PlayerFirst = 0,
	EnemiesFirst = 1,
	Random = 2,
}

export interface IEnemyGroupProgression {
	id: string;
	groups: string[];
}

export interface IEnemyGroup {
	id: string;
	turnOrder: CombatGroupTurnOrder;
	enemies: string[];
	reward?: string;
	canLose?: boolean;
}

// ----- Combat -----

export interface ICombatStatus {
	canLose: boolean;
	isCombatOver: boolean;
	active: number;
	combatants: ICombatant[];
	results: ICloudScriptCombatVictoryResult | undefined;
}

export interface ICombatant {
	type: CombatantType;
	id: string | number;
}

export enum CombatantType {
	Character,
	Enemy,
	Guest,
}

export interface ICombatEvent {
	action: CombatActionType;
	source: ICombatant;
	destination: ICombatant;
	date?: number;
	values?: ICombatEventMeaning[];
	spell?: string;
	item?: string;
}

export interface ICombatEventMeaning {
	meaning: CombatValueMeaning;
	value: number;
}

export enum CombatValueMeaning {
	Damage = 0,
	Healing = 1,
	Revive = 2,
}

export enum CombatActionType {
	Attack = 0,
	Item = 1,
	Defend = 2,
	Spell = 3,
	None = 4,
}

export enum CombatAnimatedEventType {
	animation = 0,
	dispatch = 1,
	finished = 2,
}

export enum CombatAnimationPerformance {
	attack = 0,
	damage = 1,
	item = 2,
	casting = 3,
	healing = 4,
	spell = 5,
	defend = 6,
}

export interface ICombatAnimatedEvent {
	delay: number;
	type: CombatAnimatedEventType;
	actor?: ICombatant;
	target?: ICombatant;
	animation?: CombatAnimationPerformance;
	duration?: number;
	dispatch?: any;
	spellId?: string;
}

// ----- Site -----

export interface IPropsChildren {
	children: React.ReactNode | React.ReactNode[];
}

export interface IPropsClassName {
	className?: string;
}

export type IPropsChildrenClassName = IPropsChildren & IPropsClassName;

// ----- Weapons, armor, items, spells -----

export interface IEconomyArmor {
	defense: number; // added to character defense to block attacks
}

export interface IEconomyItem {
	effects: IEconomyEffect[];
}

export interface IEconomyWeapon extends IEconomyItem {}

export interface IEconomySpell extends IEconomyItem {
	mp: number;
}

export interface IEconomyEffect {
	type: IEconomyEffectType;
	value: number;
	range?: number;
}

export type PartyCharacterEquipmentType = "weapon" | "armor";

export interface IEquipAction {
	id: CinematicEventSpeaker;
	type: PartyCharacterEquipmentType;
	itemId: string;
}

export type IEconomyEffectType = "damage" | "healing" | "mp" | "defense" | "revive";

// ----- Cinematics (NPC) -----

export enum CinematicEventType {
	Heading = 0,
	Messages = 1,
	Image = 2,
	Headshot = 3,
	Button = 4,
	ActionExecute = 5,
}

export interface ICinematic {
	id: string;
	watch?: ICinematicWatch[];
	events: ICinematicEventBase[];
}

export type CinematicWatchType =
	| "fishingStoreBuySomething"
	| "didNadiaSurviveLastBattle"
	| "hasRescuedEveryoneFromWesternSongForest";

export interface ICinematicWatch {
	condition: CinematicWatchType;
	actions: ICinematicEventButtonAction[];
	failure?: ICinematicEventButtonAction[];
}

export interface ICinematicEventBase {
	type: CinematicEventType;
}

export interface ICinematicEventHeading extends ICinematicEventBase {
	text: string;
	thought?: boolean;
}

export enum CinematicEventSpeaker {
	Sara = 0,
	Nadia = 1,
	Warren = 2,

	Shazim = 100,
	Lochan = 101,
	Anais = 102,
	Ronald = 103,
	GreenCityGateGuard = 104,
}

export interface ICinematicEventMessages extends ICinematicEventBase {
	text: string;
	speaker?: CinematicEventSpeaker;
	messages: string[];
	thought?: boolean;
}

export interface ICinematicEventImage extends ICinematicEventBase {
	image: string;
	alt: string;
}

export interface ICinematicEventHeadshot extends ICinematicEventBase {
	speaker?: CinematicEventSpeaker;
}

export enum CinematicEventButtonActionType {
	ChangeCinematic = 0,
	LocationAdd = 1,
	LocationRemove = 2,
	LocationSet = 3,
	AreaSet = 4,
	CloudScript = 5,
	GetReadOnlyData = 6,
	GetWriteableData = 7,
	Delay = 8,
	GetInventory = 9,
	AddGuest = 10,
	RemoveGuest = 11,
	UpdateWriteableData = 12,
	CinematicProgressionClear = 13,
	TheEnd = 100,
}

export interface ICinematicEventButton extends ICinematicEventBase {
	text: string;
	loading?: boolean;
	sequential?: boolean;
	actions: ICinematicEventButtonAction[];
}

export interface ICinematicEventActionExecute extends ICinematicEventBase {
	sequential?: boolean;
	actions: ICinematicEventButtonAction[];
}

export interface ICinematicEventButtonAction {
	type: CinematicEventButtonActionType;
	value: string; // In type 5, CloudScript, this is the FunctionName
	argument?: any;
}

export interface ICinematicProgression {
	id: string;
	cinematics: string[];
}

// ----- Miscellaneous -----

export interface IMultipliers {
	sell: number;
}

export interface INotification {
	title: string;
	id: UserDataPlayerNotifications;
	icon?: string;
	iconColor?: string;
	description?: string;
	actionButtons?: INotificationActionButtons[];
}

export type NotificationActionButtonsDestination = "party-characters";

interface INotificationActionButtons {
	text: string;
	destination: NotificationActionButtonsDestination;
	style?: WSButtonStyle;
}

export interface IHeaderNavigationRoute {
	text: string;
	link?: string;
	onClick?: (e: React.SyntheticEvent<any>) => void;
	isActive: boolean;
}
