import { FamilyMember, Connection } from '../types';
import { 
  getMembersAction, 
  saveMemberAction, 
  deleteMemberAction, 
  getConnectionsAction, 
  saveConnectionAction, 
  deleteConnectionAction 
} from '../app/actions';

// This service now acts as a bridge to Server Actions
// Note: All methods are now ASYNC

export const dbService = {
  getMembers: async (): Promise<FamilyMember[]> => {
    try {
      return await getMembersAction();
    } catch (e) {
      console.error("Failed to fetch members", e);
      return [];
    }
  },

  addMember: async (member: FamilyMember) => {
    await saveMemberAction(member);
  },

  updateMember: async (member: FamilyMember) => {
    await saveMemberAction(member);
  },

  deleteMember: async (id: string) => {
    await deleteMemberAction(id);
  },

  getConnections: async (): Promise<Connection[]> => {
    try {
      return await getConnectionsAction();
    } catch (e) {
      console.error("Failed to fetch connections", e);
      return [];
    }
  },

  addConnection: async (conn: Connection) => {
    await saveConnectionAction(conn);
  },

  updateConnection: async (conn: Connection) => {
    await saveConnectionAction(conn);
  },

  deleteConnection: async (id: string) => {
    await deleteConnectionAction(id);
  },

  // Export Logic needs to be client-side generated from fetched data, 
  // or moved to a server action that returns the string.
  // For simplicity, we assume the caller has the data or we fetch it here.
  exportAsSql: async () => {
    const members = await getMembersAction();
    const connections = await getConnectionsAction();
    
    let sql = `-- Robinson Family Tree Export\n-- Generated on ${new Date().toISOString()}\n\n`;
    
    sql += `CREATE TABLE IF NOT EXISTS "Member" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT,
      "nameZh" TEXT,
      "role" TEXT,
      "birthDate" TEXT,
      "location" TEXT,
      "avatar" TEXT,
      "bio" TEXT,
      "gender" TEXT,
      "isSelf" BOOLEAN,
      "x" REAL,
      "y" REAL,
      "extra" TEXT
    );\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS "Connection" (
      "id" TEXT PRIMARY KEY,
      "sourceId" TEXT,
      "targetId" TEXT,
      "sourceHandle" TEXT,
      "targetHandle" TEXT,
      "label" TEXT,
      "labelZh" TEXT,
      "color" TEXT,
      "lineStyle" TEXT,
      "extra" TEXT,
      FOREIGN KEY("sourceId") REFERENCES "Member"("id"),
      FOREIGN KEY("targetId") REFERENCES "Member"("id")
    );\n\n`;

    members.forEach(m => {
      sql += `INSERT INTO "Member" ("id", "name", "nameZh", "role", "birthDate", "location", "avatar", "gender", "isSelf", "x", "y") VALUES ('${m.id}', '${m.name.replace(/'/g, "''")}', '${(m.nameZh||'').replace(/'/g, "''")}', '${m.role}', '${m.birthDate||''}', '${m.location||''}', '${m.avatar}', '${m.gender}', ${m.isSelf ? 1 : 0}, ${Math.round(m.x)}, ${Math.round(m.y)});\n`;
    });
    sql += '\n';

    connections.forEach(c => {
      sql += `INSERT INTO "Connection" ("id", "sourceId", "targetId", "sourceHandle", "targetHandle", "label", "labelZh", "color", "lineStyle") VALUES ('${c.id}', '${c.sourceId}', '${c.targetId}', '${c.sourceHandle}', '${c.targetHandle}', '${c.label}', '${c.labelZh||''}', '${c.color||'#e5e7eb'}', '${c.lineStyle||'solid'}');\n`;
    });

    return sql;
  }
};