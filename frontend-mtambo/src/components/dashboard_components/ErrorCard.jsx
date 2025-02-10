import React from 'react';

const ErrorCard = () => {
    return (
        <div className="card mb-4">
            <div className="card-body text-center">
                <div className="mb-3" style={{ fontSize: '50px', color: '#d9534f' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-face-id-error">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
                        <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                        <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                        <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
                        <path d="M9 10h.01" />
                        <path d="M15 10h.01" />
                        <path d="M9.5 15.05a3.5 3.5 0 0 1 5 0" />
                    </svg>
                </div>

                <h4>Uh oh! Something went wrong. Try refreshing please.</h4>
                <h6 className='mt-4'>
                    Keep calm and try again. If the error persists, please contact our support team.
                </h6>
            </div>
        </div>
    );
};

export default ErrorCard;