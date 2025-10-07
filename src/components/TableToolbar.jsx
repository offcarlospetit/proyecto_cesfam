// src/components/TableToolbar.jsx
import { useState } from "react";

export default function TableToolbar({
    onSearch,
    placeholder = "Buscar…",
    children,
}) {
    const [q, setQ] = useState("");
    return (
        <div className="mb-3 flex flex-wrap items-center gap-2">
            <input
                value={q}
                onChange={(e) => {
                    const v = e.target.value;
                    setQ(v);
                    onSearch?.(v);
                }}
                placeholder={placeholder}
                className="input max-w-xs"
            />
            {children}
        </div>
    );
}
