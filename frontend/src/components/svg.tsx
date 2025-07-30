import { SVG_VALUES } from "@/constants/svgConstant";

interface SVGComponentProps {
    svgType: keyof typeof SVG_VALUES;
    className?: string;
    fill?: string;    
    stroke?: string;
    viewBox?: string;
    strokeLineCap?: "round" | "butt" | "square" | "inherit" ;
    strokeLineJoin?: "round" | "inherit" | "miter" | "bevel" ;
    strokeWidth?: number;
}
/*
    svgType: string,
    className:string | "w-6 h-6" = "w-6 h-6",
    fill: string | "none" = "none",
    stroke: string | "currentColor" = "currentColor",
    viewBox: string | "0 0 24 24" = "0 0 24 24",
    strokeLineCap: "round" | "butt" | "square" | "inherit" | undefined = "round",
    strokeLineJoin:  "round" | "inherit" | "miter" | "bevel" | undefined = "round",
    strokeWidth: number | 2 = 2
*/
export default function SVGComponent(
 {
    svgType,
    className = "w-6 h-6",
    fill = "none",
    stroke = "currentColor",
    viewBox = "0 0 24 24",
    strokeLineCap = "round",
    strokeLineJoin = "round",
    strokeWidth = 2
 }: SVGComponentProps
) {
    return (
        <svg className={className} fill={fill} stroke={stroke} viewBox={viewBox}>
        <path strokeLinecap={strokeLineCap} strokeLinejoin={strokeLineJoin} strokeWidth={strokeWidth} d={SVG_VALUES[svgType]} />
        </svg>
    );
}

export function SVGComponentWithChildComponent(
 {
    svgType,
    className = "w-6 h-6",
    fill = "none",
    stroke = "currentColor",
    viewBox = "0 0 24 24",
    strokeLineCap = "round",
    strokeLineJoin = "round",
    strokeWidth = 2,
    children
 }: SVGComponentProps & { children?: React.ReactNode }
) {
    return (
        <svg className={className} fill={fill} stroke={stroke} viewBox={viewBox}>
            <path strokeLinecap={strokeLineCap} strokeLinejoin={strokeLineJoin} strokeWidth={strokeWidth} d={SVG_VALUES[svgType]} />
            {children}
        </svg>
    );
}
