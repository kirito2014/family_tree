import { FamilyMember, Connection } from '../types';

// Refactored to accept data as arguments, making it synchronous and pure
// This avoids needing to make the UI components async just for simple filtering
export const getImmediateFamily = (memberId: string, members: FamilyMember[], connections: Connection[]) => {
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
