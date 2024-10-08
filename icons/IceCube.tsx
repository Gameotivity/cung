import { IconProps } from "../utils/types";

const PhoBowl: React.FC<IconProps> = ({ size = 24, className = "" }) => {
    const svgSize = `${size}px`;

    // Color variables
    const bowlColor = "#FFFFFF";
    const soupColor = "#FFA07A";
    const noodleColor = "#FFFACD";
    const herbColor = "#90EE90";
    const meatColor = "#CD853F";
    const outlineColor = "#4A4A4A";

    return (
        <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} height={svgSize} width={svgSize}>
            <g id="pho-bowl">
                {/* Bowl */}
                <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12H2Z" fill={bowlColor} stroke={outlineColor} strokeWidth="1.5"/>
                
                {/* Soup */}
                <path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12H3Z" fill={soupColor}/>
                
                {/* Noodles */}
                <path d="M5 13C6.5 15 8.5 14 10 13C11.5 12 13.5 11 15 13C16.5 15 18.5 14 20 13" stroke={noodleColor} strokeWidth="1.5" strokeLinecap="round"/>
                
                {/* Herbs */}
                <circle cx="8" cy="15" r="1" fill={herbColor}/>
                <circle cx="12" cy="14" r="1" fill={herbColor}/>
                <circle cx="16" cy="15" r="1" fill={herbColor}/>
                
                {/* Meat */}
                <path d="M7 16L9 17M15 16L17 17" stroke={meatColor} strokeWidth="1.5" strokeLinecap="round"/>
                
                {/* Chopsticks */}
                <line x1="6" y1="2" x2="8" y2="12" stroke={outlineColor} strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="9" y1="2" x2="11" y2="12" stroke={outlineColor} strokeWidth="1.5" strokeLinecap="round"/>
            </g>
        </svg>
    );
};

export default PhoBowl;