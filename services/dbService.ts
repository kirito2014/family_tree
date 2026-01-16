import { FamilyMember, Connection } from '../types';

// Initial Mock Data
const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: '1',
    name: 'Arthur Robinson',
    nameZh: '亚瑟·罗宾逊',
    role: 'Patriarch',
    birthDate: '1940',
    location: 'London, UK',
    avatar: 'https://picsum.photos/id/1025/200/200',
    gender: 'male',
    x: 500,
    y: 150
  },
  {
    id: '2',
    name: 'John Robinson',
    nameZh: '约翰·罗宾逊',
    role: 'Father',
    birthDate: '1970',
    location: 'New York, USA',
    avatar: 'https://picsum.photos/id/1005/200/200',
    gender: 'male',
    isSelf: true,
    x: 500,
    y: 450
  }
];

const INITIAL_CONNECTIONS: Connection[] = [
  { id: 'c1', sourceId: '1', targetId: '2', sourceHandle: 'bottom', targetHandle: 'top', label: 'Son', labelZh: '儿子' }
];

const STORAGE_KEY_MEMBERS = 'rft_members';
const STORAGE_KEY_CONNECTIONS = 'rft_connections';

export const dbService = {
  getMembers: (): FamilyMember[] => {
    const stored = localStorage.getItem(STORAGE_KEY_MEMBERS);
    return stored ? JSON.parse(stored) : INITIAL_MEMBERS;
  },

  saveMembers: (members: FamilyMember[]) => {
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
  },

  getConnections: (): Connection[] => {
    const stored = localStorage.getItem(STORAGE_KEY_CONNECTIONS);
    return stored ? JSON.parse(stored) : INITIAL_CONNECTIONS;
  },

  saveConnections: (connections: Connection[]) => {
    localStorage.setItem(STORAGE_KEY_CONNECTIONS, JSON.stringify(connections));
  },

  addMember: (member: FamilyMember) => {
    const members = dbService.getMembers();
    members.push(member);
    dbService.saveMembers(members);
  },

  updateMember: (member: FamilyMember) => {
    const members = dbService.getMembers();
    const idx = members.findIndex(m => m.id === member.id);
    if (idx !== -1) {
      members[idx] = member;
      dbService.saveMembers(members);
    }
  },

  deleteMember: (id: string) => {
    let members = dbService.getMembers();
    members = members.filter(m => m.id !== id);
    dbService.saveMembers(members);
    
    // Cascade delete connections
    let connections = dbService.getConnections();
    connections = connections.filter(c => c.sourceId !== id && c.targetId !== id);
    dbService.saveConnections(connections);
  },

  addConnection: (conn: Connection) => {
    const connections = dbService.getConnections();
    connections.push(conn);
    dbService.saveConnections(connections);
  },

  updateConnection: (conn: Connection) => {
    const connections = dbService.getConnections();
    const idx = connections.findIndex(c => c.id === conn.id);
    if (idx !== -1) {
      connections[idx] = conn;
      dbService.saveConnections(connections);
    }
  },

  deleteConnection: (id: string) => {
    let connections = dbService.getConnections();
    connections = connections.filter(c => c.id !== id);
    dbService.saveConnections(connections);
  },

  // Export as SQL compatible with SQLite/Postgres
  exportAsSql: () => {
    const members = dbService.getMembers();
    const connections = dbService.getConnections();
    
    let sql = `-- Robinson Family Tree Export\n-- Generated on ${new Date().toISOString()}\n\n`;
    
    sql += `CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      name TEXT,
      name_zh TEXT,
      role TEXT,
      birth_date TEXT,
      location TEXT,
      avatar TEXT,
      gender TEXT,
      is_self BOOLEAN,
      x INTEGER,
      y INTEGER
    );\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS connections (
      id TEXT PRIMARY KEY,
      source_id TEXT,
      target_id TEXT,
      source_handle TEXT,
      target_handle TEXT,
      label TEXT,
      label_zh TEXT,
      FOREIGN KEY(source_id) REFERENCES members(id),
      FOREIGN KEY(target_id) REFERENCES members(id)
    );\n\n`;

    members.forEach(m => {
      sql += `INSERT INTO members (id, name, name_zh, role, birth_date, location, avatar, gender, is_self, x, y) VALUES ('${m.id}', '${m.name.replace(/'/g, "''")}', '${(m.nameZh||'').replace(/'/g, "''")}', '${m.role}', '${m.birthDate||''}', '${m.location||''}', '${m.avatar}', '${m.gender}', ${m.isSelf ? 1 : 0}, ${Math.round(m.x)}, ${Math.round(m.y)});\n`;
    });
    sql += '\n';

    connections.forEach(c => {
      sql += `INSERT INTO connections (id, source_id, target_id, source_handle, target_handle, label, label_zh) VALUES ('${c.id}', '${c.sourceId}', '${c.targetId}', '${c.sourceHandle}', '${c.targetHandle}', '${c.label}', '${c.labelZh||''}');\n`;
    });

    return sql;
  }
};