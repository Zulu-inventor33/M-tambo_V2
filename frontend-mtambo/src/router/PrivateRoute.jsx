import React from "react";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthenticationContext";

const PrivateRoute = () => {
    const { user, token, loading } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    // This useEffect ensures the loading state is set after the user is initialized
    useEffect(() => {
        if (!loading) {
            setIsLoading(false);
        }
    }, [loading]);

    // If still loading user data, show nothing or a loading spinner
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // If there's no user or no token, redirect to login page
    if (!user || !token) {
        return <Navigate to="/login" />;
    }

    // If user and token are present, allow access to the route
    return <Outlet />;
};

export default PrivateRoute;