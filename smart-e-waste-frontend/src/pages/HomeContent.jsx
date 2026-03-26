import React from "react";
import Home from "../../pages/Home";

const HomeContent = () => {
    return (
        <div className="w-full">
            {/* We only want the body of Home, not its Navbar/Footer */}
            <Home hideNav hideFooter />
        </div>
    );
};

export default HomeContent;
