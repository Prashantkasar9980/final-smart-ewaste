const Card = ({ children, className = "" }) => {
    return (
        <div
            className={`bg-card border border-borderColor rounded-xl shadow-card p-6 ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;