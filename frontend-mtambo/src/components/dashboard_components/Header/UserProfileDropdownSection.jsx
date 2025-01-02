import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../../context/AuthenticationContext';

const UserProfileDropdownSection = () => {
	const { user, logOut } = useAuth();

	// Check if user is logged in
	if (!user) {
		return null;
	}

	return (
		<li className="dropdown pc-h-item header-user-profile">
			<a
				className="pc-head-link dropdown-toggle arrow-none me-0"
				data-bs-toggle="dropdown"
				href="#"
				role="button"
				aria-haspopup="false"
				data-bs-auto-close="outside"
				aria-expanded="false"
			>
				<img src={user.avatar || "/images/avatar_placeholder.avif"} alt="user-image" className="user-avtar" />
				<span>{user.first_name} {user.last_name}</span>
			</a>
			<div className="dropdown-menu dropdown-user-profile dropdown-menu-end pc-h-dropdown">
				<div className="dropdown-header">
					<div className="d-flex mb-1">
						<div className="flex-shrink-0">
							<img src={user.avatar || "/images/avatar_placeholder.avif"} alt="user-image" className="user-avtar wid-35" />
						</div>
						<div className="flex-grow-1 ms-3">
							<h6 className="mb-1">{user.email}</h6>
							<span>{user.account_type}</span>
						</div>
						{/* Logout button */}
						<a href="#!" className="pc-head-link bg-transparent" onClick={logOut}>
							<i className="ti ti-power text-danger"></i>
						</a>
					</div>
				</div>
				<ul className="nav drp-tabs nav-fill nav-tabs" id="mydrpTab" role="tablist">
					<li className="nav-item" role="presentation">
						<button className="nav-link active" id="drp-t1" data-bs-toggle="tab" data-bs-target="#drp-tab-1" type="button" role="tab" aria-controls="drp-tab-1" aria-selected="true"><i className="ti ti-user"></i> Profile</button>
					</li>
					<li className="nav-item" role="presentation">
						<button className="nav-link" id="drp-t2" data-bs-toggle="tab" data-bs-target="#drp-tab-2" type="button" role="tab" aria-controls="drp-tab-2" aria-selected="false" tabIndex="-1"><i className="ti ti-settings"></i> Setting</button>
					</li>
				</ul>
				<div className="tab-content" id="mysrpTabContent">
					<div className="tab-pane fade show active" id="drp-tab-1" role="tabpanel" aria-labelledby="drp-t1" tabIndex="0">
						<Link to="/dashboard/profile" className="dropdown-item">
							<i className="ti ti-edit-circle"></i>
							<span>Edit Profile</span>
						</Link>
						<Link to="/dashboard/profile" className="dropdown-item">
							<i className="ti ti-user"></i>
							<span>View Profile</span>
						</Link>
						<Link to="#" className="dropdown-item">
							<i className="ti ti-wallet"></i>
							<span>Billing</span>
						</Link>
						<Link to="#" className="dropdown-item" onClick={logOut}>
							<i className="ti ti-power"></i>
							<span>Logout</span>
						</Link>
					</div>
					<div className="tab-pane fade" id="drp-tab-2" role="tabpanel" aria-labelledby="drp-t2" tabIndex="0">
						<a href="#!" className="dropdown-item">
							<i className="ti ti-help"></i>
							<span>Support</span>
						</a>
						<Link to="/dashboard/profile" className="dropdown-item">
							<i className="ti ti-user"></i>
							<span>Account Settings</span>
						</Link>
						<a href="#!" className="dropdown-item">
							<i className="ti ti-list"></i>
							<span>History</span>
						</a>
					</div>
				</div>
			</div>
		</li>
	);
};

export default UserProfileDropdownSection;