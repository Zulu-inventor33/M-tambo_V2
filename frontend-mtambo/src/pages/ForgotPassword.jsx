import React from 'react';

import ForgotPasswordComponent from '../components/ForgotPasswordComponent';

const ForgotPassword = ({ setProgress }) => {
  return (
    <div>
        <ForgotPasswordComponent setProgress={setProgress} />
    </div>
  );
};

export default ForgotPassword;