import React, { useState } from 'react';

const ThemeToggleButton = () => {
	const [theme, setTheme] = useState('light');

	const toggleTheme = () => {
		let newTheme;
		if (theme === 'light') {
			newTheme = 'dark';
		} else {
			newTheme = 'light';
		}
		setTheme(newTheme);
		document.body.setAttribute('data-bs-theme', newTheme);
	};

	const themeIcon = theme === 'dark' ? (
		<i className="ti ti-moon"></i>
	) : (
		<i className="ti ti-sun"></i>
	);

	return (
		<li className="pc-h-item __web-inspector-hide-shortcut__">
			<a
				className="pc-head-link dropdown-toggle arrow-none me-0"
				data-bs-toggle="dropdown"
				href="#"
				role="button"
				aria-haspopup="false"
				aria-expanded="false"
				onClick={toggleTheme}
			>
				{themeIcon}
			</a>
		</li>
	);
};

export default ThemeToggleButton;