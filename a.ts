import { Editor } from "obsidian";

export function createIconPicker(
	editor: Editor,
	lineNumber: number,
	lineLength: number
) {
	const pickerEl = document.createElement("div");
	pickerEl.className = "icon-picker";

	const icons = [
		{ name: "Good", icon: "👍", value: "- [p] " },
		{ name: "Bad", icon: "👎", value: "- [c] " },
		// Add more icons here
	];

	let selectedIndex = 0;

	icons.forEach(({ name, icon, value }, index) => {
		const iconEl = document.createElement("div");
		iconEl.className = "icon-option";
		iconEl.innerText = `${icon} ${name}`;
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
			value,
			{ line: lineNumber, ch: 0 },
			{ line: lineNumber, ch: lineLength }
		);
		document.body.removeChild(pickerEl);

		// Move the cursor to the end of the inserted text
		editor.setCursor(lineNumber, value.length);
		editor.focus();
	};

	// @ts-ignore
	const cursorCoords = editor.cm.coordsAtPos(
		editor.posToOffset(editor.getCursor())
	); // {left: 87.64, right: 87.64, top: 593.31, bottom: 611.57}

	pickerEl.style.position = "absolute";
	pickerEl.style.left = `${cursorCoords.left}px`;
	pickerEl.style.top = `${cursorCoords.top + 20}px`; // Adjust the offset as needed
	pickerEl.style.backgroundColor = "white";
	pickerEl.style.border = "1px solid #ccc";
	pickerEl.style.borderRadius = "5px";
	pickerEl.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
	pickerEl.style.padding = "16px";
	pickerEl.style.zIndex = "1000"; // Ensure it appears above other content

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
		}
	};

	setTimeout(() => {
		document.addEventListener("click", handleClickOutside);
	}, 0);
}
