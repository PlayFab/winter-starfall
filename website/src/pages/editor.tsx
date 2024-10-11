/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { EditorSidebar } from "../components/editor/sidebar";
import { EditorPageContentSwitch } from "../components/editor/switch";
import { Page } from "../components/page";
import { DivPageWrapper, H1Left } from "../components/tailwind";
import { useEditor } from "../hooks/use-editor";
import { is } from "../shared/is";
import Strings from "../strings";

export const EditorPage: React.FunctionComponent = () => {
	const intl = useIntl();

	if (is.production()) {
		return null;
	}

	return (
		<Page
			title={intl.formatMessage({ id: Strings.editor })}
			isPlayFabIdRequired={false}
			isTitleIdRequired={false}
			shouldHaveTopPadding
			className="!max-w-editor">
			<EditorPageRunner />
		</Page>
	);
};
const EditorPageRunner: React.FunctionComponent = () => {
	const {
		activeScriptId,
		availableScripts,
		availableCinematicProgressions,
		availableLocations,
		availableAreas,
		content,
		isLoading,
		contentType,
		loadContent,
		loadScript,
		onChange,
		onSave,
		onNewLocation,
		onCreateScript,
	} = useEditor();

	return (
		<DivPageWrapper className="!max-w-editor">
			<H1Left className="border-b border-border">
				<FormattedMessage id={Strings.editor} />
			</H1Left>
			<div className="my-6 grid grid-cols-editor-ui gap-12">
				<EditorSidebar
					activeScriptId={activeScriptId}
					availableScripts={availableScripts}
					contentType={contentType}
					loadContent={loadContent}
					loadScript={loadScript}
					onCreateScript={onCreateScript}
				/>
				<div>
					<EditorPageContentSwitch
						activeScriptId={activeScriptId}
						availableAreas={availableAreas}
						availableCinematicProgressions={availableCinematicProgressions}
						availableLocations={availableLocations}
						availableScripts={availableScripts}
						content={content}
						contentType={contentType}
						isLoading={isLoading}
						onChange={onChange}
						onNewLocation={onNewLocation}
						onSave={onSave}
					/>
				</div>
			</div>
		</DivPageWrapper>
	);
};
