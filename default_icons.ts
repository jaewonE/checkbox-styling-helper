const icons_common = [
	{ name: "Default", icon: "•", value: "- " },
	{ name: "Unchecked", icon: "☐", value: "- [ ] " },
	{ name: "Incomplete", icon: "◩", value: "- [/] " },
	{ name: "Regular", icon: "☑️", value: "- [x] " },
	{ name: "Question", icon: "❓", value: "- [?] " },
	{ name: "Important", icon: "❗️", value: "- [!] " },
];

const icons_ect = [
	...icons_common,
	...[
		{ name: "Dropped", icon: "➖", value: "- [-] " },
		{ name: "Forward", icon: "➤", value: "- [>] " },
		{ name: "Date", icon: "📅", value: "- [D] " },
		{ name: "Add", icon: "➕", value: "- [+] " },
		{ name: "Research", icon: "🔎", value: "- [R] " },
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
	],
];

const icons_Things = [
	...icons_common,
	...[
		// { name: "Next step", icon: "↳", value: "- [n] " },
		// { name: "Next", icon: "→", value: "- [a] " },
		// { name: "Therefore", icon: "∴", value: "- [t] " },
		// { name: "Clip", icon: "📎", value: "- [r] " },
		{ name: "Good", icon: "👍", value: "- [p] " },
		{ name: "Bad", icon: "👎", value: "- [c] " },
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
	],
];

const icons_Minimal = [
	...icons_common,
	...[
		{ name: "Canceled", icon: "➖", value: "- [-] " },
		{ name: "Forwarded", icon: "➤", value: "- [>] " },
		{ name: "Scheduling", icon: "📅", value: "- [<] " },
		{ name: "star", icon: "⭐️", value: "- [*] " },
		{ name: "quote", icon: '"', value: '- ["] ' },
		{ name: "location", icon: "📍", value: "- [l] " },
		{ name: "bookmark", icon: "🔖", value: "- [b] " },
		{ name: "information", icon: "ℹ️", value: "- [i] " },
		{ name: "savings", icon: "💲", value: "- [S] " },
		{ name: "idea", icon: "💡", value: "- [I] " },
		{ name: "pros", icon: "👍", value: "- [p] " },
		{ name: "cons", icon: "👎", value: "- [c] " },
		{ name: "fire", icon: "🔥", value: "- [f] " },
		{ name: "key", icon: "🔑", value: "- [k] " },
		{ name: "win", icon: "🎂", value: "- [w] " },
		{ name: "up", icon: "📈", value: "- [u] " },
		{ name: "down", icon: "📉", value: "- [d] " },
	],
];

export interface Icon_Item_Setting {
	name: string;
	icon: string;
	value: string;
}

export interface Icon_Setting {
	[key: string]: Icon_Item_Setting[];
	Else: Icon_Item_Setting[];
	Things: Icon_Item_Setting[];
	Minimal: Icon_Item_Setting[];
}

export const icons_setting: Icon_Setting = {
	Else: icons_ect,
	Things: icons_Things,
	Minimal: icons_Minimal,
} as const;
