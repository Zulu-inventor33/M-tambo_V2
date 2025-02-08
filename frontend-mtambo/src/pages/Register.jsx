import React from 'react';
import RegistrationComponent from '../components/Login_Registration/RegistrationComponent';

const Register = ({ setProgress }) => {
  return (
    <div>
        <RegistrationComponent setProgress={setProgress} />
    </div>
  );
};

export default Register;