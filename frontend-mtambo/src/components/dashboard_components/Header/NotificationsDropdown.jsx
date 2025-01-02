import React from 'react';

const NotificationsDropdown = () => {
  return (
    <li className="dropdown pc-h-item __web-inspector-hide-shortcut__">
      <a 
        className="pc-head-link dropdown-toggle arrow-none me-0" 
        data-bs-toggle="dropdown" 
        href="#" 
        role="button" 
        aria-haspopup="false" 
        aria-expanded="false"
      >
        <i className="ti ti-bell"></i>
        <span className="badge bg-success pc-h-badge">3</span>
      </a>
      <div className="dropdown-menu dropdown-notification dropdown-menu-end pc-h-dropdown">
        <div className="dropdown-header d-flex align-items-center justify-content-between">
          <h5 className="m-0">Notification</h5>
          <a href="#!" className="pc-head-link bg-transparent">
            <i className="ti ti-circle-check text-success"></i>
          </a>
        </div>
        <div className="dropdown-divider"></div>
        <div 
          className="dropdown-header px-0 text-wrap header-notification-scroll position-relative" 
          style={{ maxHeight: 'calc(100vh - 215px)' }} 
          data-simplebar="init"
        >
          <div className="simplebar-wrapper" style={{ margin: '-16px 0px' }}>
            <div className="simplebar-height-auto-observer-wrapper">
              <div className="simplebar-height-auto-observer"></div>
            </div>
            <div className="simplebar-mask">
              <div className="simplebar-offset" style={{ right: '0px', bottom: '0px' }}>
                <div 
                  className="simplebar-content-wrapper" 
                  tabIndex="0" 
                  role="region" 
                  aria-label="scrollable content"
                  style={{ height: 'auto', overflow: 'hidden' }}
                >
                  <div className="simplebar-content" style={{ padding: '16px 0px' }}>
                    <div className="list-group list-group-flush w-100">
                      {/* Notification 1 */}
                      <a className="list-group-item list-group-item-action">
                        <div className="d-flex">
                          <div className="flex-shrink-0">
                            <div className="user-avtar bg-light-success">
                              <i className="ti ti-gift"></i>
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-1">
                            <span className="float-end text-muted">3:00 AM</span>
                            <p className="text-body mb-1">It's <b>Cristina danny's</b> birthday today.</p>
                            <span className="text-muted">2 min ago</span>
                          </div>
                        </div>
                      </a>
                      {/* Notification 2 */}
                      <a className="list-group-item list-group-item-action">
                        <div className="d-flex">
                          <div className="flex-shrink-0">
                            <div className="user-avtar bg-light-primary">
                              <i className="ti ti-message-circle"></i>
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-1">
                            <span className="float-end text-muted">6:00 PM</span>
                            <p className="text-body mb-1"><b>Aida Burg</b> commented your post.</p>
                            <span className="text-muted">5 August</span>
                          </div>
                        </div>
                      </a>
                      {/* Notification 3 */}
                      <a className="list-group-item list-group-item-action">
                        <div className="d-flex">
                          <div className="flex-shrink-0">
                            <div className="user-avtar bg-light-danger">
                              <i className="ti ti-settings"></i>
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-1">
                            <span className="float-end text-muted">2:45 PM</span>
                            <p className="text-body mb-1">Your Profile is Complete &nbsp;<b>60%</b></p>
                            <span className="text-muted">7 hours ago</span>
                          </div>
                        </div>
                      </a>
                      {/* Notification 4 */}
                      <a className="list-group-item list-group-item-action">
                        <div className="d-flex">
                          <div className="flex-shrink-0">
                            <div className="user-avtar bg-light-primary">
                              <i className="ti ti-headset"></i>
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-1">
                            <span className="float-end text-muted">9:10 PM</span>
                            <p className="text-body mb-1"><b>Cristina Danny </b> invited to join <b> Meeting.</b></p>
                            <span className="text-muted">Daily scrum meeting time</span>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="simplebar-placeholder" style={{ width: '0px', height: '0px' }}></div>
          </div>
          <div className="simplebar-track simplebar-horizontal" style={{ visibility: 'hidden' }}>
            <div className="simplebar-scrollbar" style={{ width: '0px', display: 'none' }}></div>
          </div>
          <div className="simplebar-track simplebar-vertical" style={{ visibility: 'hidden' }}>
            <div className="simplebar-scrollbar" style={{ height: '0px', display: 'none' }}></div>
          </div>
        </div>
        <div className="dropdown-divider"></div>
        <div className="text-center py-2">
          <a href="#!" className="link-primary">View all</a>
        </div>
      </div>
    </li>
  );
};

export default NotificationsDropdown;