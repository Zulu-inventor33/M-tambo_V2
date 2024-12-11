import React from 'react';
import './HeroSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTachometer, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const HeroSection = () => {
  return (
    <main className="main_body_container">
      {/* The hero section */}
      <div className="hero_section_container">
        <div aria-hidden="true" className="hero_section_wrapper">
          <div className="hero_section_wrapper2"></div>
        </div>
        <div className="hero_section_content">
          {/* hero title subtitle section */}
          <h1 className="hero_section_title">Transform, Streamline, Optimize.</h1>
          <p className="hero_section_subtitle">
            Empower your team with smarter, more efficient maintenance solutions with M-tambo.
          </p>
          {/* hero search section */}
          <div className="hero_search_section">
            <button className="search_btn">
              <FontAwesomeIcon icon={faSearch}/>
              Search
            </button>
            <button className="search_btn_dashboard">
              <FontAwesomeIcon icon={faTachometer}/>
              Dashboard
            </button>
          </div>
          {/* hero search input section */}
          <div className="search_input_container">
            <div className="input_seaction">
              <div className="width-full">
                <form className="form-container">
                  <div className="form-container2">
                    {/* assets dropdown section */}
                    <div className="assets-container">
                      <button type="button" className="button-container">
                        <FontAwesomeIcon icon={faCaretDown}/>
                        <span className="label">Assets</span>
                      </button>
                    </div>
                    {/* separator bar */}
                    <div className="separator_bar"></div>
                    {/* input section */}
                    <input type="text" placeholder="Search for jobs, equipments, technicians..." autocomplete="off" value="" />
                    <button type="button" className="settings_btn">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-49 141 512 512" width="16" height="16" aria-hidden="true">
                        <path d="M207 503c-58.448 0-106.393-47.945-106.393-106.393 0-58.448 47.945-106.393 106.393-106.393 58.448 0 106.393 47.945 106.393 106.393 0 58.448-47.945 106.393-106.393 106.393zm0-190.393c-46.149 0-83.18 37.03-83.18 83.18 0 46.149 37.03 83.18 83.18 83.18 46.149 0 83.18-37.03 83.18-83.18 0-46.149-37.03-83.18-83.18-83.18z"></path>
                      </svg>
                    </button>
                    <button type="submit" className="search_btn">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-49 141 512 512" width="16" height="16" aria-hidden="true">
                        <path d="M448.178 602.822 316.426 471.071c26.355-33.88 42.074-76.422 42.074-122.571 0-110.28-89.72-200-200-200s-200 89.72-200 200 89.72 200 200 200c46.149 0 88.691-15.719 122.571-42.074l131.751 131.751c4.882 4.882 11.28 7.323 17.678 7.323s12.796-2.441 17.678-7.322c9.762-9.763 9.762-25.593 0-35.356M8.5 348.5c0-82.71 67.29-150 150-150s150 67.29 150 150-67.29 150-150 150-150-67.29-150-150"></path>
                      </svg>
                      <span className="search_label">Search</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* hero images card section */}
        <div className="hero_images_cards_section">
          <div className="images_cards_container">
            <div className="cards_container">
              <ul className="cards_list_container">
                <li>
                  <div className="card_container">
                    <a href="#" className="card">
                      <img alt="Elevator Maintenance Image" loading="lazy" decoding="async" className="card_img" src="./images/elevator.jpg" />
                      <div className="card_text">
                        <p role="heading" aria-level="4" className="card_heading">Comprehensive Lift Maintenance Support</p>
                        <p className="card_subheading">Efficient elevator management with cutting-edge CMMS technology</p>
                      </div>
                    </a>
                  </div>
                </li>
                {/* More cards... */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;