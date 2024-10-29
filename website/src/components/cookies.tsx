import { is } from "../shared/is";

let siteConsent: WcpConsent.SiteConsent;
let enableAnalyticsCallback: () => void;
let updateReduxStore: (isRequired: boolean) => void;

// Initialize cookies
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
window.WcpConsent &&
	WcpConsent.init(
		"en-US",
		"cookie-banner",
		(error, _siteConsent) => {
			if (error) {
				console.error(error);
			} else {
				siteConsent = _siteConsent!;

				if (!is.null(updateReduxStore)) {
					updateReduxStore(siteConsent.isConsentRequired);
				}
			}
		},
		onConsentChanged
	);

function acceptsThirdPartyAnalytics(): boolean {
	return siteConsent.getConsentFor(WcpConsent.consentCategories.Analytics);
}

// callback method when consent is changed by user
function onConsentChanged() {
	if (acceptsThirdPartyAnalytics() && !is.null(enableAnalyticsCallback)) {
		enableAnalyticsCallback();
	}

	if (!is.null(updateReduxStore)) {
		updateReduxStore(siteConsent.isConsentRequired);
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
function onCookieConsentChanged(callbackEnable: () => void): void {
	enableAnalyticsCallback = callbackEnable;
}

function setReduxStore(reduxFunction: (isRequired: boolean) => void): void {
	updateReduxStore = reduxFunction;

	if (isAvailable()) {
		updateReduxStore(siteConsent.isConsentRequired);
	}
}

export const cookie = {
	isAvailable,
	doesUserAcceptAnalytics,
	onConsentChanged: onCookieConsentChanged,
	manageConsent,
	setReduxStore,
};
