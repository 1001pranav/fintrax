import {SVGComponentWithChildComponent} from "./svg";

export default function FinTraxLogo() {
    return  (
        <>
            {/* Logo */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl shadow-lg mb-4">
                    <SVGComponentWithChildComponent 
                        svgType={"fintrax"}
                        className="w-8 h-8 text-white"
                    >
                        <text
                            x="14"
                            y="21"
                            fontSize="4"
                            fontWeight="bold"
                            fill="currentColor"
                            textAnchor="middle"
                        >
                            $
                        </text>
                    </SVGComponentWithChildComponent>
                </div>
        </>
    )
}