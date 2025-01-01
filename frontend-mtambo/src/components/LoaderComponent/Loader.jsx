import React, { useEffect, useState } from 'react';
import { useLoader } from '../../context/LoaderContext';

import './Loader.css';

const Loader = () => {
    // Access the global loading state
    const { isLoading } = useLoader();

    return (
        isLoading && (
            <div className="loader-bg">
                <div className="loader-track">
                    <div className="loader-fill"></div>
                </div>
            </div>
        )
    );
};

export default Loader;