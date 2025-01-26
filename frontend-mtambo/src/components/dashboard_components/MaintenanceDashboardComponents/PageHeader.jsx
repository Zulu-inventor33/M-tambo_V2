import React from 'react';

const PageHeader = ({ title, breadcrumbItems }) => {
    return (
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <div className='d-flex flex-column'>
                            {/* Page Title */}
                            <div className="page-header-title">
                                <h5 className="m-b-10">{title}</h5>
                            </div>
                            {/* Breadcrumb Navigation */}
                            <ul className="breadcrumb">
                                {breadcrumbItems.map((item, index) => (
                                    <li key={index} className={`breadcrumb-item ${index === breadcrumbItems.length - 1 ? 'active' : ''}`}>
                                        {item.link ? (
                                            <a href={item.link} className="breadcrumb-link">{item.label}</a>
                                        ) : (
                                            <span className="breadcrumb-text">{item.label}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;