'use server';

import { prisma } from '../lib/prisma';
import { FamilyMember, Connection } from '../types';

// --- Members ---

export async function getMembersAction(): Promise<FamilyMember[]> {
  const members = await prisma.member.findMany();
  return members.map(m => ({
    ...m,
    gender: m.gender as 'male' | 'female',
    // Ensure standard types match frontend expectation
  }));
}

export async function saveMemberAction(member: FamilyMember) {
  const { id, ...data } = member;
  
  // If setting isSelf=true, we need to unset others first (transactionally would be better, but simplified here)
  if (data.isSelf) {
    await prisma.member.updateMany({
      where: { isSelf: true, id: { not: id } },
      data: { isSelf: false }
    });
  }

  await prisma.member.upsert({
    where: { id },
    update: {
      name: data.name,
      nameZh: data.nameZh,
      role: data.role,
      birthDate: data.birthDate,
      deathDate: data.deathDate,
      location: data.location,
      avatar: data.avatar,
      bio: data.bio,
      gender: data.gender,
      isSelf: data.isSelf,
      x: data.x,
      y: data.y
    },
    create: {
      id,
      name: data.name,
      nameZh: data.nameZh,
      role: data.role,
      birthDate: data.birthDate,
      deathDate: data.deathDate,
      location: data.location,
      avatar: data.avatar,
      bio: data.bio,
      gender: data.gender,
      isSelf: data.isSelf ?? false,
      x: data.x,
      y: data.y
    }
  });
}

export async function deleteMemberAction(id: string) {
  await prisma.member.delete({
    where: { id }
  });
}

// --- Connections ---

export async function getConnectionsAction(): Promise<Connection[]> {
  const connections = await prisma.connection.findMany();
  return connections.map(c => ({
    ...c,
    sourceHandle: c.sourceHandle as any,
    targetHandle: c.targetHandle as any,
    lineStyle: c.lineStyle as any
  }));
}

export async function saveConnectionAction(conn: Connection) {
  const { id, ...data } = conn;
  
  await prisma.connection.upsert({
    where: { id },
    update: {
      sourceId: data.sourceId,
      targetId: data.targetId,
      sourceHandle: data.sourceHandle,
      targetHandle: data.targetHandle,
      label: data.label,
      labelZh: data.labelZh,
      color: data.color,
      lineStyle: data.lineStyle
    },
    create: {
      id,
      sourceId: data.sourceId,
      targetId: data.targetId,
      sourceHandle: data.sourceHandle,
      targetHandle: data.targetHandle,
      label: data.label,
      labelZh: data.labelZh,
      color: data.color,
      lineStyle: data.lineStyle
    }
  });
}

export async function deleteConnectionAction(id: string) {
  await prisma.connection.delete({
    where: { id }
  });
}
