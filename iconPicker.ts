import { Editor, MarkdownView } from "obsidian";

export function createIconPicker(
	editor: Editor,
	lineNumber: number,
	lineLength: number,
	leadingSpaces: string
) {
	const pickerEl = document.createElement("div");
	pickerEl.className = "icon-picker";

	const icons = [
		{ name: "Next step", icon: "↳", value: "- [n] " },
		{ name: "Next", icon: "→", value: "- [a] " },
		{ name: "Therefore", icon: "∴", value: "- [t] " },
		{ name: "Clip", icon: "📎", value: "- [r] " },
		{ name: "Good", icon: "👍", value: "- [p] " },
		{ name: "Bad", icon: "👎", value: "- [c] " },
		{ name: "Question", icon: "❓", value: "- [?] " },
		{ name: "Important", icon: "❗️", value: "- [!] " },
		{ name: "Bookmark", icon: "🔖", value: "- [b] " },
		{ name: "Star", icon: "⭐️", value: "- [*] " },
		{ name: "Fire", icon: "🔥", value: "- [f] " },
		{ name: "Up", icon: "📈", value: "- [u] " },
		{ name: "Down", icon: "📉", value: "- [d] " },
		{ name: "Forwarded", icon: "⏭️⏭", value: "- [>] " },
		{ name: "Scheduling", icon: "📅", value: "- [<] " },
		{ name: "Information", icon: "ℹ️", value: "- [i] " },
		{ name: "Location", icon: "📍", value: "- [l] " },
		{ name: "Quote", icon: '"', value: '- ["] ' },
		{ name: "Dollar", icon: "💲", value: "- [S] " },
		{ name: "Idea", icon: "💡", value: "- [I] " },
		{ name: "Key", icon: "🔑", value: "- [k] " },
		{ name: "Win", icon: "🎂", value: "- [w] " },
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

		if (index === selectedIndex) {
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
		try {
			editor.setCursor(lineNumber, value.length + 10);
			editor.focus();
		} catch (e) {
			return;
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		event.preventDefault();
		event.stopPropagation();
		const options = pickerEl.getElementsByClassName("icon-option");

		if (event.key === "ArrowDown") {
			options[selectedIndex].classList.remove("selected");
			selectedIndex = (selectedIndex + 1) % icons.length;
			options[selectedIndex].classList.add("selected");
		} else if (event.key === "ArrowUp") {
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
	// document.addEventListener("keydown", handleKeyDown);
	this.app.workspace
		.getActiveViewOfType(MarkdownView)
		?.registerDomEvent(document, "keydown", handleKeyDown);

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
			document.removeEventListener("keydown", handleKeyDown);
		}
	};

	setTimeout(() => {
		document.addEventListener("click", handleClickOutside);
	}, 0);
}
