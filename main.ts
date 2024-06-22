import { Plugin, MarkdownView } from "obsidian";
import { createIconPicker } from "iconPicker";

export default class IconCheckboxPlugin extends Plugin {
	async onload() {
		console.log("Loading IconCheckboxPlugin");

		this.registerEvent(
			this.app.workspace.on("editor-change", this.handleEditorChange)
		);
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
