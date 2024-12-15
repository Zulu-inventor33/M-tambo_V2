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
          <h1 class="hero_section_title">Transform, Streamline, Optimize.</h1>
          <p class="hero_section_subtitle">
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
                    <div className="separator-bar"></div>
                    {/* input section */}
                    <input type="text" placeholder="Search for jobs, equipments, technicians..." autocomplete="off" value="" />
                    <button type="button" className="settings-btn">
                      <FontAwesomeIcon icon={faCog}/>
                    </button>
                    <button type="submit" className="search_btn">
                      <FontAwesomeIcon icon={faSearch}/>
                      <span className="search_label">Search</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* hero images card section */}
          <div class="hero_images_cards_section">
            <div class="images_cards_container">
              <div class="cards_container">
                <div class="inner-cards-container">
                  <div class="inner-cards-container2">
                    <div class="">
                      <ul class="cards-list-container">
                        <li>
                          <div class="card-container">
                              <a href="#" class="card">
                                <img alt="lifts Image" loading='lazy' class="card-img" src="/images/elevator.jpg"/>
                                <div class="card-text">
                                    <p role="heading" aria-level="4" class="card-heading">Comprehensive Lift Maintenance Support</p>
                                    <p class="card-subheading">Efficient elevator management with cutting-edge CMMS technology</p>
                                </div>
                              </a>
                          </div>
                        </li>
                        <li>
                          <div class="card-container">
                              <a href="#" class="card">
                                <img alt="technicia" loading="lazy" class="card-img" src="/images/technician.jpg"/>
                                <div class="card-text">
                                    <p role="heading" aria-level="4" class="card-heading">Task Management Dashboard</p>
                                    <p class="card-subheading">Manage tasks, track progress, and report easily.</p>
                                </div>
                              </a>
                          </div>
                        </li>
                        <li>
                          <div class="card-container">
                              <a href="#" class="card">
                                <img alt="dashboard" loading="lazy" class="card-img" src="/images/dashboard_img.jpg"/>
                                <div class="card-text">
                                    <p role="heading" aria-level="4" class="card-heading">Maintenance Company Dashboard</p>
                                    <p class="card-subheading">Streamline task management, tracking, and reporting.</p>
                                </div>
                              </a>
                          </div>
                        </li>
                        <li>
                          <div class="card-container">
                              <a href="#" class="card">
                                <img alt="repairing" loading="lazy" class="card-img" src="./images/repairing.jpg"/>
                                <div class="card-text">
                                    <p role="heading" aria-level="4" class="card-heading">Efficient Repair Management</p>
                                    <p class="card-subheading">Use our CMMS system to streamline and track repairs.</p>
                                </div>
                              </a>
                          </div>
                        </li>
                        <li>
                          <div class="card-container">
                              <a href="#" class="card">
                                <img alt="hvac" loading="lazy" class="card-img" src="/images/hvac.jpg"/>
                                <div class="card-text">
                                    <p role="heading" aria-level="4" class="card-heading">HVAC Maintenance Made Easy</p>
                                    <p class="card-subheading">Track, manage, and optimize HVAC systems with our CMMS.</p>
                                </div>
                              </a>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <button class="scroll-btn-container">
                      <span class="scroll-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-49 141 512 512" width="16" height="16" aria-hidden="true">
                            <path d="M262.145 397 98.822 560.323c-9.763 9.763-9.763 25.592 0 35.355s25.592 9.763 35.355 0l181-181c4.882-4.881 7.323-11.279 7.323-17.677s-2.441-12.796-7.322-17.678l-181-181c-9.764-9.763-25.592-9.763-35.355 0s-9.763 25.592 0 35.355z"></path>
                        </svg>
                      </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
          <div className="hero_section_content">
        </div>
      </div>
    </main>
  );
};

export default HeroSection;