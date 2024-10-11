/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { usePartyInventorySpells, usePartySettings } from "../../hooks/use-party";
import { AppState } from "../../redux/reducer";
import Strings from "../../strings";
import { WSButton } from "../button";
import { Errors } from "../errors";
import { WSForm } from "../form";
import { WSIcon } from "../icon";
import { Loading } from "../loading";
import { WSPopup, WSPopupCloseButton, WSPopupContent } from "../popups";
import { WSTabs } from "../tabs";
import { H1PopupTitle, HeaderPopup, Section, UlConfirmButtons, UlGrid } from "../tailwind";
import { WSTextField } from "../text-field";
import { PartyCharacter } from "./character/character";
import { PlayerCurrencyList } from "./currency/list";
import { PartyGuest } from "./guest";
import { PlayerInventory } from "./inventory";

interface IProps {
	isVisible: boolean;
	onDismiss: () => void;
}

export const PartyPopup: React.FunctionComponent<IProps> = ({ isVisible, onDismiss }) => {
	return (
		<WSPopup
			onDismiss={onDismiss}
			isOpen={isVisible}
			isBlocking={false}
			styles={{
				root: { alignItems: "flex-start", paddingTop: "2rem" },
				main: { width: "90vw", maxWidth: "75rem" },
				scrollableContent: { width: "90vw", maxWidth: "75rem" },
			}}>
			<HeaderPopup>
				<H1PopupTitle>
					<FormattedMessage id={Strings.nav_party} />
				</H1PopupTitle>
				<WSPopupCloseButton onDismiss={onDismiss} />
			</HeaderPopup>
			<WSPopupContent>
				<PartyPageContent />
			</WSPopupContent>
		</WSPopup>
	);
};

const PartyPageContent: React.FunctionComponent = () => {
	const intl = useIntl();
	const [tab, setTab] = useState(0);
	const hasGuests = useSelector((state: AppState) => state.site.userDataPlayer.party.guests)?.length > 0;

	return (
		<>
			<WSTabs
				className="mb-4"
				tabs={[
					{
						isCurrent: tab === 0,
						onClick: () => setTab(0),
						text: intl.formatMessage({ id: Strings.party_tab_inventory }),
					},
					{
						isCurrent: tab === 1,
						onClick: () => setTab(1),
						text: intl.formatMessage({ id: Strings.party_tab_characters }),
					},
					{
						isCurrent: tab === 4,
						onClick: () => setTab(4),
						text: hasGuests ? intl.formatMessage({ id: Strings.party_tab_guests }) : "",
					},
					{
						isCurrent: tab === 2,
						onClick: () => setTab(2),
						text: intl.formatMessage({ id: Strings.party_tab_magic }),
					},
					{
						isCurrent: tab === 3,
						onClick: () => setTab(3),
						text: intl.formatMessage({ id: Strings.party_tab_settings }),
					},
				].filter(t => t.text?.length > 0)}
			/>

			<PartyPageSwitch tab={tab} />
		</>
	);
};

interface IPartyPageSwitchProps {
	tab: number;
}

const PartyPageSwitch: React.FunctionComponent<IPartyPageSwitchProps> = ({ tab }) => {
	switch (tab) {
		case 0:
			return <PartyPageInventory />;
		case 1:
			return <PartyPageCharacters />;
		case 2:
			return <PartyPageMagic />;
		case 3:
			return <PartyPageSettings />;
		case 4:
			return <PartyPageGuests />;
		default:
			return null;
	}
};

const PartyPageInventory: React.FunctionComponent = () => {
	const intl = useIntl();
	const { armor, items, weapons } = usePartyInventorySpells();

	return (
		<UlGrid columns={1}>
			<li>
				<PlayerInventory
					actions={["use"]}
					title={intl.formatMessage({ id: Strings.items })}
					items={items}
					sectionHeaderNodeRight={<PlayerCurrencyList />}
				/>
			</li>
			<li>
				<PlayerInventory title={intl.formatMessage({ id: Strings.weapons })} items={weapons} />
			</li>
			<li>
				<PlayerInventory title={intl.formatMessage({ id: Strings.armor })} items={armor} />
			</li>
		</UlGrid>
	);
};

const PartyPageCharacters: React.FunctionComponent = () => {
	const characters = useSelector((state: AppState) => state.site.userDataReadOnly.party.characters).filter(
		c => c.available
	);

	return (
		<UlGrid columns={4}>
			{characters.map((character, index) => (
				<li key={index}>
					<PartyCharacter id={character.id} showEquipment showStats />
				</li>
			))}
		</UlGrid>
	);
};

const PartyPageGuests: React.FunctionComponent = () => {
	const guests = useSelector((state: AppState) => state.site.userDataPlayer.party.guests);

	return (
		<UlGrid columns={4}>
			{guests.map((guest, index) => (
				<li key={index}>
					<PartyGuest id={guest} />
				</li>
			))}
		</UlGrid>
	);
};

const PartyPageMagic: React.FunctionComponent = () => {
	const intl = useIntl();
	const { spells } = usePartyInventorySpells();

	return <PlayerInventory title={intl.formatMessage({ id: Strings.spells })} items={spells} />;
};

const PartyPageSettings: React.FunctionComponent = () => {
	const intl = useIntl();
	const { data, error, hasLoaded, isLoading, onChange, onSubmit, hasSaved } = usePartySettings();

	if (isLoading && !hasLoaded) {
		return <Loading />;
	}

	return (
		<Section title={intl.formatMessage({ id: Strings.account })}>
			<Errors error={error} />
			<WSForm onSubmit={onSubmit} className="flex items-end gap-4">
				<WSTextField
					value={data.displayName}
					label={intl.formatMessage({ id: Strings.your_name })}
					onChange={onChange}
					name="displayName"
					id="displayName"
					width={20}
					minLength={3}
					maxLength={25}
				/>
				<UlConfirmButtons>
					<WSButton
						type="submit"
						onClick={onSubmit}
						disabled={isLoading}
						isLoading={isLoading}
						className="block w-full">
						<FormattedMessage id={Strings.save} />
					</WSButton>
					{hasSaved && <WSIcon size={24} icon={"Checkmark"} className="text-green-800" />}
				</UlConfirmButtons>
			</WSForm>
		</Section>
	);
};
