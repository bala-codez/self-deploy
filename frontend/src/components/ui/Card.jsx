export default function Card({ children, className = "", style, onClick, ...rest }) {
    return (
        <div
            onClick={onClick}
            className={`rounded-2xl border ${className}`}
            style={{ background: "var(--card)", borderColor: "var(--border)", ...style }}
            {...rest}
        >
            {children}
        </div>
    );
}
