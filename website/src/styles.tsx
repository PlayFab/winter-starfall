/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ComponentsStyles, IModalStyles, PartialTheme, ThemeProvider, createTheme } from "@fluentui/react";
import React from "react";

const fluentTheme: PartialTheme = createTheme({
	palette: {
		themePrimary: "#147DC4",
	},
	components: {
		Modal: {
			styles: {
				main: {
					minWidth: "320px",
					maxWidth: "768px",
					borderRadius: "0.5rem",
					marginLeft: "1rem",
					marginRight: "1rem",
				},
			} as IModalStyles,
		},
	} as ComponentsStyles,
});

interface IThemedProps {
	children: React.ReactNode;
	className?: string;
}

export const Themed: React.FunctionComponent<IThemedProps> = ({ children, className }) => (
	<ThemeProvider theme={fluentTheme} className={className}>
		{children}
	</ThemeProvider>
);
