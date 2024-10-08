import { IconProps } from "../utils/types";

const BanhMi: React.FC<IconProps> = ({ size = 24, className = "" }) => {
    const svgSize = `${size}px`;

    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} height={svgSize} width={svgSize} xmlns="http://www.w3.org/2000/svg">
            <path d="M2 9C2 7.34315 3.34315 6 5 6H19C20.6569 6 22 7.34315 22 9V10C22 11.6569 20.6569 13 19 13H5C3.34315 13 2 11.6569 2 10V9Z" fill="#F4D03F"/>
            <path d="M4 10C4 9.44772 4.44772 9 5 9H19C19.5523 9 20 9.44772 20 10C20 10.5523 19.5523 11 19 11H5C4.44772 11 4 10.5523 4 10Z" fill="#935116"/>
            <path d="M6 13C6 12.4477 6.44772 12 7 12H17C17.5523 12 18 12.4477 18 13C18 13.5523 17.5523 14 17 14H7C6.44772 14 6 13.5523 6 13Z" fill="#27AE60"/>
            <path d="M8 15C8 14.4477 8.44772 14 9 14H15C15.5523 14 16 14.4477 16 15C16 15.5523 15.5523 16 15 16H9C8.44772 16 8 15.5523 8 15Z" fill="#E74C3C"/>
            <path d="M5 16C5 15.4477 5.44772 15 6 15H18C18.5523 15 19 15.4477 19 16C19 16.5523 18.5523 17 18 17H6C5.44772 17 5 16.5523 5 16Z" fill="#8E44AD"/>
        </svg>
    );
};

export default BanhMi;