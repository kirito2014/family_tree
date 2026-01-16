import React, { useState } from 'react';

const Timeline: React.FC = () => {
    const [year, setYear] = useState(2024);
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div 
            className={`absolute bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out ${isExpanded ? 'translate-y-0' : 'translate-y-full'}`}
        >
            {/* Toggle Tab */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -top-10 left-6 h-10 px-4 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-t-xl border-t border-x border-white/40 dark:border-white/10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-primary transition-colors z-50 group"
            >
                <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>expand_less</span>
                <span>{isExpanded ? 'Hide Timeline' : 'Timeline'}</span>
            </button>

            {/* Main Bar */}
            <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-white/40 dark:border-white/10 px-6 md:px-8 py-6 shadow-[0_-4px_30px_rgba(0,0,0,0.03)] h-full">
                <div className="max-w-7xl mx-auto w-full flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl">history_toggle_off</span>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Timeline scrubbing</span>
                        </div>
                        <div className="px-3 py-1 bg-primary/20 text-primary-dark dark:text-primary rounded-lg text-sm font-bold font-mono">
                            {year}
                        </div>
                    </div>
                    
                    <div className="relative w-full h-10 flex items-center group">
                        {/* Track Background */}
                        <div className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                             {/* Filled Part */}
                            <div 
                                className="h-full bg-gradient-to-r from-primary/30 via-primary/80 to-primary origin-left"
                                style={{ width: `${((year - 1900) / (2024 - 1900)) * 100}%` }}
                            ></div>
                        </div>
                        
                        {/* Native Range Input for Interaction */}
                        <input 
                            type="range" 
                            min="1900" 
                            max="2024" 
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="absolute w-full h-full opacity-0 cursor-ew-resize z-20"
                        />

                        {/* Custom Thumb Visual (Positioned by JS) */}
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 -ml-4 bg-white dark:bg-gray-800 border-4 border-primary rounded-full shadow-[0_0_15px_rgba(128,236,19,0.5)] pointer-events-none z-10 transition-transform group-hover:scale-110"
                            style={{ left: `${((year - 1900) / (2024 - 1900)) * 100}%` }}
                        >
                             <div className="w-2 h-2 bg-primary rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    </div>

                    <div className="flex justify-between text-xs font-semibold text-gray-400 select-none px-1 tracking-wider uppercase">
                        <span>1900</span>
                        <span>1920</span>
                        <span>1940</span>
                        <span>1960</span>
                        <span>1980</span>
                        <span>2000</span>
                        <span>2020</span>
                        <span>2024</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;