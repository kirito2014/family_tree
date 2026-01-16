import React, { useState, useEffect } from 'react';
import { FamilyMember } from '../types';
import { translations } from '../locales';

interface EditMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (member: FamilyMember) => void;
    member?: FamilyMember | null;
    lang: 'en' | 'zh';
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ isOpen, onClose, onSave, member, lang }) => {
    const t = translations[lang];
    const [formData, setFormData] = useState<Partial<FamilyMember>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(member ? { ...member } : {
                id: crypto.randomUUID(),
                name: '',
                nameZh: '',
                role: '',
                gender: 'male',
                avatar: `https://picsum.photos/seed/${Date.now()}/200/200`,
                x: 0,
                y: 0,
                isSelf: false
            });
        }
    }, [isOpen, member]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-[fadeIn_0.2s_ease-out]">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                        {member ? t.edit : t.addMember}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">{t.name}</label>
                            <input 
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                value={formData.name || ''}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">{t.nameZh}</label>
                            <input 
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                value={formData.nameZh || ''}
                                onChange={e => setFormData({...formData, nameZh: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">{t.role}</label>
                        <input 
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            value={formData.role || ''}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">{t.birthDate}</label>
                            <input 
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                value={formData.birthDate || ''}
                                placeholder="YYYY"
                                onChange={e => setFormData({...formData, birthDate: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">{t.location}</label>
                            <input 
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                value={formData.location || ''}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="gender" 
                                checked={formData.gender === 'male'} 
                                onChange={() => setFormData({...formData, gender: 'male'})}
                                className="text-primary focus:ring-primary" 
                            />
                            <span className="text-sm">{t.male}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="gender" 
                                checked={formData.gender === 'female'} 
                                onChange={() => setFormData({...formData, gender: 'female'})}
                                className="text-primary focus:ring-primary" 
                            />
                            <span className="text-sm">{t.female}</span>
                        </label>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-center gap-3 p-3 border border-primary/30 bg-primary/5 rounded-xl cursor-pointer hover:bg-primary/10 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={formData.isSelf || false} 
                                onChange={e => setFormData({...formData, isSelf: e.target.checked})}
                                className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300"
                            />
                            <div>
                                <span className="block font-bold text-slate-900 dark:text-white">{t.setAsSelf}</span>
                                <span className="block text-xs text-gray-500">This will center the map on this person initially</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="p-6 pt-2 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        {t.cancel}
                    </button>
                    <button 
                        onClick={() => onSave(formData as FamilyMember)} 
                        className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-slate-900 rounded-xl font-bold transition-colors shadow-lg shadow-primary/20"
                    >
                        {t.save}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditMemberModal;