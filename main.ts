import { Plugin, MarkdownView, PluginSettingTab, Setting } from "obsidian";
import { createIconPicker } from "iconPicker";

interface IconCheckboxPluginSettings {
	isThings: boolean;
}

const DEFAULT_SETTINGS: IconCheckboxPluginSettings = {
	isThings: false,
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
			console.log("Create Icon Picker");
			createIconPicker(
				editor,
				this.settings.isThings,
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

		containerEl.createEl("h2", { text: "Icon Checkbox Plugin Settings" });

		new Setting(containerEl)
			.setName("Enable Things Theme")
			.setDesc("Enable this if you are using the Things theme")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.isThings)
					.onChange(async (value) => {
						this.plugin.settings.isThings = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
