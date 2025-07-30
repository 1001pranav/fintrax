import SVGComponent from "../svg";

interface SubmitButtonProps {
    isLoading: boolean,
    loadingText?: string;
    submitText: string;
}

export default function SubmitButton({ isLoading, loadingText, submitText }: SubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
            {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{loadingText}</span>
                </div>
            ) : (
                <div className="flex items-center justify-center space-x-2">
                    <span>{submitText}</span>
                    <SVGComponent 
                        svgType={"right_arrow"}
                    />
                </div>
            )}
        </button>
    )
}
