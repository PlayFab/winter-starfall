// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import {
	ApplicationInsights,
	IConfiguration,
	IEventTelemetry,
	IMetricTelemetry,
	IPageViewTelemetry,
	ITraceTelemetry,
} from "@microsoft/applicationinsights-web";
import { createBrowserHistory } from "history";
const reactPlugin = new ReactPlugin();
const browserHistory = createBrowserHistory();

// ***********************************************************************************************************
// NPM Initialization
// Use this section to initialize Application Insights with NPM

// Cache the previously initialized instance to avoid creating multiple instances
let _appInsights: ApplicationInsights | null;

export function initApplicationInsights() {
	console.log("Starting app insights");
	const config: IConfiguration = {
		extensions: [reactPlugin],
		extensionConfig: {
			[reactPlugin.identifier]: { history: browserHistory },
		},
	};

	if (!_appInsights) {
		if (!config.instrumentationKey || !config.connectionString) {
			config.connectionString =
				"InstrumentationKey=92ee4b99-bd8e-4bec-b609-9733da727512;IngestionEndpoint=https://westus-0.in.applicationinsights.azure.com/;LiveEndpoint=https://westus.livediagnostics.monitor.azure.com/;ApplicationId=ecba56ad-6fd2-4a95-8d3e-5c8ec4250ea6";
		}

		_appInsights = new ApplicationInsights({
			config: config,
		});

		_appInsights.loadAppInsights();
		_appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview

		return _appInsights;
	}

	return _appInsights;
}
// **************************************************************************************************************

/**
 * Unload the SDK if it has been initialized
 * @returns
 */
export function unloadApplicationInsights() {
	if (_appInsights) {
		_appInsights.unload();
		_appInsights = null;
		return true;
	}
	return false;
}

/**
 * Request a page view request if the SDK has been initialized
 */
export function trackPageView(pageView?: IPageViewTelemetry) {
	if (_appInsights) {
		_appInsights.trackPageView(pageView);
		return true;
	}
	return false;
}

/**
 * Log a custom event if the SDK has been initialized
 */
export function trackEvent(event: IEventTelemetry, customProperties?: { [key: string]: any }) {
	if (_appInsights) {
		_appInsights.trackEvent(event, customProperties);
		return true;
	}
	return false;
}

/**
 * Start timing an event with given name if the SDK has been initialized
 */
export function startTrackEvent(name?: string) {
	if (_appInsights) {
		_appInsights.startTrackEvent(name);
		return true;
	}
	return false;
}

/**
 * Stop timing an event with given name if the SDK has been initialized
 */
export function stopTrackEvent(
	name: string,
	properties?: { [key: string]: string },
	measurements?: { [key: string]: number }
) {
	if (_appInsights) {
		_appInsights.stopTrackEvent(name, properties, measurements);
		return true;
	}
	return false;
}

/**
 * Log traces if the SDK has been initialized
 * Typically used to send regular reports of performance indicators
 */
export function trackTrace(trace: ITraceTelemetry) {
	if (_appInsights) {
		_appInsights.trackTrace(trace);
		return true;
	}
	return false;
}

/**
 * Log Metric if the SDK has been initialized
 */
export function trackMetric(metric: IMetricTelemetry, customProperties?: { [name: string]: any }) {
	if (_appInsights) {
		_appInsights.trackMetric(metric, customProperties);
		return true;
	}
	return false;
}

/**
 * Adds a telemetry initializer to the collection if the SDK has been initialized
 * Telemetry initializers will be called before the telemetry item is pushed for sending
 */
export function addTelemetryInitializer(telemetryInitializer: (item: any) => boolean | void) {
	if (_appInsights) {
		_appInsights.addTelemetryInitializer(telemetryInitializer);
		return true;
	}
	return false;
}

/**
 * Use getCookieMgr to get cookie details if the SDK has been initialized
 * cookieMgr can be used to del, get, purge, set cookies
 */
export function getCookieMgr() {
	if (_appInsights) {
		return _appInsights.getCookieMgr();
	}
	return null;
}
