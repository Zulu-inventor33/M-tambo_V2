import React from 'react';

const AddNewBuilding = () => {
    return (
        <div className='pc-container'>
            <div className='pc-content'>
                {/* header section */}
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
                            <div className="col-md-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                                    <li className="breadcrumb-item"><a href="javascript: void(0)">Add Building</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {/* [ form-element ] start */}
                    <div className="col-lg-12">
                        <div className="card">
                            <div id="sticky-action" className="sticky-action">
                                <div className="card-header">
                                    <div className="row align-items-center">
                                        <div className="col-sm-6">
                                            <h5>Add New Building</h5>
                                        </div>
                                        <div className="col-sm-6 text-sm-end mt-3 mt-sm-0">
                                            <button type="reset" className="btn btn-success  me-2">Submit</button>
                                            <button type="reset" className="btn btn-danger">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* The form sections starts here */}
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <form>
                                            <div className="form-group">
                                                <label className="form-label">Building Name</label>
                                                <input type="text" className="form-control" placeholder="name" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Address</label>
                                                <input type="text" className="form-control" placeholder="address" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Select developer of building</label>
                                                <input type="text" className="form-control" placeholder="Will be select" />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-md-6">
                                        <form>
                                            <div className="form-group">
                                                <label className="form-label">Phone number to management</label>
                                                <input type="text" className="form-control" placeholder="phone" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Number of floors</label>
                                                <input type="text" className="form-control" placeholder="will be a number" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="exampleFormControlTextarea1">Additional details</label>
                                                <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* [ form-element ] end */}
                </div>
            </div>
        </div>
    );
};

export default AddNewBuilding;