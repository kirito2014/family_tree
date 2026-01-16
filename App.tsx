import React, { useState, useEffect } from 'react';
import { ViewMode, FamilyMember, Connection } from './types';
import { dbService } from './services/dbService';
import Navbar from './components/Navbar';
import TreeView from './views/TreeView';
import DirectoryView from './views/DirectoryView';
import SettingsView from './views/SettingsView';
import ProfileSidebar from './components/ProfileSidebar';
import Timeline from './components/Timeline';
import EditMemberModal from './components/EditMemberModal';
import EditConnectionModal from './components/EditConnectionModal';

const App: React.FC = () => {
    const [currentView, setView] = useState<ViewMode>('tree');
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const [showChineseNames, setShowChineseNames] = useState(false);

    // Global Data State
    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);

    // Modal State
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
    
    // Connection Modal State (Mostly triggered from TreeView, but kept close to root usually, 
    // though TreeView handles its own connection drag interactions, so connection modal is primarily driven by TreeView.
    // However, to keep consistency, we can allow App to refresh data).

    // Load Data on Mount
    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        setMembers(dbService.getMembers());
        setConnections(dbService.getConnections());
    };

    const handleSelectMember = (id: string) => {
        setSelectedMemberId(id);
    };

    // --- CRUD Operations ---

    const handleSaveMember = (member: FamilyMember) => {
        if (member.isSelf) {
            // Unset other selfs
            const others = members.filter(m => m.isSelf && m.id !== member.id);
            others.forEach(m => {
                m.isSelf = false;
                dbService.updateMember(m);
            });
        }

        const existing = members.find(m => m.id === member.id);
        if (existing) {
            dbService.updateMember(member);
        } else {
            dbService.addMember(member);
        }
        
        setIsMemberModalOpen(false);
        setEditingMember(null);
        refreshData();
    };

    const handleDeleteMember = (id: string) => {
        if (window.confirm("Are you sure you want to delete this member? This will also remove connected lines.")) {
            dbService.deleteMember(id);
            if (selectedMemberId === id) setSelectedMemberId(null);
            refreshData();
        }
    };

    const handleEditMemberRequest = (member: FamilyMember) => {
        setEditingMember(member);
        setIsMemberModalOpen(true);
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
                        members={members}
                        connections={connections}
                        onDataChange={refreshData}
                        onEditMember={handleEditMemberRequest}
                    />
                )}
                
                {currentView === 'directory' && (
                    <DirectoryView 
                        onSelect={handleSelectMember} 
                        showChinese={showChineseNames}
                        members={members}
                    />
                )}

                {currentView === 'settings' && (
                    <SettingsView />
                )}
            </main>

            {/* Global Components */}
            {selectedMemberId && (
                <ProfileSidebar 
                    member={members.find(m => m.id === selectedMemberId) || null} 
                    onClose={() => setSelectedMemberId(null)}
                    onSelectMember={handleSelectMember}
                    showChinese={showChineseNames}
                    onEdit={() => {
                        const m = members.find(x => x.id === selectedMemberId);
                        if (m) handleEditMemberRequest(m);
                    }}
                    onDelete={() => handleDeleteMember(selectedMemberId)}
                />
            )}

            {currentView === 'tree' && <Timeline />}

            {/* Modals placed at App level ensures they work from Sidebar OR Tree */}
            <EditMemberModal 
                isOpen={isMemberModalOpen}
                onClose={() => setIsMemberModalOpen(false)}
                onSave={handleSaveMember}
                member={editingMember}
                lang={showChineseNames ? 'zh' : 'en'}
            />
        </div>
    );
};

export default App;