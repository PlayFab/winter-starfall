const publicFolder = "./public/";
const stringsFolder = publicFolder + "strings";
const playFabSDKFolder = "./node_modules/playfab-web-sdk/src/PlayFab/";
const appFolder = "./src";

const mainLanguage = "en-us";
const allLanguages = ["en-us"];

module.exports = function (grunt) {
	grunt.registerTask("default", () => {
		grunt.task.run("copyPlayFabSDK");
		grunt.task.run("createTypeScriptDefinition");
		grunt.task.run("populateOtherLanguages");
		grunt.task.run("copyFluentIcons");
	});

	grunt.registerTask("copyPlayFabSDK", () => {
		["PlayFabAdminApi.js", "PlayFabClientApi.js", "PlayFabEconomyApi.js", "PlayFabCloudScriptApi.js"].forEach(
			filename => {
				grunt.file.copy(playFabSDKFolder + filename, publicFolder + filename);
			}
		);
	});

	grunt.registerTask("copyFluentIcons", () => {
		grunt.file.copy("node_modules/@fluentui/font-icons-mdl2/fonts", publicFolder + "fluent-icons");
	});

	grunt.registerTask("createTypeScriptDefinition", () => {
		const stringsJSON = grunt.file.readJSON(`${stringsFolder}/strings.${mainLanguage}.json`);
		const keys = Object.keys(stringsJSON);

		// Write out a nice TypeScript file of enum definitions.
		let outputString = "/* This file is automatically generated by Grunt. Do not edit it directly. */\n";

		outputString += "enum Strings {\n";

		outputString += keys.reduce((existingString, stringName) => {
			return `${existingString}	${stringName} = "${stringName}",\n`;
		}, "");

		outputString += "}\n\n";
		outputString += "export default Strings;\n";

		grunt.file.write(`${appFolder}/strings.ts`, outputString);
	});

	grunt.registerTask("populateOtherLanguages", () => {
		const stringsJSON = grunt.file.readJSON(`${stringsFolder}/strings.${mainLanguage}.json`);
		const keys = Object.keys(stringsJSON);

		allLanguages
			.filter(language => language !== mainLanguage)
			.forEach(language => {
				// Attempt to read a file for this language
				let localStringsJSON = null;
				try {
					localStringsJSON = grunt.file.readJSON(`${stringsFolder}/strings.${language}.json`);
				} catch (e) {
					// If the file doesn't exist, create it
					localStringsJSON = {};
				}

				// Add any missing keys
				keys.forEach(key => {
					if (!localStringsJSON[key]) {
						localStringsJSON[key] = stringsJSON[key];
					}
				});

				// Write the file back out
				grunt.file.write(
					`${stringsFolder}/strings.${language}.json`,
					JSON.stringify(localStringsJSON, null, "\t")
				);
			});
	});
};
