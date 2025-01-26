import React from "react";

const KeyPerformanceIndicators = ({ data }) => {
    return (
        <div className="row mt-4">
            {data.map((item, index) => (
                <div key={index} className="col-sm-6 col-md-3">
                    <div className={`card card-stats card-round`}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-4">
                                    <div className="icon-big text-center">
                                        <i className={`${item.icon} fa-2x`}></i>
                                    </div>
                                </div>
                                <div className="col-8 col-stats">
                                    <div className="numbers">
                                        <p className="card-category">{item.title}</p>
                                        <h4 className="card-title">{item.count}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default KeyPerformanceIndicators;