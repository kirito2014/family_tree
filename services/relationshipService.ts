import { Connection, FamilyMember } from '../types';

/**
 * Calculates the relationship string for a target node relative to the "Self" node.
 * Uses a BFS to find the shortest path.
 */
export const calculateRelationshipToSelf = (
    targetId: string, 
    members: FamilyMember[], 
    connections: Connection[],
    isChinese: boolean
): string | null => {
    const selfNode = members.find(m => m.isSelf);
    if (!selfNode || selfNode.id === targetId) return null;

    // Build Adjacency List for Graph Traversal
    const adj: Record<string, { to: string, label: string }[]> = {};
    
    connections.forEach(conn => {
        if (!adj[conn.sourceId]) adj[conn.sourceId] = [];
        if (!adj[conn.targetId]) adj[conn.targetId] = [];
        
        // Directional Edge: Source -> Target
        adj[conn.sourceId].push({ 
            to: conn.targetId, 
            label: isChinese ? (conn.labelZh || conn.label) : conn.label 
        });
        
        // Reverse Edge: Target -> Source (We denote this for traversal, 
        // ideally we'd want reciprocal labels like "Son" -> "Father", 
        // but for now we will just show the path as "Linked via...")
        // For simple visualization, we assume arrows point DOWN/OUT from ancestors.
    });

    // BFS
    const queue: { id: string, path: string[] }[] = [{ id: selfNode.id, path: [] }];
    const visited = new Set<string>([selfNode.id]);

    while (queue.length > 0) {
        const { id, path } = queue.shift()!;
        
        if (id === targetId) {
            return path.join(' › ');
        }

        const neighbors = adj[id] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor.to)) {
                visited.add(neighbor.to);
                // Limit depth to prevent massive strings
                if (path.length < 3) {
                    queue.push({ 
                        id: neighbor.to, 
                        path: [...path, neighbor.label] 
                    });
                }
            }
        }
    }

    return null;
};