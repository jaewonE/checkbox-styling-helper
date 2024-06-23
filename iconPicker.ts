import { Editor, MarkdownView } from "obsidian";

export function createIconPicker(
	editor: Editor,
	isThings: boolean,
	lineNumber: number,
	lineLength: number,
	leadingSpaces: string
) {
	const pickerEl = document.createElement("div");
	pickerEl.className = "icon-picker";

	const icons_ect = [
		{ name: "Dropped", icon: "➖", value: "- [-] " },
		{ name: "Forward", icon: "➤", value: "- [>] " },
		{ name: "Date", icon: "📅", value: "- [D] " },
		{ name: "Question", icon: "❓", value: "- [?] " },
		{ name: "Half Done", icon: "◩", value: "- [/] " },
		{ name: "Add", icon: "➕", value: "- [+] " },
		{ name: "Research", icon: "🔎", value: "- [R] " },
		{ name: "Important", icon: "❗️", value: "- [!] " },
		{ name: "Idea", icon: "💡", value: "- [i] " },
		{ name: "Pro", icon: "👍", value: "- [P] " },
		{ name: "Con", icon: "👎", value: "- [C] " },
		{ name: "Quote", icon: '"', value: "- [Q] " },
		{ name: "Note", icon: "📝", value: "- [N] " },
		{ name: "Bookmark", icon: "🔖", value: "- [b] " },
		{ name: "Information", icon: "ℹ️", value: "- [I] " },
		{ name: "Paraphrase", icon: "⏩", value: "- [p] " },
		{ name: "Location", icon: "📍", value: "- [L] " },
		{ name: "Example", icon: "EX", value: "- [E] " },
		{ name: "Answer", icon: "✅", value: "- [A] " },
		{ name: "Reward", icon: "🏆", value: "- [r] " },
		{ name: "Choice", icon: "🪧", value: "- [c] " },
		{ name: "Doing", icon: "🔵", value: "- [d] " },
		{ name: "Time", icon: "⏱️", value: "- [T] " },
		{ name: "Person", icon: "👤", value: "- [@] " },
		{ name: "Talk", icon: "💬", value: "- [t] " },
		{ name: "Outline", icon: "📚", value: "- [O] " },
		{ name: "Conflict", icon: "⚔️", value: "- [~] " },
		{ name: "World", icon: "🪐", value: "- [W] " },
		{ name: "Clue / Find", icon: "🕵️‍♂️", value: "- [f] " },
		{ name: "Foreshadow", icon: "🐦‍⬛", value: "- [F] " },
		{ name: "Favorite", icon: "❤️", value: "- [H] " },
		{ name: "Symbolism", icon: "☯︎", value: "- [&] " },
		{ name: "Secret", icon: "🔒", value: "- [s] " },
		// Add more icons here
	];

	const icons_Things = [
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
		{ name: "Forwarded", icon: "⏭", value: "- [>] " },
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
