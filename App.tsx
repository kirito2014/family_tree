import React, { useState } from 'react';
import { ViewMode } from './types';
import { getMember } from './services/familyService';
import Navbar from './components/Navbar';
import TreeView from './views/TreeView';
import DirectoryView from './views/DirectoryView';
import SettingsView from './views/SettingsView';
import ProfileSidebar from './components/ProfileSidebar';
import Timeline from './components/Timeline';

const App: React.FC = () => {
    const [currentView, setView] = useState<ViewMode>('tree');
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const [showChineseNames, setShowChineseNames] = useState(false);

    const handleSelectMember = (id: string) => {
        setSelectedMemberId(id);
        // Ensure sidebar opens if we select someone in directory
        if (currentView === 'directory' && id) {
            // Optional: Switch to tree to see context? 
            // For now, let's keep view but show sidebar
        }
    };

    return (
        <div className="flex flex-col h-screen w-full relative">
            <Navbar 
                currentView={currentView} 
                setView={setView} 
                showChinese={showChineseNames}
                setShowChinese={setShowChineseNames}
            />
            
            <main className="flex-1 relative flex flex-col h-full overflow-hidden">
                {currentView === 'tree' && (
                    <TreeView 
                        selectedId={selectedMemberId} 
                        onSelect={handleSelectMember} 
                        showChinese={showChineseNames}
                    />
                )}
                
                {currentView === 'directory' && (
                    <DirectoryView 
                        onSelect={handleSelectMember} 
                        showChinese={showChineseNames}
                    />
                )}

                {currentView === 'settings' && (
                    <SettingsView />
                )}
            </main>

            {/* Global Components */}
            {selectedMemberId && (
                <ProfileSidebar 
                    member={getMember(selectedMemberId) || null} 
                    onClose={() => setSelectedMemberId(null)}
                    onSelectMember={handleSelectMember}
                    showChinese={showChineseNames}
                />
            )}

            {currentView === 'tree' && <Timeline />}
        </div>
    );
};

export default App;