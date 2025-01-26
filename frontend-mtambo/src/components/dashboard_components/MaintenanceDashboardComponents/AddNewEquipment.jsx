import React from "react";

const AddNewEquipment = () => {
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
                                    <li className="breadcrumb-item"><a href="javascript: void(0)">Add Equipment</a></li>
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
                                            <h5>Add Equipment to Existing Building</h5>
                                        </div>
                                        <div className="col-sm-6 text-sm-end mt-3 mt-sm-0">
                                            <button type="reset" className="btn btn-success  me-2">Submit Equipment</button>
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
                                                <label className="form-label">Select Building</label>
                                                <select className="form-select">
                                                    <option>List of building maintained</option>
                                                    <option>Option 2</option>
                                                    <option>Option 3</option>
                                                    <option>Option 4</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Equipment type</label>
                                                <select className="form-select">
                                                    <option>Elevator</option>
                                                    <option>HVAC</option>
                                                    <option>Power Generator</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Equipment name(e.g Lift1, Generator2)</label>
                                                <input type="text" className="form-control" placeholder="name" />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-md-6">
                                        <form>
                                            <div className="form-group">
                                                <label className="form-label">Equipment serial number</label>
                                                <input type="text" className="form-control" placeholder="serial" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="example-datemin">Installation date</label>
                                                <input type="date" class="form-control" id="example-datemin" min="2000-01-02"/>
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
    )
};

export default AddNewEquipment;
