import React from "react";
import "./CircleIcon.css";

const CircleIcon = ({
    number,
    size = 50,
    bgColor = "#3498db",
    textColor = "#fff",
}) => {
    return (
        <div
            className="circle-icon"
            style={{
                width: size,
                height: size,
                backgroundColor: bgColor,
                color: textColor,
                fontSize: size / 2.5,
            }}
        >
            {number}
        </div>
    );
};

export default CircleIcon;
