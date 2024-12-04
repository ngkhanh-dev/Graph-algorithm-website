function CustomNode({ size, label }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            xmlns="https://www.w3.org/TR/SVG/"
        >
            {/* Circle node */}
            <circle
                cx="50"
                cy="50"
                r="40"
                fill="lightblue"
                stroke="black"
                strokeWidth="2"
            />
            {/* Number label */}
            <text
                x="50"
                y="50"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="20"
                fill="black"
            >
                {label}
            </text>
        </svg>
    );
}

export default CustomNode;
