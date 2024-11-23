import { is } from "../shared/is";

let isInitialized = false;
let siteConsent: WcpConsent.SiteConsent;
let enableAnalyticsCallback: () => void;
let disableAnalyticsCallback: () => void;

// Initialize cookies
function init(callbackEnable: () => void, callbackDisable: () => void) {
	enableAnalyticsCallback = callbackEnable;
	disableAnalyticsCallback = callbackDisable;

	if (is.null(window.WcpConsent)) {
		return;
	}

	if (isInitialized) {
		return;
	}
	isInitialized = true;

	window.WcpConsent.init(
		"en-US",
		"cookie-banner",
		(error, _siteConsent) => {
			if (error) {
				console.error(error);
				return;
			} else {
				siteConsent = _siteConsent!;
			}

			onConsentChanged();
		},
		onConsentChanged
	);
}

function areAnalyticsAllowed(): boolean {
	return siteConsent.getConsentFor(window.WcpConsent.consentCategories.Analytics);
}

// callback method when consent is changed by user
function onConsentChanged() {
	if (areAnalyticsAllowed()) {
		if (!is.null(enableAnalyticsCallback)) {
			enableAnalyticsCallback();
		}
	} else {
		if (!is.null(disableAnalyticsCallback)) {
			disableAnalyticsCallback();
		}
	}
}

function onManageConsent() {
	siteConsent.manageConsent();
}

// Test if the cookie consent library has been loaded.
function isAvailable(): boolean {
	return typeof siteConsent !== "undefined";
}

function isConsentRequired(): boolean {
	return isAvailable() && siteConsent.isConsentRequired;
}

export const cookie = {
	init,
	isAvailable,
	onManageConsent,
	isConsentRequired,
};
