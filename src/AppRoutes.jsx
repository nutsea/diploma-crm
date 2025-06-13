import React from "react";
import { Routes, Route } from "react-router-dom";
import { Error } from "./pages/error/Error";
import { CRM } from "./pages/crm/CRM";
import { Profile } from "./pages/profile/Profile";

export const AppRoutes = ({ getAuthCode }) => {
    return (
        <Routes>
            <Route path="/:tab(crm)?" element={<CRM getAuthCode={getAuthCode} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Error />} />
        </Routes>
    )
}