import React, { useEffect } from "react";

const AddElevator = ({ setProgress }) => {
    useEffect(() => {
        setProgress(40);
        setTimeout(() => {
            setProgress(100);
        }, 800)
    }, []);
    
    return (
        <div className="pc-container">
            <div className="pc-content">
                <div>This will be the add Elevator section</div>
            </div>
        </div>
    )
}

export default AddElevator;