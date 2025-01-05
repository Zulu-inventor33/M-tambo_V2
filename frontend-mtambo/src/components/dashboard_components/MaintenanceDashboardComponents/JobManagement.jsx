import React from 'react';
import { Link } from 'react-router-dom';

const JobManagement = () => {
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
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="row align-items-center my-2">
                                    <div className="col-5">
                                        <p className="mb-0">Published Project</p>
                                    </div>
                                    <div className="col">
                                        <div className="progress progress-primary">
                                            <div className="progress-bar" style={{ width: '30%' }}></div>
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <p className="mb-0 text-sm text-muted">30%</p>
                                    </div>
                                </div>
                                <div className="row align-items-center my-2">
                                    <div className="col-5">
                                        <p className="mb-0">Completed Task</p>
                                    </div>
                                    <div className="col">
                                        <div className="progress progress-success">
                                            <div className="progress-bar" style={{ width: '90%' }}></div>
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <p className="mb-0 text-sm text-muted">90%</p>
                                    </div>
                                </div>
                                <div className="row align-items-center my-2">
                                    <div className="col-5">
                                        <p className="mb-0">Pending Task</p>
                                    </div>
                                    <div className="col">
                                        <div className="progress progress-danger">
                                            <div className="progress-bar" style={{ width: '50%' }}></div>
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <p className="mb-0 text-sm text-muted">50%</p>
                                    </div>
                                </div>
                                <div className="row align-items-center my-2">
                                    <div className="col-5">
                                        <p className="mb-0">Issues</p>
                                    </div>
                                    <div className="col">
                                        <div className="progress progress-warning">
                                            <div className="progress-bar" style={{ width: '55%' }}></div>
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <p className="mb-0 text-sm text-muted">55%</p>
                                    </div>
                                </div>
                                <hr className="my-4" />
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <img src="../assets/images/widget/target.svg" alt="img" className="img-fluid" />
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6>Income Salaries & Budget</h6>
                                        <p className="text-muted mb-0">
                                            All your income salaries and budget comes here, you can track them or manage them
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobManagement;