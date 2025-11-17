import { useState } from "react"
import SVGComponent from "../svg"

interface InputFieldProps {
    type: string
    placeholder: string
    label: string
    value: string
    onChange: (value: string) => void
    required?: boolean
    disabled?: boolean
}

export default function InputField({
    type,
    placeholder,
    label,
    value,
    onChange,
    required = false,
    disabled = false,
}: InputFieldProps) {
    const [showPassword, setShowPassword] = useState(false)
    const isPasswordField = type === 'password'
    const inputType = isPasswordField && showPassword ? 'text' : type
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90">
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
            </label>
        
        <div className="relative">
            <input
                type={inputType}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                disabled={disabled}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-200 hover:bg-white/15"
            />
            
            {/* Input Icon */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {
                    type === 'email' && (
                        <SVGComponent
                            svgType={"at"}
                        />
                    )
                }
                {
                    isPasswordField && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-white/60 hover:text-white/90 transition-colors focus:outline-none"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            <SVGComponent
                                svgType={showPassword ? "eyeOff" : "eye"}
                                className="w-5 h-5"
                            />
                        </button>
                    )
                }
                </div>
            </div>
        </div>
    )
}