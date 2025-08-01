import { SVG_VALUES } from "@/constants/svgConstant";
import type { SVGProps } from "react";

interface SVGComponentProps extends SVGProps<SVGSVGElement> {
    svgType: keyof typeof SVG_VALUES;
}

export default function SVGComponent({
    svgType,
    className = "w-6 h-6",
    fill = "none",
    stroke = "currentColor",
    viewBox = "0 0 24 24",
    strokeLinecap = "round",
    strokeLinejoin = "round",
    strokeWidth = 2,
    ...rest
}: SVGComponentProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            fill={fill}
            stroke={stroke}
            viewBox={viewBox}
            {...rest}
        >
            <path
                strokeLinecap={strokeLinecap}
                strokeLinejoin={strokeLinejoin}
                strokeWidth={strokeWidth}
                d={SVG_VALUES[svgType]}
            />
        </svg>
    );
}

export function SVGComponentWithChildComponent({
    svgType,
    className = "w-6 h-6",
    fill = "none",
    stroke = "currentColor",
    viewBox = "0 0 24 24",
    strokeLinecap = "round",
    strokeLinejoin = "round",
    strokeWidth = 2,
    children,
    ...rest
}: SVGComponentProps & { children?: React.ReactNode }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            fill={fill}
            stroke={stroke}
            viewBox={viewBox}
            {...rest}
        >
            <path
                strokeLinecap={strokeLinecap}
                strokeLinejoin={strokeLinejoin}
                strokeWidth={strokeWidth}
                d={SVG_VALUES[svgType]}
            />
            {children}
        </svg>
    );
}

