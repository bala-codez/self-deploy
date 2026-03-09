export default function AuthBg() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-15" style={{ background: "var(--cyan)" }} />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-15" style={{ background: "var(--violet)" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-5" style={{ background: "var(--cyan)" }} />
        </div>
    );
}