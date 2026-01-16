import { Connection, FamilyMember } from '../types';

// Map of Source-to-Target Label -> Inverse (Target-to-Source) generic classification
// Example: If A -> B is "Son", then B -> A is a "Parent"
const INVERSE_MAP: Record<string, string> = {
    'son': 'parent',
    'daughter': 'parent',
    'child': 'parent',
    'father': 'child',
    'mother': 'child',
    'parent': 'child',
    'brother': 'sibling',
    'sister': 'sibling',
    'sibling': 'sibling',
    'husband': 'wife',
    'wife': 'husband',
    'spouse': 'spouse',
    'ex-husband': 'ex-wife',
    'ex-wife': 'ex-husband',
    'partner': 'partner'
};

const getInverseLabel = (originalLabel: string, sourceMember: FamilyMember): string => {
    const lowerLabel = originalLabel.toLowerCase();
    const genericInverse = INVERSE_MAP[lowerLabel] || 'relative';

    if (genericInverse === 'parent') {
        return sourceMember.gender === 'male' ? 'Father' : 'Mother';
    }
    if (genericInverse === 'child') {
        return sourceMember.gender === 'male' ? 'Son' : 'Daughter';
    }
    if (genericInverse === 'sibling') {
        return sourceMember.gender === 'male' ? 'Brother' : 'Sister';
    }
    // For specific matches like husband/wife, return the map value directly if it exists, else capitalised generic
    if (INVERSE_MAP[lowerLabel]) return INVERSE_MAP[lowerLabel].charAt(0).toUpperCase() + INVERSE_MAP[lowerLabel].slice(1);

    return genericInverse.charAt(0).toUpperCase() + genericInverse.slice(1);
};

/**
 * Calculates the relationship string for a target node relative to the "Self" node.
 * Handles both direct and reverse connections.
 */
export const calculateRelationshipToSelf = (
    targetId: string, 
    members: FamilyMember[], 
    connections: Connection[],
    isChinese: boolean
): string | null => {
    const selfNode = members.find(m => m.isSelf);
    if (!selfNode || selfNode.id === targetId) return null;

    // Build Adjacency List
    // We store { to: string, label: string }
    const adj: Record<string, { to: string, label: string }[]> = {};
    
    connections.forEach(conn => {
        if (!adj[conn.sourceId]) adj[conn.sourceId] = [];
        if (!adj[conn.targetId]) adj[conn.targetId] = [];
        
        const sourceMember = members.find(m => m.id === conn.sourceId);
        const targetMember = members.find(m => m.id === conn.targetId);

        if (!sourceMember || !targetMember) return;

        // 1. Forward Edge: Source -> Target
        // If the label is "Son", it means Target is the Son of Source.
        // So traversal Source -> Target yields "Son".
        adj[conn.sourceId].push({ 
            to: conn.targetId, 
            label: isChinese && conn.labelZh ? conn.labelZh : conn.label 
        });
        
        // 2. Reverse Edge: Target -> Source
        // If the label is "Son" (Target is Son of Source),
        // Then traversal Target -> Source means Source is "Father" (if male) of Target.
        const inverseLabel = isChinese 
            ? "长辈/亲属" // Simplified for Chinese dynamic calculation, ideally needs a similar map
            : getInverseLabel(conn.label, sourceMember);

        // Simple Chinese mapping override for common terms
        let finalInverse = inverseLabel;
        if (isChinese) {
             const mapZh: Record<string, string> = {
                'Son': '父亲', 'Daughter': '父亲', // If source is male
                'Father': '儿子', 'Mother': '儿子', // If source is male
             };
             // A proper Chinese kinship algo is complex, falling back to English logic or basic string
             // For this demo, we will rely on the English calculation and basic translation or user manual input
             // Ideally, Chinese requires specific fields. We will stick to the generated English one or generic.
             finalInverse = "Linked"; // Placeholder for complex CH logic, or reuse English logic translated
             if (inverseLabel === 'Father') finalInverse = '父亲';
             if (inverseLabel === 'Mother') finalInverse = '母亲';
             if (inverseLabel === 'Son') finalInverse = '儿子';
             if (inverseLabel === 'Daughter') finalInverse = '女儿';
             if (inverseLabel === 'Brother') finalInverse = '兄弟';
             if (inverseLabel === 'Sister') finalInverse = '姐妹';
             if (inverseLabel === 'Wife') finalInverse = '妻子';
             if (inverseLabel === 'Husband') finalInverse = '丈夫';
        }

        adj[conn.targetId].push({ 
            to: conn.sourceId, 
            label: finalInverse
        });
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
                // Limit depth
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