import { is } from "../shared/is";

let siteConsent: WcpConsent.SiteConsent;
let enableAnalyticsCallback: () => void;
let disableAnalyticsCallback: () => void;

// Initialize cookies
function init() {
	if (is.null(window.WcpConsent)) {
		return;
	}

	window.WcpConsent.init(
		"en-US",
		"cookie-banner",
		(error, _siteConsent) => {
			if (error) {
				console.error(error);
			} else {
				siteConsent = _siteConsent!;
			}
		},
		onConsentChanged
	);
}

function acceptsThirdPartyAnalytics(): boolean {
	return siteConsent.getConsentFor(window.WcpConsent.consentCategories.Analytics);
}

// callback method when consent is changed by user
function onConsentChanged() {
	if (acceptsThirdPartyAnalytics()) {
		if (!is.null(enableAnalyticsCallback)) {
			enableAnalyticsCallback();
		}
	} else {
		if (!is.null(disableAnalyticsCallback)) {
			disableAnalyticsCallback();
		}
	}
}

function manageConsent() {
	siteConsent.manageConsent();
}

// Test if the cookie consent library has been loaded.
function isAvailable(): boolean {
	return typeof siteConsent !== "undefined";
}

// Test if we have been granted consent to use cookies.
function doesUserAcceptAnalytics(): boolean {
	// If we don't have the MSCC cookie JS code loaded we don't know if the user
	// has consented to cookies or not.
	if (!isAvailable()) {
		return false;
	}

	return acceptsThirdPartyAnalytics();
}

// Register the passed function to be called when we are granted consent to use cookies.
function onCookieConsentChanged(callbackEnable: () => void, callbackDisable: () => void): void {
	enableAnalyticsCallback = callbackEnable;
	disableAnalyticsCallback = callbackDisable;
}

function isConsentRequired(): boolean {
	return isAvailable() && siteConsent.isConsentRequired;
}

export const cookie = {
	init,
	isAvailable,
	doesUserAcceptAnalytics,
	onConsentChanged: onCookieConsentChanged,
	manageConsent,
	isConsentRequired,
};
