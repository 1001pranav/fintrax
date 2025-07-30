import FinTraxLogo from "@/components/logo";
import { APP_NAME } from "@/constants/generalConstants";

export default function LoginHeader() {
    return (
        <div className="text-center mb-8">
            <div className="mb-4">
                <FinTraxLogo />
                    
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome to  
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        &nbsp; {APP_NAME}
                    </span>
                </h1>
                
                <p className="text-white/70 text-lg">
                    Your productivity and financial tracking companion
                </p>
            </div>
        
            <div className="flex items-center justify-center space-x-6 text-sm text-white/60 mb-6">
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Tasks</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Goals</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span>Roadmap</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span>Finance</span>
                </div>
            </div>
        </div>
    )
}