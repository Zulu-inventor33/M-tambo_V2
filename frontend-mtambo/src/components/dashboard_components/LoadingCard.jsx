import React, { useState, useEffect } from "react";
import { HashLoader } from 'react-spinners';

const LoadingCard = ({ minHeightSetting }) => {
    const [primaryColor, setPrimaryColor] = useState('#1890ff');

    useEffect(() => {
        const body = document.body;
        const preset = body.getAttribute('data-pc-preset');
        let color;

        switch (preset) {
            case 'preset-2':
                color = '#3366ff';
                break;
            case 'preset-3':
                color = '#7265e6';
                break;
            case 'preset-4':
                color = '#068e44';
                break;
            case 'preset-5':
                color = '#3c64d0';
                break;
            case 'preset-6':
                color = '#f27013';
                break;
            case 'preset-7':
                color = '#2aa1af';
                break;
            case 'preset-8':
                color = '#00a854';
                break;
            case 'preset-9':
                color = '#009688';
                break;
            default:
                color = '#1890ff';
                break;
        }
        setPrimaryColor(color);
    }, []);

    return (
        <div 
            className="card mb-4" 
            style={minHeightSetting ? { minHeight: '400px' } : {}}
        >
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <HashLoader color={primaryColor} size={50} />
                <div className="text-center mt-4">
                    <h4>Loading Data...</h4>
                </div>
            </div>
        </div>
    );
};

export default LoadingCard;