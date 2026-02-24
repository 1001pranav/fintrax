interface FormWrapperProps {
  children: React.ReactNode
}

export default function FormWrapper({ children }: FormWrapperProps) {
    return (
        <div className="relative">
            {/* Glass Card */}
            <div className="backdrop-blur-xl bg-white/10 border  border-gray-300 dark:border-white/20 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                {/* Glass Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent pointer-events-none" />
                
                    {/* Content */}
                    <div className="relative z-10">
                        {children}
                    </div>
                    
                {/* Subtle Inner Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-transparent to-white/5 pointer-events-none" />
            </div>
            
            {/* Subtle Shadow */}
            <div className="absolute inset-0 bg-black/20 rounded-2xl blur-xl -z-10 transform translate-y-2" />
        </div>
    )
}
