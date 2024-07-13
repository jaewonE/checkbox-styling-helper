import { Plugin, MarkdownView, PluginSettingTab, Setting } from "obsidian";
import { createIconPicker } from "iconPicker";
import { Icon_Item_Setting, icons_setting } from "default_icons";

interface IconCheckboxPluginSettings {
	theme: string;
	icons: Icon_Item_Setting[];
}

const DEFAULT_SETTINGS: IconCheckboxPluginSettings = {
	theme: "Else",
	icons: icons_setting["Else"],
};

export default class IconCheckboxPlugin extends Plugin {
	settings: IconCheckboxPluginSettings;

	async onload() {
		console.log("Loading IconCheckboxPlugin");

		await this.loadSettings();

		this.addSettingTab(new IconCheckboxSettingTab(this.app, this));

		this.registerEvent(
			this.app.workspace.on("editor-change", this.handleEditorChange)
		);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	LeadingSpaces(str: string): string {
		const match = str.match(/^\s+/);
		return match ? match[0] : "";
	}

	handleEditorChange = () => {
		const editor =
			this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
		if (!editor) return;

		const cursor = editor.getCursor();
		const line = cursor?.line;
		if (line === undefined) return;

		const lineText = editor.getLine(line);
		const trimedLineText = lineText.trimStart();
		if (
			trimedLineText === "-:" ||
			trimedLineText === "- :" ||
			trimedLineText === "- [ ] :"
		) {
			createIconPicker(
				editor,
				this.settings.theme,
				this.settings.icons,
				line,
				lineText.length,
				this.LeadingSpaces(lineText)
			);
		}
	};

	onunload() {
		console.log("Unloading IconCheckboxPlugin");
	}
}

class IconCheckboxSettingTab extends PluginSettingTab {
	plugin: IconCheckboxPlugin;

	constructor(app: any, plugin: IconCheckboxPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Select Theme")
			.setDesc(
				"Choose the available icons and order according to your theme!"
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOption("Else", "Else")
					.addOption("Minimal", "Minimal")
					.addOption("Things", "Things")
					.setValue(this.plugin.settings.theme)
					.onChange(async (value) => {
						const userConfirmed = confirm(
							"If you change themes, the icon order in your current theme will be reset to default. Are you sure you want to change it?"
						);
						if (userConfirmed) {
							this.plugin.settings.theme = value;
							this.plugin.settings.icons = icons_setting[value];
							await this.plugin.saveSettings();
							renderIcons();
						} else {
							dropdown.setValue(this.plugin.settings.theme);
						}
					})
			);

		// Create icon grid container
		const iconGrid = containerEl.createDiv({ cls: "setting-icon-grid" });

		const renderIcons = () => {
			iconGrid.empty();
			this.plugin.settings.icons.forEach(({ name, icon }, index) => {
				const iconEl = document.createElement("div");
				iconEl.className = "setting-icon-option";
				iconEl.setAttribute("draggable", "true");
				iconEl.setAttribute("data-index", index.toString());

				const iconSpan = document.createElement("span");
				iconSpan.className = "icon";
				iconSpan.textContent = icon;

				const nameSpan = document.createElement("span");
				nameSpan.textContent = name;

				iconEl.appendChild(iconSpan);
				iconEl.appendChild(nameSpan);

				iconEl.tabIndex = 0; // Make the div focusable

				iconEl.addEventListener("dragstart", handleDragStart);
				iconEl.addEventListener("dragover", handleDragOver);
				iconEl.addEventListener("drop", handleDrop);
				iconEl.addEventListener("dragleave", handleDragLeave);

				iconGrid.appendChild(iconEl);
			});
		};

		let draggedItem: HTMLElement | null = null;

		const handleDragStart = (e: DragEvent) => {
			draggedItem = e.target as HTMLElement;
			if (e.dataTransfer) {
				e.dataTransfer.effectAllowed = "move";
				e.dataTransfer.setData(
					"text/plain",
					(e.target as HTMLElement).dataset.index!
				);
			}
		};

		const handleDragOver = (e: DragEvent) => {
			if (e.preventDefault) {
				e.preventDefault();
			}
			(e.target as HTMLElement).classList.add("hovered");
			return false;
		};

		const handleDrop = (e: DragEvent) => {
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			if (draggedItem && draggedItem !== e.target) {
				const draggedIndex = parseInt(
					draggedItem.getAttribute("data-index")!
				);
				const targetIndex = parseInt(
					(e.target as HTMLElement)
						.closest(".setting-icon-option")!
						.getAttribute("data-index")!
				);
				const newOrder = Array.from(this.plugin.settings.icons);
				[newOrder[draggedIndex], newOrder[targetIndex]] = [
					newOrder[targetIndex],
					newOrder[draggedIndex],
				];
				this.plugin.settings.icons = newOrder;
				this.plugin.saveSettings();
				renderIcons();
			}
			(e.target as HTMLElement).classList.remove("hovered");
			return false;
		};

		const handleDragLeave = (e: DragEvent) => {
			(e.target as HTMLElement).classList.remove("hovered");
		};

		renderIcons();
	}
}
