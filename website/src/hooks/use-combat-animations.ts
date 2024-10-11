/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AnimationScope, DOMKeyframesDefinition, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../redux/reducer";
import { getSpellEffectImageUri } from "../shared/helpers";
import { is } from "../shared/is";
import { CombatAnimatedEventType, CombatAnimationPerformance, CombatantType, ICombatant } from "../shared/types";

interface IResults {
	scope: AnimationScope<any>;
	spellEffectImageUri: string;
}

function getActorHtmlId(combatant: ICombatant): string {
	switch (combatant.type) {
		case CombatantType.Character:
			return `#c-${combatant.id}`;
		case CombatantType.Enemy:
			return `#e-${combatant.id}`;
		case CombatantType.Guest:
			return `#g-${combatant.id}`;
		default:
			throw `Could not find combatant type ${combatant.type}`;
	}
}

export function useCombatAnimations(): IResults {
	const [scope, animate] = useAnimate();
	const [spellEffectImageUri, setSpellEffectImageUri] = useState("");
	const animations = useSelector((state: AppState) => state.site.combatAnimations);
	const catalog = useSelector((state: AppState) => state.site.catalog);

	useEffect(() => {
		animations
			.filter(a => a.type === CombatAnimatedEventType.animation)
			.forEach(a => {
				let selector = "";
				let keyframes: DOMKeyframesDefinition = { transform: "translateX(0) translateY(0) rotate(0deg)" };
				let source: DOMRect;
				let destination: DOMRect;
				let spellRect: DOMRect;
				let spellImageUri: string;

				if (is.null(a.actor?.id)) {
					return;
				}

				selector = getActorHtmlId(a.actor!);

				switch (a.animation) {
					case CombatAnimationPerformance.attack:
						switch (a.actor?.type) {
							case CombatantType.Character:
							case CombatantType.Guest:
								// Characters move right
								keyframes = {
									transform: [
										"translateX(0)",
										"translateX(-10px)",
										"translateX(-20px)",
										"translateX(50px)",
										"translateX(0)",
										"translateX(0)",
										"translateX(0)",
									],
								};
								break;
							case CombatantType.Enemy:
								// Enemies move left

								keyframes = {
									transform: [
										"translateX(0)",
										"translateX(10px)",
										"translateX(20px)",
										"translateX(-50px)",
										"translateX(0)",
										"translateX(0)",
										"translateX(0)",
									],
								};
								break;
						}
						break;
					case CombatAnimationPerformance.damage:
						// Shudder and slide down slightly, then zip back to the intial position
						keyframes = {
							transform: [
								"translateY(0) rotate(4deg)",
								"translateY(0) rotate(-4deg)",
								"translateY(0) rotate(4deg)",
								"translateY(0) rotate(-4deg)",
								"translateY(0) rotate(4deg)",
								"translateY(0) rotate(-4deg)",
								"translateY(5px) rotate(-4deg)",
								"translateY(5px) rotate(-4deg)",
								"translateY(5px) rotate(-4deg)",
								"translateY(5px) rotate(-4deg)",
								"translateY(0) rotate(0deg)",
							],
						};
						break;
					case CombatAnimationPerformance.casting:
						keyframes = {
							transform: [
								"rotate(0deg)",
								"rotate(1deg)",
								"rotate(2deg)",
								"rotate(3deg)",
								"rotate(4deg)",
								"rotate(5deg)",
								"rotate(-10deg)",
								"rotate(-10deg)",
								"rotate(0deg)",
								"rotate(0deg)",
								"rotate(0deg)",
								"rotate(0deg)",
							],
						};
						break;
					case CombatAnimationPerformance.spell:
						selector = "#spell-effect";
						spellImageUri = getSpellEffectImageUri(a.spellId as string, catalog);
						new Image().src = spellImageUri;
						setSpellEffectImageUri(spellImageUri);
						source = (
							document.querySelector(getActorHtmlId(a.actor!)) as HTMLDivElement
						).getBoundingClientRect();
						destination = (
							document.querySelector(getActorHtmlId(a.target!)) as HTMLDivElement
						).getBoundingClientRect();
						spellRect = (document.querySelector(selector) as HTMLImageElement).getBoundingClientRect();
						keyframes = {
							opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
							translate: [
								`${source.left + spellRect.width * 0.5 - spellRect.x}px ${window.scrollY + source.top - spellRect.height / 2}px`,
								`${source.left + spellRect.width * 0.75 - spellRect.x}px ${window.scrollY + source.top - spellRect.height / 2}px`,
								`${source.left + spellRect.width * 1 - spellRect.x}px ${window.scrollY + source.top - spellRect.height / 2}px`,
								`${destination.left - spellRect.width / 4 - spellRect.x}px ${window.scrollY + destination.top - spellRect.height / 2}px`,
							],
						};
						break;
					case CombatAnimationPerformance.item:
						keyframes = {
							transform: [
								"rotate(4deg)",
								"rotate(4deg)",
								"rotate(4deg)",
								"rotate(-4deg)",
								"rotate(-4deg)",
								"rotate(-4deg)",
								"rotate(4deg)",
								"rotate(4deg)",
								"rotate(4deg)",
								"rotate(-4deg)",
								"rotate(-4deg)",
								"rotate(-4deg)",
								"rotate(0deg)",
							],
						};
						break;
					case CombatAnimationPerformance.defend:
					case CombatAnimationPerformance.healing:
						keyframes = {
							transform: [
								"translateY(5px)",
								"translateY(0px)",
								"translateY(0px)",
								"translateY(0px)",
								"translateY(5px)",
								"translateY(0px)",
								"translateY(0px)",
								"translateY(0px)",
								"translateY(5px)",
								"translateY(0px)",
								"translateY(0px)",
								"translateY(0px)",
							],
						};
						break;
				}

				animate(selector, keyframes, {
					delay: a.delay,
					duration: a.duration,
				}).then(() => {
					// Did we animate a spell effect? If so, reset its position
					if (a.animation === CombatAnimationPerformance.spell) {
						animate(selector, { translate: "0px 0px" }, { duration: 0 });
					}
				});
			});
	}, [animate, animations, catalog]);

	return { scope, spellEffectImageUri };
}
