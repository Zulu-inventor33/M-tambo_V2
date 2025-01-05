import React from 'react';
import { Link } from 'react-router-dom';

const ProfileContent = () => {
    return (
        <div className='pc-container'>
            <div className='pc-content'>
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
                            <div className="col-md-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/dashboard">Home</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <a href="javascript: void(0)">Users</a>
                                    </li>
                                    <li className="breadcrumb-item" aria-current="page">
                                        Account Profile
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-12">
                                <div className="page-header-title">
                                    <h2 className="mb-0">Account Profile</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {/* [ sample-page ] start */}
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header pb-0">
                                <ul className="nav nav-tabs profile-tabs" id="myTab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link active" id="profile-tab-1" data-bs-toggle="tab" href="#profile-1" role="tab" aria-selected="true">
                                            <i className="ti ti-user me-2"></i>Profile
                                        </a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="profile-tab-2" data-bs-toggle="tab" href="#profile-2" role="tab" aria-selected="false" tabIndex="-1">
                                            <i className="ti ti-file-text me-2"></i>Personal
                                        </a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="profile-tab-3" data-bs-toggle="tab" href="#profile-3" role="tab" aria-selected="false" tabIndex="-1">
                                            <i className="ti ti-id me-2"></i>My Account
                                        </a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="profile-tab-4" data-bs-toggle="tab" href="#profile-4" role="tab" aria-selected="false" tabIndex="-1">
                                            <i className="ti ti-lock me-2"></i>Change Password
                                        </a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="profile-tab-5" data-bs-toggle="tab" href="#profile-5" role="tab" aria-selected="false" tabIndex="-1">
                                            <i className="ti ti-users me-2"></i>Role
                                        </a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="profile-tab-6" data-bs-toggle="tab" href="#profile-6" role="tab" aria-selected="false" tabIndex="-1">
                                            <i className="ti ti-settings me-2"></i>Settings
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="tab-content">
                                <div className="tab-pane show active" id="profile-1" role="tabpanel" aria-labelledby="profile-tab-1">
                                    <div className="row">
                                        <div className="col-lg-4 col-xxl-3">
                                            <div className="card">
                                                <div className="card-body position-relative">
                                                    <div className="position-absolute end-0 top-0 p-3">
                                                        <span className="badge bg-primary">Pro</span>
                                                    </div>
                                                    <div className="text-center mt-3">
                                                        <div className="chat-avtar d-inline-flex mx-auto">
                                                            <img className="rounded-circle img-fluid wid-70" src="../assets/images/user/avatar-5.jpg" alt="User image" />
                                                        </div>
                                                        <h5 className="mb-0">Anshan H.</h5>
                                                        <p className="text-muted text-sm">Project Manager</p>
                                                        <hr className="my-3" />
                                                        <div className="row g-3">
                                                            <div className="col-4">
                                                                <h5 className="mb-0">86</h5>
                                                                <small className="text-muted">Post</small>
                                                            </div>
                                                            <div className="col-4 border border-top-0 border-bottom-0">
                                                                <h5 className="mb-0">40</h5>
                                                                <small className="text-muted">Project</small>
                                                            </div>
                                                            <div className="col-4">
                                                                <h5 className="mb-0">4.5K</h5>
                                                                <small className="text-muted">Members</small>
                                                            </div>
                                                        </div>
                                                        <hr className="my-3" />
                                                        <div className="d-inline-flex align-items-center justify-content-between w-100 mb-3">
                                                            <i className="ti ti-mail"></i>
                                                            <p className="mb-0">anshan@gmail.com</p>
                                                        </div>
                                                        <div className="d-inline-flex align-items-center justify-content-between w-100 mb-3">
                                                            <i className="ti ti-phone"></i>
                                                            <p className="mb-0">(+1-876) 8654 239 581</p>
                                                        </div>
                                                        <div className="d-inline-flex align-items-center justify-content-between w-100 mb-3">
                                                            <i className="ti ti-map-pin"></i>
                                                            <p className="mb-0">New York</p>
                                                        </div>
                                                        <div className="d-inline-flex align-items-center justify-content-between w-100">
                                                            <i className="ti ti-link"></i>
                                                            <a href="#" className="link-primary">
                                                                <p className="mb-0">https://anshan.dh.url</p>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header">
                                                    <h5>Skills</h5>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row align-items-center mb-3">
                                                        <div className="col-sm-6 mb-2 mb-sm-0">
                                                            <p className="mb-0">Junior</p>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-grow-1 me-3">
                                                                    <div className="progress progress-primary" style={{ height: '6px' }}>
                                                                        <div className="progress-bar" style={{ width: '30%' }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-shrink-0">
                                                                    <p className="mb-0 text-muted">30%</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row align-items-center mb-3">
                                                        <div className="col-sm-6 mb-2 mb-sm-0">
                                                            <p className="mb-0">UX Researcher</p>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-grow-1 me-3">
                                                                    <div className="progress progress-primary" style={{ height: '6px' }}>
                                                                        <div className="progress-bar" style={{ width: '80%' }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-shrink-0">
                                                                    <p className="mb-0 text-muted">80%</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row align-items-center mb-3">
                                                        <div className="col-sm-6 mb-2 mb-sm-0">
                                                            <p className="mb-0">Wordpress</p>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-grow-1 me-3">
                                                                    <div className="progress progress-primary" style={{ height: '6px' }}>
                                                                        <div className="progress-bar" style={{ width: '90%' }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-shrink-0">
                                                                    <p className="mb-0 text-muted">90%</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row align-items-center mb-3">
                                                        <div className="col-sm-6 mb-2 mb-sm-0">
                                                            <p className="mb-0">HTML</p>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-grow-1 me-3">
                                                                    <div className="progress progress-primary" style={{ height: '6px' }}>
                                                                        <div className="progress-bar" style={{ width: '30%' }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-shrink-0">
                                                                    <p className="mb-0 text-muted">30%</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row align-items-center mb-3">
                                                        <div className="col-sm-6 mb-2 mb-sm-0">
                                                            <p className="mb-0">Graphic Design</p>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-grow-1 me-3">
                                                                    <div className="progress progress-primary" style={{ height: '6px' }}>
                                                                        <div className="progress-bar" style={{ width: '95%' }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-shrink-0">
                                                                    <p className="mb-0 text-muted">95%</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row align-items-center">
                                                        <div className="col-sm-6 mb-2 mb-sm-0">
                                                            <p className="mb-0">Code Style</p>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-grow-1 me-3">
                                                                    <div className="progress progress-primary" style={{ height: '6px' }}>
                                                                        <div className="progress-bar" style={{ width: '75%' }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-shrink-0">
                                                                    <p className="mb-0 text-muted">75%</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-8 col-xxl-9">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h5>About me</h5>
                                                </div>
                                                <div className="card-body">
                                                    <p className="mb-0">Hello, I’m Anshan Handgun Creative Graphic Designer &amp; User Experience Designer based in Website, I create digital Products a more Beautiful and usable place. Morbid accusant ipsum. Nam nec tellus at.</p>
                                                </div>
                                            </div>

                                            <div className="card">
                                                <div className="card-header">
                                                    <h5>Personal Details</h5>
                                                </div>
                                                <div className="card-body">
                                                    <ul className="list-group list-group-flush">
                                                        <li className="list-group-item px-0 pt-0">
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">Full Name</p>
                                                                    <p className="mb-0">Anshan Handgun</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">Father Name</p>
                                                                    <p className="mb-0">Mr. Deepen Handgun</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item px-0">
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">Phone</p>
                                                                    <p className="mb-0">(+1-876) 8654 239 581</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">Country</p>
                                                                    <p className="mb-0">New York</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item px-0">
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">Email</p>
                                                                    <p className="mb-0">anshan.dh81@gmail.com</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">Zip Code</p>
                                                                    <p className="mb-0">956 754</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item px-0 pb-0">
                                                            <p className="mb-1 text-muted">Address</p>
                                                            <p className="mb-0">Street 110-B Kalians Bag, Dewan, M.P. New York</p>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="card">
                                                <div className="card-header">
                                                    <h5>Education</h5>
                                                </div>
                                                <div className="card-body">
                                                    <ul className="list-group list-group-flush">
                                                        <li className="list-group-item px-0 pt-0">
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">Master Degree (Year)</p>
                                                                    <p className="mb-0">2014-2017</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">Institute</p>
                                                                    <p className="mb-0">-</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item px-0">
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">Bachelor (Year)</p>
                                                                    <p className="mb-0">2011-2013</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">Institute</p>
                                                                    <p className="mb-0">Imperial College London</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item px-0 pb-0">
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">School (Year)</p>
                                                                    <p className="mb-0">2009-2011</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">Institute</p>
                                                                    <p className="mb-0">School of London, England</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="card">
                                                <div className="card-header">
                                                    <h5>Employment</h5>
                                                </div>
                                                <div className="card-body">
                                                    <ul className="list-group list-group-flush">
                                                        <li className="list-group-item px-0 pt-0">
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">Senior</p>
                                                                    <p className="mb-0">Senior UI/UX designer (Year)</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">Job Responsibility</p>
                                                                    <p className="mb-0">Perform task related to project manager with the 100+ team under my observation. Team management is key role in this company.</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item px-0">
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">Trainee cum Project Manager (Year)</p>
                                                                    <p className="mb-0">2017-2019</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">Job Responsibility</p>
                                                                    <p className="mb-0">Team management is key role in this company.</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item px-0 pb-0">
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">School (Year)</p>
                                                                    <p className="mb-0">2009-2011</p>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <p className="mb-1 text-muted">Institute</p>
                                                                    <p className="mb-0">School of London, England</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="profile-2" role="tabpanel" aria-labelledby="profile-tab-2">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h5>Personal Information</h5>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-sm-12 text-center mb-3">
                                                            <div className="user-upload wid-75">
                                                                <img
                                                                    src="../assets/images/user/avatar-4.jpg"
                                                                    alt="img"
                                                                    className="img-fluid"
                                                                />
                                                                <label htmlFor="uplfile" className="img-avtar-upload">
                                                                    <i className="ti ti-camera f-24 mb-1"></i>
                                                                    <span>Upload</span>
                                                                </label>
                                                                <input type="file" id="uplfile" className="d-none" />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label">First Name</label>
                                                                <input type="text" className="form-control" defaultValue="Anshan" />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label">Last Name</label>
                                                                <input type="text" className="form-control" defaultValue="Handgun" />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label">Country</label>
                                                                <input type="text" className="form-control" defaultValue="New York" />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label">Zip code</label>
                                                                <input type="text" className="form-control" defaultValue="956754" />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label className="form-label">Bio</label>
                                                                <textarea className="form-control">
                                                                    Hello, I’m Anshan Handgun Creative Graphic Designer &amp; User
                                                                    Experience Designer based in Website, I create digital Products a
                                                                    more Beautiful and usable place. Morbid accusant ipsum. Nam nec tellus
                                                                    at.
                                                                </textarea>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label className="form-label">Experience</label>
                                                                <select className="form-control" defaultValue="4 year">
                                                                    <option>Startup</option>
                                                                    <option>2 year</option>
                                                                    <option>3 year</option>
                                                                    <option>4 year</option>
                                                                    <option>5 year</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h5>Social Network</h5>
                                                </div>
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <div className="flex-grow-1 me-3">
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-shrink-0">
                                                                    <div className="avtar avtar-xs btn-light-twitter">
                                                                        <i className="fab fa-twitter f-16"></i>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-grow-1 ms-3">
                                                                    <h6 className="mb-0">Twitter</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <button className="btn btn-link-danger">Connect</button>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <div className="flex-grow-1 me-3">
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-shrink-0">
                                                                    <div className="avtar avtar-xs btn-light-facebook">
                                                                        <i className="fab fa-facebook-f f-16"></i>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-grow-1 ms-3">
                                                                    <h6 className="mb-0">Facebook</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="text-facebook">Anshan Handgun</div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1 me-3">
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-shrink-0">
                                                                    <div className="avtar avtar-xs btn-light-linkedin">
                                                                        <i className="fab fa-linkedin-in f-16"></i>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-grow-1 ms-3">
                                                                    <h6 className="mb-0">Linkedin</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <button className="btn btn-link-danger">Connect</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header">
                                                    <h5>Contact Information</h5>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label">Contact Phone</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    defaultValue="(+99) 9999 999 999"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label">
                                                                    Email <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    defaultValue="demo@sample.com"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label className="form-label">Portfolio Url</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    defaultValue="https://demo.com"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label className="form-label">Address</label>
                                                                <textarea className="form-control">
                                                                    3379 Monroe Avenue, Fort Myers, Florida(33912)
                                                                </textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 text-end btn-page">
                                            <div className="btn btn-outline-secondary">Cancel</div>
                                            <div className="btn btn-primary">Update Profile</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="profile-3" role="tabpanel" aria-labelledby="profile-tab-3">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h5>General Settings</h5>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label">Username <span className="text-danger">*</span></label>
                                                                <input type="text" className="form-control" value="Ashoka_Tano_16" />
                                                                <small className="form-text text-muted">Your Profile URL: https://pc.com/Ashoka_Tano_16</small>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label">Account Email <span className="text-danger">*</span></label>
                                                                <input type="text" className="form-control" value="demo@sample.com" />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label">Language</label>
                                                                <select className="form-control">
                                                                    <option>Washington</option>
                                                                    <option>India</option>
                                                                    <option>Africa</option>
                                                                    <option>New York</option>
                                                                    <option>Malaysia</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label">Sign in Using</label>
                                                                <select className="form-control">
                                                                    <option>Password</option>
                                                                    <option>Face Recognition</option>
                                                                    <option>Thumb Impression</option>
                                                                    <option>Key</option>
                                                                    <option>Pin</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h5>Advance Settings</h5>
                                                </div>
                                                <div className="card-body">
                                                    <ul className="list-group list-group-flush">
                                                        <li className="list-group-item px-0 pt-0">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div>
                                                                    <p className="mb-1">Secure Browsing</p>
                                                                    <p className="text-muted text-sm mb-0">Browsing Securely ( https ) when it's necessary</p>
                                                                </div>
                                                                <div className="form-check form-switch p-0">
                                                                    <input className="form-check-input h4 position-relative m-0" type="checkbox" role="switch" checked />
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item px-0">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div>
                                                                    <p className="mb-1">Login Notifications</p>
                                                                    <p className="text-muted text-sm mb-0">Notify when login attempted from other place</p>
                                                                </div>
                                                                <div className="form-check form-switch p-0">
                                                                    <input className="form-check-input h4 position-relative m-0" type="checkbox" role="switch" checked />
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item px-0 pb-0">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div>
                                                                    <p className="mb-1">Login Approvals</p>
                                                                    <p className="text-muted text-sm mb-0">Approvals is not required when login from unrecognized devices.</p>
                                                                </div>
                                                                <div className="form-check form-switch p-0">
                                                                    <input className="form-check-input h4 position-relative m-0" type="checkbox" role="switch" checked />
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h5>Recognized Devices</h5>
                                                </div>
                                                <div className="card-body">
                                                    <ul className="list-group list-group-flush">
                                                        <li className="list-group-item px-0 pt-0">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div className="me-2">
                                                                    <p className="mb-2">Celt Desktop</p>
                                                                    <p className="mb-0 text-muted">4351 Deans Lane</p>
                                                                </div>
                                                                <div className="">
                                                                    <div className="text-success d-inline-block me-2">
                                                                        <i className="fas fa-circle f-8 me-2"></i>
                                                                        Current Active
                                                                    </div>
                                                                    <a href="#!" className="text-danger"><i className="feather icon-x-circle"></i></a>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item px-0">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div className="me-2">
                                                                    <p className="mb-2">Imco Tablet</p>
                                                                    <p className="mb-0 text-muted">4185 Michigan Avenue</p>
                                                                </div>
                                                                <div className="">
                                                                    <div className="text-muted d-inline-block me-2">
                                                                        <i className="fas fa-circle f-8 me-2"></i>
                                                                        Active 5 days ago
                                                                    </div>
                                                                    <a href="#!" className="text-danger"><i className="feather icon-x-circle"></i></a>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item px-0 pb-0">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div className="me-2">
                                                                    <p className="mb-2">Albs Mobile</p>
                                                                    <p className="mb-0 text-muted">3462 Fairfax Drive</p>
                                                                </div>
                                                                <div className="">
                                                                    <div className="text-muted d-inline-block me-2">
                                                                        <i className="fas fa-circle f-8 me-2"></i>
                                                                        Active 1 month ago
                                                                    </div>
                                                                    <a href="#!" className="text-danger"><i className="feather icon-x-circle"></i></a>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h5>Active Sessions</h5>
                                                </div>
                                                <div className="card-body">
                                                    <ul className="list-group list-group-flush">
                                                        <li className="list-group-item px-0 pt-0">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div className="me-2">
                                                                    <p className="mb-2">Celt Desktop</p>
                                                                    <p className="mb-0 text-muted">4351 Deans Lane</p>
                                                                </div>
                                                                <button className="btn btn-link-danger">Logout</button>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item px-0 pb-0">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div className="me-2">
                                                                    <p className="mb-2">Moon Tablet</p>
                                                                    <p className="mb-0 text-muted">4185 Michigan Avenue</p>
                                                                </div>
                                                                <button className="btn btn-link-danger">Logout</button>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 text-end">
                                            <button className="btn btn-outline-dark ms-2">Clear</button>
                                            <button className="btn btn-primary">Update Profile</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="profile-4" role="tabpanel" aria-labelledby="profile-tab-4">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5>Change Password</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Old Password</label>
                                                        <input type="password" className="form-control" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">New Password</label>
                                                        <input type="password" className="form-control" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Confirm Password</label>
                                                        <input type="password" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <h5>New password must contain:</h5>
                                                    <ul className="list-group list-group-flush">
                                                        <li className="list-group-item"><i className="ti ti-minus me-2"></i> At least 8 characters</li>
                                                        <li className="list-group-item"><i className="ti ti-minus me-2"></i> At least 1 lower letter (a-z)</li>
                                                        <li className="list-group-item"><i className="ti ti-minus me-2"></i> At least 1 uppercase letter (A-Z)</li>
                                                        <li className="list-group-item"><i className="ti ti-minus me-2"></i> At least 1 number (0-9)</li>
                                                        <li className="list-group-item"><i className="ti ti-minus me-2"></i> At least 1 special character</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-footer text-end btn-page">
                                            <div className="btn btn-outline-secondary">Cancel</div>
                                            <div className="btn btn-primary">Update Profile</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="profile-5" role="tabpanel" aria-labelledby="profile-tab-5">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5>Invite Team Members</h5>
                                        </div>
                                        <div className="card-body">
                                            <h4>5/10 <small>members available in your plan.</small></h4>
                                            <hr className="my-3" />
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <div className="form-group">
                                                        <label className="form-label">Email Address</label>
                                                        <div className="row">
                                                            <div className="col">
                                                                <input type="email" className="form-control" />
                                                            </div>
                                                            <div className="col-auto">
                                                                <button className="btn btn-primary">Send</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body table-card">
                                            <div className="table-responsive">
                                                <table className="table mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>MEMBER</th>
                                                            <th>ROLE</th>
                                                            <th className="text-end">STATUS</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {/* Repeat rows for each member */}
                                                        {[
                                                            { name: "Addie Bass", email: "mareva@gmail.com", role: "Owner", status: "Joined", image: "../assets/images/user/avatar-1.jpg" },
                                                            { name: "Agnes McGee", email: "heba@gmail.com", role: "Manager", status: "Invited", image: "../assets/images/user/avatar-4.jpg" },
                                                            { name: "Agnes McGee", email: "heba@gmail.com", role: "Staff", status: "Joined", image: "../assets/images/user/avatar-5.jpg" },
                                                            // Add more rows as needed
                                                        ].map((member, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="row">
                                                                        <div className="col-auto pe-0">
                                                                            <img src={member.image} alt="user-image" className="wid-40 rounded-circle" />
                                                                        </div>
                                                                        <div className="col">
                                                                            <h5 className="mb-0">{member.name}</h5>
                                                                            <p className="text-muted f-12 mb-0">{member.email}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td><span className={`badge ${member.role === 'Owner' ? 'bg-primary' : member.role === 'Manager' ? 'bg-light-info' : 'bg-light-warning'}`}>{member.role}</span></td>
                                                                <td className="text-end">
                                                                    {member.status === "Joined" ? (
                                                                        <span className="badge bg-success">{member.status}</span>
                                                                    ) : (
                                                                        <>
                                                                            <a href="#" className="btn btn-link-danger">Resend</a>
                                                                            <span className="badge bg-light-success">{member.status}</span>
                                                                        </>
                                                                    )}
                                                                </td>
                                                                <td className="text-end">
                                                                    <a href="#" className="avtar avtar-s btn-link-secondary">
                                                                        <i className="ti ti-dots f-18"></i>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="card-footer text-end btn-page">
                                            <div className="btn btn-link-danger">Cancel</div>
                                            <div className="btn btn-primary">Update Profile</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="profile-6" role="tabpanel" aria-labelledby="profile-tab-6">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h5>Email Settings</h5>
                                                </div>
                                                <div className="card-body">
                                                    <h6 className="mb-4">Setup Email Notification</h6>
                                                    <div className="d-flex align-items-center justify-content-between mb-1">
                                                        <div>
                                                            <p className="text-muted mb-0">Email Notification</p>
                                                        </div>
                                                        <div className="form-check form-switch p-0">
                                                            <input className="m-0 form-check-input h5 position-relative" type="checkbox" role="switch" checked />
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-between mb-1">
                                                        <div>
                                                            <p className="text-muted mb-0">Send Copy To Personal Email</p>
                                                        </div>
                                                        <div className="form-check form-switch p-0">
                                                            <input className="m-0 form-check-input h5 position-relative" type="checkbox" role="switch" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header">
                                                    <h5>Updates from System Notification</h5>
                                                </div>
                                                <div className="card-body">
                                                    <h6 className="mb-4">Email you with?</h6>
                                                    {[
                                                        "News about PCT-themes products and feature updates",
                                                        "Tips on getting more out of PCT-themes",
                                                        "Things you missed since you last logged into PCT-themes",
                                                        "News about products and other services",
                                                        "Tips and Document business products",
                                                    ].map((label, index) => (
                                                        <div className="d-flex align-items-center justify-content-between mb-1" key={index}>
                                                            <div>
                                                                <p className="text-muted mb-0">{label}</p>
                                                            </div>
                                                            <div className="form-check p-0">
                                                                <input className="m-0 form-check-input h5 position-relative" type="checkbox" role="switch" checked={index < 3} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h5>Activity Related Emails</h5>
                                                </div>
                                                <div className="card-body">
                                                    <h6 className="mb-4">When to email?</h6>
                                                    {[
                                                        "Have new notifications",
                                                        "You're sent a direct message",
                                                        "Someone adds you as a connection",
                                                    ].map((label, index) => (
                                                        <div className="d-flex align-items-center justify-content-between mb-1" key={index}>
                                                            <div>
                                                                <p className="text-muted mb-0">{label}</p>
                                                            </div>
                                                            <div className="form-check form-switch p-0">
                                                                <input className="m-0 form-check-input h5 position-relative" type="checkbox" role="switch" checked={index !== 1} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <hr className="my-4" />
                                                    <h6 className="mb-4">When to escalate emails?</h6>
                                                    {[
                                                        "Upon new order",
                                                        "New membership approval",
                                                        "Member registration",
                                                    ].map((label, index) => (
                                                        <div className="d-flex align-items-center justify-content-between mb-1" key={index}>
                                                            <div>
                                                                <p className="text-muted mb-0">{label}</p>
                                                            </div>
                                                            <div className="form-check form-switch p-0">
                                                                <input className="m-0 form-check-input h5 position-relative" type="checkbox" role="switch" checked={index !== 1} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 text-end btn-page">
                                            <div className="btn btn-outline-secondary">Cancel</div>
                                            <div className="btn btn-primary">Update Profile</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileContent;