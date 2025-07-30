import { OTP_LENGTH  } from "@/constants/generalConstants";
import { OTPFieldProps } from "@/constants/interfaces";
import { useEffect, useRef, useState } from "react";

export default function OTPField({
    onComplete,
    onOtpChange,
    disabled = false,
    error = false,
    className = ''
}: OTPFieldProps) {
    const otpLength = OTP_LENGTH;
    const [otp, setOtp] = useState<string[]>(new Array(otpLength).fill(''))
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
     // Initialize refs array based on OTP length
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, otpLength)
    }, [otpLength])

    // Reset OTP when length changes
    useEffect(() => {
        setOtp(new Array(otpLength).fill(''))
    }, [otpLength])
    // Handle input change
    const handleChange = (index: number, value: string) => {
        // Only allow single digits (0-9)
        if (value.length > 1) return
        if (value !== '' && (!/^\d$/.test(value))) return

        const newOtp = [...otp]
        newOtp[index] = value

        setOtp(newOtp)

        // Call onOtpChange callback if provided
        const otpString = newOtp.join('')
        onOtpChange?.(otpString)

        // Auto-focus next input if current input is filled
        if (value !== '' && index < otpLength - 1) {
        inputRefs.current[index + 1]?.focus()
        }

        // Call onComplete when all fields are filled
        if (otpString.length === otpLength && !otpString.includes('')) {
            onComplete(otpString)
        }
    }

    // Handle key down events
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace - move to previous input if current is empty
        if (e.key === 'Backspace') {
        if (otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus()
        } else {
            // Clear current field
            const newOtp = [...otp]
            newOtp[index] = ''
            setOtp(newOtp)
            onOtpChange?.(newOtp.join(''))
        }
        }
        
        // Handle arrow keys
        if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus()
        }
        if (e.key === 'ArrowRight' && index < otpLength - 1) {
        inputRefs.current[index + 1]?.focus()
        }

        // Prevent non-numeric input
        if (!/^\d$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
            e.preventDefault()
        }
    }

    // Handle paste event
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pasteData = e.clipboardData.getData('text/plain')
        
        // Only process if pasted data contains only digits
        if (!/^\d+$/.test(pasteData)) return
        
        // Take only the required number of digits
        const digits = pasteData.slice(0, otpLength).split('')
        const newOtp = new Array(otpLength).fill('')
        
        digits.forEach((digit, index) => {
            if (index < otpLength) {
                newOtp[index] = digit
            }
        })
        
        setOtp(newOtp)
        onOtpChange?.(newOtp.join(''))
        
        // Focus the next empty field or the last field
        const nextEmptyIndex = newOtp.findIndex(val => val === '')
        const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : otpLength - 1
        inputRefs.current[focusIndex]?.focus()
        
        // Check if complete
        const otpString = newOtp.join('')
        if (otpString.length === otpLength && !otpString.includes('')) {
            onComplete(otpString)
        }
    }

    // Clear all fields
    const clearOtp = () => {
        setOtp(new Array(otpLength).fill(''))
        onOtpChange?.('')
        inputRefs.current[0]?.focus()
    }

    // Get responsive grid classes based on OTP length
    const getGridClasses = () => {
        if (otpLength <= 6) return 'grid-cols-4 sm:grid-cols-6'
        if (otpLength <= 8) return 'grid-cols-4 sm:grid-cols-8'
        if (otpLength <= 12) return 'grid-cols-6 sm:grid-cols-12'
        return 'grid-cols-6 sm:grid-cols-10 lg:grid-cols-12'
    }

    // Get input size classes based on OTP length
    const getInputSizeClasses = () => {
        if (otpLength <= 6) return 'w-12 h-12 text-lg'
        if (otpLength <= 12) return 'w-10 h-10 text-base'
        return 'w-8 h-8 text-sm'
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* OTP Input Grid */}
            <div className={`grid gap-2 ${getGridClasses()} justify-center`}>
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={disabled}
                        className={`
                        ${getInputSizeClasses()}
                        bg-white/10 
                        border-2 
                        ${error ? 'border-red-400/50' : 'border-white/20'} 
                        rounded-xl 
                        text-center 
                        text-white 
                        font-semibold 
                        backdrop-blur-sm 
                        focus:outline-none 
                        focus:ring-2 
                        focus:ring-blue-500/50 
                        focus:border-blue-400/50 
                        transition-all 
                        duration-200 
                        hover:bg-white/15
                        disabled:opacity-50 
                        disabled:cursor-not-allowed
                        ${digit !== '' ? 'border-blue-400/70 bg-white/15' : ''}
                        `}
                        placeholder="0"
                    />
                ))}
            </div>

            {/* Helper Text and Clear Button */}
            <div className="flex items-center justify-between text-sm">
                <p className="text-white/60">
                    Enter {otpLength}-digit OTP
                </p>
                
                {otp.some(digit => digit !== '') && (
                    <button
                        type="button"
                        onClick={clearOtp}
                        disabled={disabled}
                        className="text-blue-300 hover:text-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Progress Indicator */}
            <div className="flex space-x-1">
                {otp.map((digit, index) => (
                    <div
                        key={index}
                        className={`
                        h-1 
                        flex-1 
                        rounded-full 
                        transition-colors 
                        duration-200
                        ${digit !== '' 
                            ? (error ? 'bg-red-400' : 'bg-blue-400') 
                            : 'bg-white/20'
                        }
                        `}
                    />
                ))}
            </div>
        </div>
    )
}