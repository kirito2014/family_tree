import React from 'react';
import { ViewMode } from '../types';
import { translations } from '../locales';
import { dbService } from '../services/dbService';

interface NavbarProps {
    currentView: ViewMode;
    setView: (view: ViewMode) => void;
    showChinese: boolean;
    setShowChinese: (show: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, showChinese, setShowChinese }) => {
    const t = translations[showChinese ? 'zh' : 'en'];

    const handleExport = () => {
        const sql = dbService.exportAsSql();
        const blob = new Blob([sql], { type: 'text/sql' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `robinson_family_tree_${new Date().toISOString().split('T')[0]}.sql`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/60 dark:bg-black/60 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 text-slate-900 dark:text-white cursor-pointer" onClick={() => setView('tree')}>
                    <div className="p-2 bg-primary/20 rounded-lg text-primary-dark dark:text-primary">
                        <span className="material-symbols-outlined text-2xl">account_tree</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight hidden sm:block">{t.appTitle}</h1>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <nav className="hidden lg:flex items-center gap-2 mr-4">
                    <button 
                        onClick={() => setView('tree')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${currentView === 'tree' ? 'bg-primary/20 text-primary-dark dark:text-primary' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
                    >
                        {t.tree}
                    </button>
                    <button 
                        onClick={() => setView('directory')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${currentView === 'directory' ? 'bg-primary/20 text-primary-dark dark:text-primary' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
                    >
                        {t.directory}
                    </button>
                </nav>
                
                {/* Language Toggle */}
                <button 
                    onClick={() => setShowChinese(!showChinese)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg transition-all"
                    title="Toggle Language"
                >
                    <span className="material-symbols-outlined text-[18px] text-gray-600 dark:text-gray-300">translate</span>
                    <span className="text-xs font-bold font-mono text-gray-700 dark:text-gray-200 w-6 text-center">
                        {showChinese ? 'CN' : 'EN'}
                    </span>
                </button>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-slate-900 rounded-xl text-sm font-bold transition-colors shadow-sm active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">database</span>
                        <span className="hidden xl:inline">{t.export}</span>
                    </button>
                </div>
                
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                
                <div className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-800 shadow-sm cursor-pointer hover:ring-2 hover:ring-primary transition-all" style={{backgroundImage: "url('https://picsum.photos/id/64/200/200')"}}>
                </div>
            </div>
        </header>
    );
};

export default Navbar;