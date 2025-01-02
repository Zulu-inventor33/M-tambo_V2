import React from 'react';

import MobileMenuBlock from './MobileMenuBlock';
import MessagesDropdownSection from './MessagesDropdownSection';
import UserProfileDropdownSection from './UserProfileDropdownSection';
import FullscreenToggleButton from './FullscreenToggleButton';
import NotificationsDropdown from './NotificationsDropdown';

const TopBar = () => {
	return (
		<header className="pc-header">
			<div className="header-wrapper">
				{/* [Mobile Media Block] start */}
				<MobileMenuBlock />
				{/* [Mobile Media Block end] */}

				<div className="ms-auto">
					<ul className="list-unstyled">
						{/* Notifications section */}
						<NotificationsDropdown />
						{/* fullscreen button toggler */}
						<FullscreenToggleButton />
						{/* Messages section */}
						<MessagesDropdownSection />
						{/* user profile section */}
						<UserProfileDropdownSection />
					</ul>
				</div>
			</div>
		</header>
	);
};

export default TopBar;