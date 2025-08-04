interface PentagramIconProps {
    width?: string;
    height?: string;
    className?: string;
}

const PentagramIcon = ({ width, height = "1em", className }: PentagramIconProps) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 1020 976"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ width: width || "auto" }}
        >
            <path
                d="M272.825 111L890 559.808H129L489.474 297.041L744.691 111L510.998 839L272.825 111Z"
                stroke="currentColor"
                strokeWidth="84"
            />
        </svg>
    );
};

export default PentagramIcon;
