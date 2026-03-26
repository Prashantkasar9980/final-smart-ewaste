// src/pages/HomeRouter.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/layout/Layout";
import Home from "./Home";

const HomeRouter = () => {
    const { auth } = useContext(AuthContext);

    const roleFromAuth = auth?.role;
    const role = roleFromAuth || localStorage.getItem("authRole");
    const token = auth?.token || localStorage.getItem("authToken");

    // Admins and normal users will see the public Home page (no automatic redirect)
    // They can navigate to their respective dashboards from the Navbar

    // Not logged in or admin -> show public home
    return (
        <Layout>
            <Home />
        </Layout>
    );
};

export default HomeRouter;
