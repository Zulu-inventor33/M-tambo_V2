import React from 'react';

const Input = ({ name, value, onChange, error, placeholder, type = "text" }) => {
    return (
        <div>
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default Input;