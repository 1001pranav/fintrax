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
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90">
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
            </label>
        
        <div className="relative">
            <input
                type={type}
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
                    type === 'password' && (
                        <SVGComponent
                            svgType={"lock"}
                        />
                    )
                }
                </div>
            </div>
        </div>
    )
}