import React from 'react';

const SettingsView: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto pt-24 pb-20 px-6 md:px-10 bg-background-light dark:bg-background-dark">
            <div className="max-w-[960px] mx-auto flex flex-col gap-8 animate-fade-in">
                {/* Header */}
                <div className="flex flex-wrap justify-between gap-4 p-4 items-end">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight">Privacy & Visibility</h1>
                        <p className="text-gray-600 dark:text-gray-400 text-base font-normal max-w-2xl">
                            Manage visual hierarchy, control access permissions, and filter specific branches for your family tree visualization.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center justify-center h-10 px-5 text-sm font-bold bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 transition-colors">
                            Cancel
                        </button>
                        <button className="flex items-center justify-center h-10 px-5 text-sm font-bold bg-primary text-slate-900 rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Depth Slider Card */}
                <section className="rounded-2xl bg-white/70 dark:bg-card-dark backdrop-blur-md border border-white/60 dark:border-white/5 shadow-sm overflow-hidden p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary">
                            <span className="material-symbols-outlined">layers</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Visualization Depth</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Control how many generations are loaded by default.</p>
                        </div>
                    </div>

                    <div className="relative flex w-full flex-col gap-6">
                        <div className="flex w-full items-center justify-between">
                            <p className="text-slate-900 dark:text-white text-lg font-bold">Level 3: Great-Grandparents</p>
                            <div className="px-3 py-1 rounded-full bg-primary/20 text-xs font-bold text-primary-dark dark:text-primary uppercase tracking-wide">62 Profiles Visible</div>
                        </div>
                        
                        <div className="relative w-full h-12 flex items-center group">
                            <div className="absolute w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[60%] rounded-full"></div>
                            </div>
                            <input 
                                type="range" 
                                min="1" 
                                max="5" 
                                defaultValue="3" 
                                className="absolute w-full h-full opacity-0 cursor-pointer z-10" 
                            />
                            {/* Visual Dots */}
                            <div className="absolute w-full flex justify-between px-1 pointer-events-none">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className={`size-4 rounded-full border-2 border-white dark:border-gray-800 transition-all ${i <= 3 ? 'bg-primary scale-110' : 'bg-gray-300 dark:bg-white/20'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Branch Filters */}
                    <section className="rounded-2xl bg-white/70 dark:bg-card-dark backdrop-blur-md border border-white/60 dark:border-white/5 shadow-sm p-6 md:p-8 flex flex-col h-full">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary">
                                <span className="material-symbols-outlined">account_tree</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Branch Filters</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Toggle visibility of specific family lines.</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            {[
                                { title: 'Paternal Side', sub: "Father's ancestors", active: true },
                                { title: 'Maternal Side', sub: "Mother's ancestors", active: true },
                                { title: 'In-Laws & Step-Family', sub: "Connected by marriage", active: false },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between cursor-pointer">
                                    <div className="flex flex-col">
                                        <span className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.sub}</span>
                                    </div>
                                    <div className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${item.active ? 'bg-primary' : 'bg-gray-300 dark:bg-white/20'}`}>
                                        <span className={`inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.active ? 'translate-x-6' : 'translate-x-1'}`}></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Privacy Level */}
                    <section className="rounded-2xl bg-white/70 dark:bg-card-dark backdrop-blur-md border border-white/60 dark:border-white/5 shadow-sm p-6 md:p-8 flex flex-col h-full">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary">
                                <span className="material-symbols-outlined">lock</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Privacy Level</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Who can view your living relatives?</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                             {[
                                { title: 'Public', sub: 'Visible to all users', checked: false },
                                { title: 'Family Members Only', sub: 'Only invited members', checked: true },
                                { title: 'Private', sub: 'Only you', checked: false }
                             ].map((opt, i) => (
                                <label key={i} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${opt.checked ? 'border-primary/50 bg-primary/10' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}>
                                    <input type="radio" name="privacy" defaultChecked={opt.checked} className="mt-1 text-primary focus:ring-primary bg-transparent" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{opt.title}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{opt.sub}</span>
                                    </div>
                                </label>
                             ))}
                        </div>
                    </section>
                </div>

                <section className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-[#1a1a1a] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold">Need more control?</h3>
                        <p className="text-white/70 max-w-lg text-sm">Our Advanced Privacy Shield offers granular control over every single profile in your tree.</p>
                    </div>
                    <button className="whitespace-nowrap px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-bold text-sm transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                        View Advanced Options
                    </button>
                </section>
            </div>
        </div>
    );
};

export default SettingsView;