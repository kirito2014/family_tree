"use client";

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
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
    
    // Load Data on Mount
    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = async () => {
        // Parallel fetch for speed
        const [fetchedMembers, fetchedConnections] = await Promise.all([
            dbService.getMembers(),
            dbService.getConnections()
        ]);
        setMembers(fetchedMembers);
        setConnections(fetchedConnections);
        setLoading(false);
    };

    const handleSelectMember = (id: string) => {
        setSelectedMemberId(id);
    };

    // --- CRUD Operations ---

    const handleSaveMember = async (member: FamilyMember) => {
        // Optimistic UI Update (optional, but good for UX)
        // For now, we rely on refreshData to keep it simple and consistent with DB
        
        if (member.isSelf) {
            // DB handles the logic of unsetting others via server action, 
            // but we can update local state to reflect it if we wanted to avoid a refresh.
        }

        const existing = members.find(m => m.id === member.id);
        if (existing) {
            await dbService.updateMember(member);
        } else {
            await dbService.addMember(member);
        }
        
        setIsMemberModalOpen(false);
        setEditingMember(null);
        await refreshData();
    };

    const handleDeleteMember = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this member? This will also remove connected lines.")) {
            await dbService.deleteMember(id);
            if (selectedMemberId === id) setSelectedMemberId(null);
            await refreshData();
        }
    };

    const handleEditMemberRequest = (member: FamilyMember) => {
        setEditingMember(member);
        setIsMemberModalOpen(true);
    };

    const handleDataChange = async () => {
        // This is triggered by TreeView drag/drop and connection changes
        // We re-fetch to ensure sync with DB
        // For performance in a real app, we might use React Query or SWR
        await refreshData();
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark text-primary">
                <span className="material-symbols-outlined text-4xl animate-spin">autorenew</span>
            </div>
        );
    }

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
                        onDataChange={handleDataChange}
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
                    // Pass full data sets to sidebar for relationship calculation
                    members={members}
                    connections={connections}
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
