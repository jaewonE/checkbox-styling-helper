import { Editor, MarkdownView } from "obsidian";
import { icons_Things, icons_ect } from "icons";

export function createIconPicker(
	editor: Editor,
	isThings: boolean,
	lineNumber: number,
	lineLength: number,
	leadingSpaces: string
) {
	const pickerEl = document.createElement("div");
	pickerEl.className = "icon-picker";

	// icons = [{ name: string, icon: string, value: string }]
	const icons = isThings ? icons_Things : icons_ect;

	let selectedIndex = 0;
	const numColumns = 4; // Number of columns for the grid

	icons.forEach(({ name, icon, value }, index) => {
		const iconEl = document.createElement("div");
		iconEl.className = "icon-option";

		const iconSpan = document.createElement("span");
		iconSpan.className = "icon";
		iconSpan.textContent = icon;

		const nameSpan = document.createElement("span");
		nameSpan.textContent = name;

		iconEl.appendChild(iconSpan);
		iconEl.appendChild(nameSpan);

		iconEl.tabIndex = 0; // Make the div focusable
		iconEl.onclick = () => {
			selectIcon(value);
		};

		if (index === 0) {
			iconEl.classList.add("selected"); // Highlight the first option
		}

		pickerEl.appendChild(iconEl);
	});

	const selectIcon = (value: string) => {
		editor.replaceRange(
			`${leadingSpaces}${value}`,
			{ line: lineNumber, ch: 0 },
			{ line: lineNumber, ch: lineLength }
		);
		closePicker();

		// Move the cursor to the end of the inserted text
		setTimeout(() => {
			editor.setCursor(lineNumber, value.length + leadingSpaces.length);
			editor.focus();
		}, 0);
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		event.preventDefault();
		event.stopPropagation();
		const options = pickerEl.getElementsByClassName("icon-option");

		if (event.key === "ArrowDown") {
			options[selectedIndex].classList.remove("selected");
			selectedIndex = (selectedIndex + numColumns) % icons.length;
			options[selectedIndex].classList.add("selected");
		} else if (event.key === "ArrowUp") {
			options[selectedIndex].classList.remove("selected");
			selectedIndex =
				(selectedIndex - numColumns + icons.length) % icons.length;
			options[selectedIndex].classList.add("selected");
		} else if (event.key === "ArrowRight") {
			options[selectedIndex].classList.remove("selected");
			selectedIndex = (selectedIndex + 1) % icons.length;
			options[selectedIndex].classList.add("selected");
		} else if (event.key === "ArrowLeft") {
			options[selectedIndex].classList.remove("selected");
			selectedIndex = (selectedIndex - 1 + icons.length) % icons.length;
			options[selectedIndex].classList.add("selected");
		} else if (event.key === " ") {
			// Space
			selectIcon(icons[selectedIndex].value);
		} else if (event.key === "Escape") {
			event.preventDefault();
			closePicker();
		} else {
			return;
		}
	};

	this.app.workspace
		.getActiveViewOfType(MarkdownView)
		?.registerDomEvent(document, "keydown", handleKeyDown);

	// @ts-ignore
	const cursorCoords = editor.cm.coordsAtPos(
		editor.posToOffset(editor.getCursor())
	);

	pickerEl.style.left = `${cursorCoords.left}px`;
	pickerEl.style.top = `${cursorCoords.top + 20}px`; // Adjust the offset as needed

	document.body.appendChild(pickerEl);

	const handleClickOutside = (event: MouseEvent) => {
		if (!pickerEl.contains(event.target as Node)) {
			closePicker();
		}
	};

	const closePicker = () => {
		if (pickerEl.parentNode) {
			document.body.removeChild(pickerEl);
			document.removeEventListener("click", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		}
	};

	setTimeout(() => {
		document.addEventListener("click", handleClickOutside);
	}, 0);
}
