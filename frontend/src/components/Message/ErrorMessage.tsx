import SVGComponent from "../svg"

interface ErrorMessageProps {
    errors: string[]
}

export default function ErrorMessage({ errors }: ErrorMessageProps) {
    if (errors.length === 0) return null

    return (
        <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start space-x-2">
                {/* <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg> */}
                <SVGComponent 
                    svgType={"errorCircle"}
                    className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                />
                <div>
                    {errors.length === 1 ? (
                        <p className="text-red-200 text-sm">{errors[0]}</p>
                    ) : (
                        <ul className="text-red-200 text-sm space-y-1">
                            {errors.map((error, index) => (
                                <li key={index}>• {error}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}