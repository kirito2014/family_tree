import React from 'react';
import { FamilyMember } from '../types';

interface DirectoryViewProps {
    onSelect: (id: string) => void;
    showChinese: boolean;
    members: FamilyMember[];
}

const DirectoryView: React.FC<DirectoryViewProps> = ({ onSelect, showChinese, members }) => {

    return (
        <div className="flex-1 overflow-y-auto pt-24 pb-40 px-6 md:px-10 bg-background-light dark:bg-background-dark">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
                
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 p-5 rounded-xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Members</p>
                            <span className="material-symbols-outlined text-primary">groups</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{members.length}</p>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {members.map((member) => (
                        <div key={member.id} className="group relative flex flex-col bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
                            <div className="p-6 flex flex-col items-center gap-4 border-b border-gray-50 dark:border-white/5">
                                <div className="size-24 rounded-full bg-cover bg-center border-4 border-white dark:border-gray-700 shadow-sm group-hover:scale-105 transition-transform duration-300" style={{backgroundImage: `url('${member.avatar}')`}}></div>
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {showChinese && member.nameZh ? member.nameZh : member.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 capitalize">
                                        {member.gender}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-4 flex flex-col gap-3 text-sm">
                                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-[18px]">cake</span>
                                    <span>{member.birthDate || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                                    <span>{member.location || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="mt-auto p-4 bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                                <button onClick={() => onSelect(member.id)} className="w-full text-center text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DirectoryView;