/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Markdown from "react-markdown";
import { useSelector } from "react-redux";
import { useNews } from "../hooks/use-news";
import { AppState } from "../redux/reducer";
import { is } from "../shared/is";
import Strings from "../strings";
import { Errors, Warning } from "./errors";
import { Loading } from "./loading";
import { WSPopup, WSPopupContent } from "./popups";
import { H2Left, UlGrid } from "./tailwind";

interface IProps {
	isVisible: boolean;
	onDismiss: () => void;
}

export const TitleNewsPopup: React.FunctionComponent<IProps> = ({ isVisible, onDismiss }) => {
	const intl = useIntl();

	return (
		<WSPopup
			isOpen={isVisible}
			isBlocking={false}
			onDismiss={onDismiss}
			title={intl.formatMessage({ id: Strings.nav_news })}>
			<WSPopupContent>
				<TitleNewsPopupContent />
			</WSPopupContent>
		</WSPopup>
	);
};

const TitleNewsPopupContent: React.FunctionComponent = () => {
	const { isLoading, error } = useNews();
	const news = useSelector((state: AppState) => state.site.news);

	if (isLoading) {
		return <Loading />;
	}

	if (is.null(news)) {
		return (
			<>
				<Errors error={error} />
				<Warning>
					<FormattedMessage id={Strings.no_news} />
				</Warning>
			</>
		);
	}

	return (
		<>
			<Errors error={error} />
			<UlGrid columns={1} className="p-4 pt-0">
				{news.map(article => (
					<li key={article.NewsId}>
						<div>
							<H2Left>{article.Title}</H2Left>
							<Markdown className="markdown">{article.Body}</Markdown>
						</div>
					</li>
				))}
			</UlGrid>
		</>
	);
};
