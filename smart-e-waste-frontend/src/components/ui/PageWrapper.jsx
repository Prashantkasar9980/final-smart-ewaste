const PageWrapper = ({ children }) => {
    return (
        <div className="max-w-7xl mx-auto px-8 py-10">
            {children}
        </div>
    );
};

export default PageWrapper;