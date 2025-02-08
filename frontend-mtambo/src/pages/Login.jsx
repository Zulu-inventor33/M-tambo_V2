import React from 'react';
import LoginComponent from '../components/Login_Registration/LoginComponent';

const Login = ({ setProgress }) => {
	return (
		<div>
			<LoginComponent setProgress={setProgress} />
		</div>
	);
};

export default Login;