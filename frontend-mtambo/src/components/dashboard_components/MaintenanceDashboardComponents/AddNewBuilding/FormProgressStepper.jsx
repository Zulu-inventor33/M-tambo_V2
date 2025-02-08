import React from "react";

const FormProgressStepper = ({ step }) => {

    return (
        <div className="stepper">
            <div className={`step ${step === 1 ? 'active' : 'disabled'}`}>
                <span className="step-number">1</span>
                <span className="step-label">Building Details</span>
            </div>
            <div className={`step-connector ${step > 1 ? 'active' : 'disabled'}`}></div>

            <div className={`step ${step === 2 ? 'active' : 'disabled'}`}>
                <span className="step-number">2</span>
                <span className="step-label">Elevator Details</span>
            </div>
            <div className={`step-connector ${step > 2 ? 'active' : 'disabled'}`}></div>

            <div className={`step ${step === 3 ? 'active' : 'disabled'}`}>
                <span className="step-number">3</span>
                <span className="step-label">Schedule Maintenance</span>
            </div>
        </div>
    );
};

export default FormProgressStepper;
