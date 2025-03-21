# Winter Starfall

This is an [Azure PlayFab](https://www.playfab.com) demo game showcasing Economy v2, Azure Functions, and more.

Play this game at [winterstarfall.com](https://www.winterstarfall.com/).

If you have a free PlayFab developer account, you can [view this title in Game Manager](https://developer.playfab.com/en-us/F8941/dashboard).

To use a Microsoft or Google account, play Winter Starfall at [winterstarfall-unofficial.com](https://www.winterstarfall-unofficial.com/).

# Website

## Prerequisites

-   [Node JS](https://nodejs.org) (v20 or higher)
-   [Visual Studio Code](https://code.visualstudio.com) (optional)

## Setup

1. Clone this repository
    ```bash
    git clone https://github.com/PlayFab/winter-starfall.git
    ```
1. In VS Code, select **File &gt; Open Folder**
1. Select the `/website` folder
1. Choose to install all recommended extensions
1. Select **Terminal &gt; New Terminal**
1. Run `npm install` to install all dependencies

## Running the site

1. In the `/website` folder, run `npm run dev` to start the site
1. Click on the link it offers (should be `localhost:5173`) to view the site

## Building the site

1. In the `/website` folder, run `npm run build` to build the site
1. The output will be in the `/website/dist` folder

# Azure functions

Azure Functions in C# are available in the `/azure-functions` folder. You can run these locally or [deploy the project to Azure](https://learn.microsoft.com/en-us/azure/azure-functions/functions-develop-vs-code).

# Social logins

This game allows players to sign in using Microsoft, Google, and Facebook accounts.

To enable these logins, you will need to create apps with each provider and set up the appropriate credentials in [PlayFab Game Manager](https://developer.playfab.com).

Then modify `website\src\main.tsx` with the appropriate client IDs.

-   **Microsoft:** [Single-page application: App registration](https://learn.microsoft.com/en-us/entra/identity-platform/scenario-spa-app-registration)
-   **Google:** [Integrating Google Sign-In into your web app](https://developers.google.com/identity/sign-in/web/sign-in)
-   **Facebook:** [Facebook Login for the Web with the JavaScript SDK](https://developers.facebook.com/docs/facebook-login/web)

# Contact

-   **Email:** <a href="mailto:jordan.roher@microsoft.com">Jordan Roher</a>
-   **Discord:** [PlayFab Community](https://discord.com/invite/msftgamedev)
