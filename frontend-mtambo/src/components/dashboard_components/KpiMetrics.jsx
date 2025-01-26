import React from 'react';

const KpiMetrics = ({ metrics }) => {
  return (
    <div className="row">
      {metrics.map((metric, index) => (
        <div key={index} className="col-xl-3 col-md-6 mb-4">
          <div className={`order-card ${metric.bgColor} text-white card shadow-lg`}>
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title">{metric.title}</h6>
                <div className="card-number">{metric.value}</div>
              </div>
              <div className="icon-container">
                <i className={`feather ${metric.icon} fa-2x`}></i>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KpiMetrics;