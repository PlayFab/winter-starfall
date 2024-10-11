/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { is } from "../shared/is";
import { ICinematicProgression, ILocation, ILocationArea, LocationAreaType } from "../shared/types";

export enum EditorContentType {
	None,
	Cinematics,
	Locations,
	Enemies,
	Scripts,
}

interface IResults {
	isLoading: boolean;
	content: any;
	contentType: EditorContentType;

	activeScriptId: string;
	availableScripts: string[];
	availableCinematicProgressions: string[];
	availableLocations: string[];
	availableAreas: string[];
	availableEnemyProgressions: string[];

	loadScript: (script: string) => void;
	loadContent: (contentType: EditorContentType) => void;
	onChange: (content: any) => void;
	onSave: () => void;
	onNewLocation: (script: string) => void;
	onCreateScript: (name: string) => void;
}

export function useEditor(): IResults {
	const [isLoading, setIsLoading] = useState(false);
	const [contentType, setContentType] = useState<EditorContentType>(EditorContentType.None);
	const [cinematicsJSON, setCinematicsJSON] = useState<any>(null);
	const [enemiesJSON, setEnemiesJSON] = useState<any>(null);
	const [locationsJSON, setLocationsJSON] = useState<any>(null);
	const [currentScript, setCurrentScript] = useState<any>(null);
	const [activeScriptId, setActiveScriptId] = useState("");
	const [availableScripts, setAvailableScripts] = useState<string[]>([]);

	useEffect(() => {
		setIsLoading(true);
		const fetchJSON = async (url: string) => {
			const response = await fetch(url);
			return response.json();
		};

		Promise.all([
			fetchJSON("/src/data/cinematics.json"),
			fetchJSON("/src/data/enemies.json"),
			fetchJSON("/src/data/locations.json"),
		])
			.then(([cinematics, enemies, locations]) => {
				setCinematicsJSON(cinematics);
				setEnemiesJSON(enemies);
				setLocationsJSON(locations);
			})
			.catch(error => console.error("Error fetching JSON data", error))
			.finally(() => setIsLoading(false));
	}, []);

	const loadContent = useCallback((contentType: EditorContentType) => {
		switch (contentType) {
			case EditorContentType.Cinematics:
				setContentType(EditorContentType.Cinematics);
				setActiveScriptId("");
				break;
			case EditorContentType.Locations:
				setContentType(EditorContentType.Locations);
				setActiveScriptId("");
				break;
			case EditorContentType.Enemies:
				setContentType(EditorContentType.Enemies);
				setActiveScriptId("");
				break;
			default:
				setContentType(EditorContentType.None);
				setActiveScriptId("");
				break;
		}
	}, []);

	const loadScript = useCallback(async (script: string) => {
		setIsLoading(true);
		setActiveScriptId(script);
		const response = await fetch(`/src/scripts/${script}.json`);
		setCurrentScript(await response.json());
		setContentType(EditorContentType.Scripts);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		if (is.null(locationsJSON) || !is.null(availableScripts)) {
			return;
		}

		const scriptSet = new Set<string>();

		(locationsJSON as any).locations.forEach((location: ILocation) => {
			if (is.null(location.areas)) {
				return;
			}

			return location.areas.filter(a => !is.null(a.script)).forEach(a => scriptSet.add(a.script!));
		});

		setAvailableScripts(Array.from(scriptSet));
	}, [availableScripts, locationsJSON]);

	const availableCinematicProgressions =
		(cinematicsJSON?.progressions as ICinematicProgression[])?.map(p => p.id) || [];

	const availableLocationsBase = (locationsJSON as any)?.locations.map((location: ILocation) => location.id);

	const availableAreas = useMemo(
		() =>
			is.null(locationsJSON) || is.null((locationsJSON as any)?.locations)
				? []
				: (((locationsJSON as any)?.locations as ILocation[] | undefined)
						?.map(location => location.areas.map((area: ILocationArea) => area.id))
						.flat() as string[]),
		[locationsJSON]
	);

	const availableLocations = useMemo(() => {
		if (is.null(locationsJSON)) {
			return [];
		}

		return availableLocationsBase.concat(availableAreas);
	}, [availableAreas, availableLocationsBase, locationsJSON]);

	const availableEnemyProgressions = (enemiesJSON?.progressions as ICinematicProgression[])?.map(p => p.id) || [];

	const content = useMemo(() => {
		switch (contentType) {
			case EditorContentType.Cinematics:
				return cinematicsJSON;
			case EditorContentType.Locations:
				return locationsJSON;
			case EditorContentType.Enemies:
				return enemiesJSON;
			case EditorContentType.Scripts:
				return currentScript;
			default:
				return null;
		}
	}, [cinematicsJSON, currentScript, contentType, enemiesJSON, locationsJSON]);

	const onChange = useCallback(
		(content: any) => {
			switch (contentType) {
				case EditorContentType.Cinematics:
					setCinematicsJSON(content);
					break;
				case EditorContentType.Locations:
					setLocationsJSON(content);
					break;
				case EditorContentType.Enemies:
					setEnemiesJSON(content);
					break;
				case EditorContentType.Scripts:
					setCurrentScript(content);
					break;
			}
		},
		[contentType]
	);

	const onNewLocation = useCallback(
		(script: string) => {
			console.log("Set locations JSON 3");
			setLocationsJSON({
				...locationsJSON,
				locations: locationsJSON.locations.concat([
					{
						id: "",
						name: "",
						description: "",
						descriptionHover: "",
						script: script,
						backLink: "",
						image: "",
						imageHover: "",
						layout: "areas",
						areas: [
							{
								id: "",
								name: "",
								description: "",
								script: script,
								image: "",
								descriptionHover: "",
								imageHover: "",
								type: LocationAreaType.Cinematic,
								cinematic: "",
								cinematicProgression: "",
								enemyGroup: "",
								enemyGroupProgression: "",
								postCombatArea: "",
								postCombatLocation: "",
								store: "",
							} as ILocationArea,
						],
					} as ILocation,
				]),
			});
		},
		[locationsJSON]
	);

	const saveData = useCallback(
		async (filename: string, content: any) => {
			try {
				const response = await fetch("http://localhost:5174/api/data", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						filename,
						content: JSON.stringify(content, null, 4),
						isScript: contentType === EditorContentType.Scripts,
					}),
				});
				if (response.ok) {
					console.log("Data saved successfully");
				} else {
					console.error("Failed to save data", response.statusText);
				}
			} catch (error) {
				console.error("Error submitting data:", error);
			}
		},
		[contentType]
	);

	const onSave = useCallback(() => {
		switch (contentType) {
			case EditorContentType.Cinematics:
				saveData("cinematics", cinematicsJSON);
				break;
			case EditorContentType.Locations:
				saveData("locations", locationsJSON);
				break;
			case EditorContentType.Enemies:
				saveData("enemies", enemiesJSON);
				break;
			case EditorContentType.Scripts:
				saveData(activeScriptId, currentScript);
				break;
		}
	}, [activeScriptId, cinematicsJSON, contentType, currentScript, enemiesJSON, locationsJSON, saveData]);

	const onCreateScript = useCallback(
		(name: string) => {
			setActiveScriptId(name);
			setCurrentScript([
				{
					id: `${name}-1`,
					events: [],
				},
			]);
			setContentType(EditorContentType.Scripts);
			setAvailableScripts([...availableScripts, name]);
		},
		[availableScripts]
	);

	return {
		isLoading,
		availableScripts,
		availableLocations,
		availableAreas,
		availableCinematicProgressions,
		availableEnemyProgressions,
		activeScriptId,
		content,
		contentType,
		loadContent,
		loadScript,
		onChange,
		onSave,
		onNewLocation,
		onCreateScript,
	};
}
