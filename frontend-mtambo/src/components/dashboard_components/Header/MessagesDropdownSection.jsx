import React from 'react';

const MessagesDropdownSection = () => {
	return (
		<li className="dropdown pc-h-item">
			<a className="pc-head-link dropdown-toggle arrow-none me-0" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
				<i className="ti ti-mail"></i>
			</a>
			<div className="dropdown-menu dropdown-notification dropdown-menu-end pc-h-dropdown">
				<div className="dropdown-header d-flex align-items-center justify-content-between">
					<h5 className="m-0">Message</h5>
					<a href="#!" className="pc-head-link bg-transparent"><i className="ti ti-x text-danger"></i></a>
				</div>
				<div className="dropdown-divider"></div>
				<div className="dropdown-header px-0 text-wrap header-notification-scroll position-relative" style={{ maxHeight: "calc(100vh - 215px)" }} data-simplebar="init">
					<div className="simplebar-wrapper" style={{ margin: "-16px 0px" }}>
						<div className="simplebar-mask">
							<div className="simplebar-offset" style={{ right: "0px", bottom: "0px" }}>
								<div className="simplebar-content-wrapper" tabIndex="0" role="region" aria-label="scrollable content" style={{ height: "auto", overflow: "hidden" }}>
									<div className="simplebar-content" style={{ padding: "16px 0px" }}>
										<div className="list-group list-group-flush w-100">
											<a className="list-group-item list-group-item-action">
												<div className="d-flex">
													<div className="flex-shrink-0">
														<img src="../assets/images/user/avatar-2.jpg" alt="user-image" className="user-avtar" />
													</div>
													<div className="flex-grow-1 ms-1">
														<span className="float-end text-muted">3:00 AM</span>
														<p className="text-body mb-1">It's <b>Cristina danny's</b> birthday today.</p>
														<span className="text-muted">2 min ago</span>
													</div>
												</div>
											</a>
											<a className="list-group-item list-group-item-action">
												<div className="d-flex">
													<div className="flex-shrink-0">
														<img src="../assets/images/user/avatar-1.jpg" alt="user-image" className="user-avtar" />
													</div>
													<div className="flex-grow-1 ms-1">
														<span className="float-end text-muted">6:00 PM</span>
														<p className="text-body mb-1"><b>Aida Burg</b> commented your post.</p>
														<span className="text-muted">5 August</span>
													</div>
												</div>
											</a>
											<a className="list-group-item list-group-item-action">
												<div className="d-flex">
													<div className="flex-shrink-0">
														<img src="../assets/images/user/avatar-3.jpg" alt="user-image" className="user-avtar" />
													</div>
													<div className="flex-grow-1 ms-1">
														<span className="float-end text-muted">2:45 PM</span>
														<p className="text-body mb-1"><b>There was a failure to your setup.</b></p>
														<span className="text-muted">7 hours ago</span>
													</div>
												</div>
											</a>
											<a className="list-group-item list-group-item-action">
												<div className="d-flex">
													<div className="flex-shrink-0">
														<img src="../assets/images/user/avatar-4.jpg" alt="user-image" className="user-avtar" />
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

export default MessagesDropdownSection;
