/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IModalProps, Modal } from "@fluentui/react";
import React from "react";
import { useIntl } from "react-intl";
import { combineClassNames } from "../shared/helpers";
import { is } from "../shared/is";
import { IPropsChildrenClassName } from "../shared/types";
import Strings from "../strings";
import { Themed } from "../styles";
import { WSButton } from "./button";
import { WSIcon } from "./icon";
import { H1PopupTitle, HeaderPopup } from "./tailwind";

interface IWSPopupProps extends IModalProps {
	title?: string;
}

export const WSPopup: React.FunctionComponent<IWSPopupProps> = props => {
	const modalMinusChildren = { ...props };
	delete modalMinusChildren.children;

	return (
		<Themed>
			<Modal {...modalMinusChildren}>
				<div className="font-normal font-sans text-base text-black">
					{!is.null(props.title) && (
						<HeaderPopup>
							<H1PopupTitle>{props.title}</H1PopupTitle>
							{!is.null(props.onDismiss) && <WSPopupCloseButton onDismiss={props.onDismiss!} />}
						</HeaderPopup>
					)}
					{props.children}
				</div>
			</Modal>
		</Themed>
	);
};

export const WSPopupContent: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<div className={combineClassNames("bg-gray-50 p-4", className!)}>{children}</div>
);

export const WSPopupFooter: React.FunctionComponent<IPropsChildrenClassName> = ({ children, className }) => (
	<div className={combineClassNames("border-t border-solid border-gray-300 p-4", className!)}>{children}</div>
);

interface IWSPopupCloseProps {
	onDismiss: () => void;
}

export const WSPopupCloseButton: React.FunctionComponent<IWSPopupCloseProps> = ({ onDismiss }) => {
	const intl = useIntl();
	return (
		<WSButton
			style="icon"
			onClick={onDismiss}
			title={intl.formatMessage({ id: Strings.close })}
			aria-label={intl.formatMessage({ id: Strings.close })}>
			<WSIcon icon="Cancel" />
		</WSButton>
	);
};
