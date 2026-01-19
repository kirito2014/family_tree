import React from 'react';
import { FamilyMember, Connection } from '../types';
import { getImmediateFamily } from '../services/familyService';

interface ProfileSidebarProps {
    member: FamilyMember | null;
    onClose: () => void;
    onSelectMember: (id: string) => void;
    showChinese: boolean;
    onEdit: () => void;
    onDelete: () => void;
    members: FamilyMember[];
    connections: Connection[];
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
    member, 
    onClose, 
    onSelectMember, 
    showChinese, 
    onEdit, 
    onDelete,
    members,
    connections
}) => {
    if (!member) return null;

    // Now uses passed props instead of synchronous DB access
    const relatives = getImmediateFamily(member.id, members, connections);

    return (
        <aside className="absolute top-24 right-6 bottom-32 w-80 md:w-96 bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-2xl p-6 z-30 flex flex-col animate-[slideIn_0.3s_ease-out]">
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
            
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Details</h2>
                <button onClick={onClose} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-gray-500 text-[20px]">close</span>
                </button>
            </div>

            {/* Header */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full p-1 border-2 border-primary border-dashed mb-3 relative group">
                    <div className="w-full h-full rounded-full bg-cover bg-center" style={{backgroundImage: `url('${member.avatar}')`}}></div>
                    <button 
                        onClick={onEdit}
                        className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full text-slate-900 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {showChinese && member.nameZh ? member.nameZh : member.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                {member.isSelf && (
                     <span className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary-dark dark:text-primary">
                        Center Member (Me)
                    </span>
                )}
            </div>

            {/* Info Grid */}
            <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar pr-1">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-white/40 dark:border-white/5">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Birth Date</p>
                        <p className="font-semibold text-sm">{member.birthDate}</p>
                    </div>
                    <div className="bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-white/40 dark:border-white/5">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
                        <p className="font-semibold text-sm">{member.location}</p>
                    </div>
                </div>

                <div className="bg-white/50 dark:bg-white/5 p-4 rounded-xl border border-white/40 dark:border-white/5">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Biography</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {member.bio || "No biography added."}
                    </p>
                </div>

                <div className="pt-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">family_star</span>
                        Immediate Family
                    </h4>
                    <div className="space-y-2">
                        {relatives.length === 0 && <p className="text-xs text-gray-500">No connections found.</p>}
                        {relatives.map((rel) => (
                            <div 
                                key={rel.member.id}
                                onClick={() => onSelectMember(rel.member.id)}
                                className="flex items-center gap-3 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer group"
                            >
                                <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{backgroundImage: `url('${rel.member.avatar}')`}}></div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                                        {showChinese && rel.member.nameZh ? rel.member.nameZh : rel.member.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{rel.relation}</p>
                                </div>
                                <span className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <button 
                    onClick={onEdit}
                    className="flex-1 bg-slate-900 hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg"
                >
                    Edit Profile
                </button>
                <button 
                    onClick={onDelete}
                    className="w-10 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
            </div>
        </aside>
    );
};

export default ProfileSidebar;
