/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { Page } from "../components/page";
import { SandboxCombatBars } from "../components/sandbox/combat-bars";
import { SandboxFixLevelUpXpBar } from "../components/sandbox/fix-level-up-xp-bar";
import { DivPageWrapper, H1Left } from "../components/tailwind";
import { is } from "../shared/is";

export const SandboxPage: React.FunctionComponent = () => {
	if (is.production()) {
		return null;
	}

	return (
		<Page title="Sandbox">
			<DivPageWrapper>
				<ul className="flex flex-wrap gap-4">
					<li className="basis-full">
						<H1Left>Fix level up XP bar</H1Left>
						<div className="my-4">
							<SandboxFixLevelUpXpBar />
						</div>
					</li>
					<li className="basis-full">
						<H1Left>Improve combat bar styling</H1Left>
						<div className="my-4">
							<SandboxCombatBars />
						</div>
					</li>
				</ul>
			</DivPageWrapper>
		</Page>
	);
};
