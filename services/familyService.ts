import { dbService } from './dbService';

export const getMember = (id: string) => {
    return dbService.getMembers().find(m => m.id === id);
};

// Simplified relative fetcher for the sidebar
export const getImmediateFamily = (memberId: string) => {
    const connections = dbService.getConnections();
    const members = dbService.getMembers();
    const family: any[] = [];

    connections.forEach(conn => {
        if (conn.sourceId === memberId) {
            const target = members.find(m => m.id === conn.targetId);
            if (target) family.push({ relation: conn.label, member: target });
        } else if (conn.targetId === memberId) {
            const source = members.find(m => m.id === conn.sourceId);
            if (source) family.push({ relation: "Linked by " + conn.label, member: source });
        }
    });

    return family;
};