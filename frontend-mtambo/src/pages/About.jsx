import React, { useEffect } from 'react';

const About = ({ setProgress }) => {
	useEffect(() => {
		setProgress(40);
		setTimeout(() => {
			setProgress(100);
		}, 800)
	}, [])
    
	return (
		<div>
            <h2>About Page</h2>
		</div>
	);
};

export default About;