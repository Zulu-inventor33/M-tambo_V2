import React from 'react';
import './HeroSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faSearch,
	faTachometer,
	faCaretDown,
	faCog
} from '@fortawesome/free-solid-svg-icons';

const HeroSection = () => {
	return (
		<main className="main_body_container">
			{/* The hero section */}
			<div className="hero_section_container">
				<div aria-hidden="true" className="hero_section_wrapper">
					<div className="hero_section_wrapper2"></div>
				</div>
				<div class="hero_section_content">
					{/* hero title subtitle section */}
					<h1 class="hero_section_title">Transform, Streamline and Optimize.</h1>
					<p class="hero_section_subtitle">
						Empower your team with smarter, more efficient maintenance solutions with M-tambo.
					</p>
					{/* hero search section */}
					<div className="hero_search_section">
						<button className="search_btn">
							<FontAwesomeIcon icon={faSearch} />
							Search
						</button>
						<button className="search_btn_dashboard">
							<FontAwesomeIcon icon={faTachometer} />
							Dashboard
						</button>
					</div>
				</div>
			</div>
		</main>
	);
};

export default HeroSection;
