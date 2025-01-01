import React from "react";

const KeyPerformanceIndicators = ({ data }) => {
    return (
        <div class="row mt-4">
            {data.map((item, index) => (
                <div key={index} class="col-sm-6 col-md-3">
                    <div class={`card card-stats card-${item.color} card-round`}>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-4">
                                    <div class="icon-big text-center">
                                        <i class={`${item.icon} fa-2x`}></i>
                                    </div>
                                </div>
                                <div class="col-8 col-stats">
                                    <div class="numbers">
                                        <p class="card-category">{item.title}</p>
                                        <h4 class="card-title">{item.count}</h4>
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