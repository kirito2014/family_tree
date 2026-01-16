import React, { useState, useEffect } from 'react';
import { Connection, HandleType } from '../types';
import { translations } from '../locales';

interface EditConnectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (conn: Connection) => void;
    onDelete: (id: string) => void;
    connection: Connection | null;
    lang: 'en' | 'zh';
}

const EditConnectionModal: React.FC<EditConnectionModalProps> = ({ isOpen, onClose, onSave, onDelete, connection, lang }) => {
    const t = translations[lang];
    const [formData, setFormData] = useState<Partial<Connection>>({});

    useEffect(() => {
        if (isOpen && connection) {
            setFormData({ ...connection });
        }
    }, [isOpen, connection]);

    if (!isOpen || !connection) return null;

    const handles: HandleType[] = ['top', 'right', 'bottom', 'left'];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Edit Connection</h3>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">{t.connectionLabel}</label>
                        <input 
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
                            value={formData.label || ''}
                            onChange={e => setFormData({...formData, label: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">{t.connectionLabelZh}</label>
                        <input 
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
                            value={formData.labelZh || ''}
                            onChange={e => setFormData({...formData, labelZh: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">{t.sourceHandle}</label>
                            <select 
                                className="w-full px-2 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                                value={formData.sourceHandle}
                                onChange={e => setFormData({...formData, sourceHandle: e.target.value as HandleType})}
                            >
                                {handles.map(h => <option key={h} value={h}>{t[h]}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">{t.targetHandle}</label>
                            <select 
                                className="w-full px-2 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                                value={formData.targetHandle}
                                onChange={e => setFormData({...formData, targetHandle: e.target.value as HandleType})}
                            >
                                {handles.map(h => <option key={h} value={h}>{t[h]}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6 pt-2 flex gap-3">
                     <button 
                        onClick={() => { onDelete(connection.id); onClose(); }} 
                        className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        {t.cancel}
                    </button>
                    <button 
                        onClick={() => onSave(formData as Connection)} 
                        className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-slate-900 rounded-xl font-bold transition-colors"
                    >
                        {t.save}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditConnectionModal;