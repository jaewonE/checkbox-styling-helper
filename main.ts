import { Plugin, MarkdownView } from "obsidian";
import { createIconPicker } from "iconPicker";

export default class IconCheckboxPlugin extends Plugin {
	async onload() {
		console.log("Loading IconCheckboxPlugin");

		this.registerEvent(
			this.app.workspace.on("editor-change", this.handleEditorChange)
		);
	}

	handleEditorChange = () => {
		const editor =
			this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
		if (!editor) return;

		const cursor = editor.getCursor();
		const line = cursor?.line;
		if (line === undefined) return;

		const lineText = editor.getLine(line);
		const trimedLineText = lineText.trim();
		if (
			trimedLineText === "-:" ||
			trimedLineText === "- :" ||
			trimedLineText === "- [ ] :"
		) {
			createIconPicker(editor, line, lineText.length);
		}
	};

	onunload() {
		console.log("Unloading IconCheckboxPlugin");
	}
}
