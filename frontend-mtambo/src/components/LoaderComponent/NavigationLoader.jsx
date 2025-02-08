import React from 'react';

import './Loader.css';

const NavigationLoader = () => {
    return (
        <div className="loader-bg">
            <div className="loader-track">
                <div className="loader-fill"></div>
            </div>
        </div>
    );
};

export default NavigationLoader;