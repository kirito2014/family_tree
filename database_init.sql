-- SQLite Initialization Script
-- Derived from prisma/schema.prisma

-- CreateTable: Member
CREATE TABLE IF NOT EXISTS "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameZh" TEXT,
    "role" TEXT NOT NULL,
    "birthDate" TEXT,
    "deathDate" TEXT,
    "location" TEXT,
    "avatar" TEXT NOT NULL,
    "bio" TEXT,
    "gender" TEXT NOT NULL,
    "isSelf" BOOLEAN NOT NULL DEFAULT 0,
    "x" REAL NOT NULL DEFAULT 0,
    "y" REAL NOT NULL DEFAULT 0,
    "extra" TEXT
);

-- CreateTable: Connection
CREATE TABLE IF NOT EXISTS "Connection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "sourceHandle" TEXT NOT NULL,
    "targetHandle" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "labelZh" TEXT,
    "color" TEXT,
    "lineStyle" TEXT,
    "extra" TEXT,
    CONSTRAINT "Connection_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Connection_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

/*
// --- Prisma Schema Reference ---
// You can copy this content into prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Member {
  id        String   @id
  name      String
  nameZh    String?
  role      String
  birthDate String?
  deathDate String?
  location  String?
  avatar    String
  bio       String?
  gender    String
  isSelf    Boolean  @default(false)
  x         Float    @default(0)
  y         Float    @default(0)
  extra     String?

  connectionsAsSource Connection[] @relation("SourceMember")
  connectionsAsTarget Connection[] @relation("TargetMember")
}

model Connection {
  id           String  @id
  sourceId     String
  targetId     String
  sourceHandle String
  targetHandle String
  label        String
  labelZh      String?
  color        String?
  lineStyle    String?
  extra        String?

  source Member @relation("SourceMember", fields: [sourceId], references: [id], onDelete: Cascade)
  target Member @relation("TargetMember", fields: [targetId], references: [id], onDelete: Cascade)
}
*/