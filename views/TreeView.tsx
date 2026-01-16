import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FamilyMember, Connection, HandleType } from '../types';
import { dbService } from '../services/dbService';
import { translations } from '../locales';
import EditMemberModal from '../components/EditMemberModal';
import EditConnectionModal from '../components/EditConnectionModal';

interface TreeViewProps {
    selectedId: string | null;
    onSelect: (id: string) => void;
    showChinese: boolean;
}

const CARD_WIDTH = 260; 
const CARD_HEIGHT = 100;

const TreeView: React.FC<TreeViewProps> = ({ selectedId, onSelect, showChinese }) => {
    const lang = showChinese ? 'zh' : 'en';
    const t = translations[lang];

    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isLocked, setIsLocked] = useState(true);
    
    // Interaction States
    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
    const [connectingStart, setConnectingStart] = useState<{id: string, handle: HandleType} | null>(null);
    const [tempLineEnd, setTempLineEnd] = useState<{x: number, y: number} | null>(null);

    // Modals
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
    const [isConnModalOpen, setIsConnModalOpen] = useState(false);
    const [editingConnection, setEditingConnection] = useState<Connection | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const isCanvasDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    // Initial Load
    useEffect(() => {
        const m = dbService.getMembers();
        const c = dbService.getConnections();
        setMembers(m);
        setConnections(c);
        centerOnSelf(m);
    }, []);

    const centerOnSelf = (currentMembers = members) => {
        const self = currentMembers.find(m => m.isSelf);
        if (self && containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            // Center the self node
            setOffset({
                x: (width / 2) - self.x * scale,
                y: (height / 2) - self.y * scale
            });
        }
    };

    // Calculate Anchor Point coordinates on the card
    const getHandlePosition = (x: number, y: number, handle: HandleType) => {
        const cx = x; // Top-Left of card
        const cy = y;
        switch(handle) {
            case 'top': return { x: cx + CARD_WIDTH/2, y: cy };
            case 'right': return { x: cx + CARD_WIDTH, y: cy + CARD_HEIGHT/2 };
            case 'bottom': return { x: cx + CARD_WIDTH/2, y: cy + CARD_HEIGHT };
            case 'left': return { x: cx, y: cy + CARD_HEIGHT/2 };
        }
    };

    // Advanced Path Generation with Orthogonal Exit/Entry
    const generatePath = (
        startX: number, startY: number, startHandle: HandleType,
        endX: number, endY: number, endHandle: HandleType
    ) => {
        const dist = Math.abs(endX - startX) + Math.abs(endY - startY);
        const controlDist = Math.min(200, Math.max(50, dist * 0.4));

        const getControl = (x: number, y: number, h: HandleType, d: number) => {
            switch(h) {
                case 'top': return { x, y: y - d };
                case 'bottom': return { x, y: y + d };
                case 'left': return { x: x - d, y };
                case 'right': return { x: x + d, y };
            }
        };

        const cp1 = getControl(startX, startY, startHandle, controlDist);
        const cp2 = getControl(endX, endY, endHandle, controlDist);

        return `M ${startX} ${startY} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${endX} ${endY}`;
    };

    // --- Interaction Handlers ---

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!e.target || (e.target as HTMLElement).closest('.node-card')) return;
        isCanvasDragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        lastPos.current = { x: e.clientX, y: e.clientY };

        if (draggingNodeId && !isLocked) {
            setMembers(prev => prev.map(m => 
                m.id === draggingNodeId 
                ? { ...m, x: m.x + (dx / scale), y: m.y + (dy / scale) }
                : m
            ));
        } else if (connectingStart) {
            // Update temp line end
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const mx = (e.clientX - rect.left - offset.x) / scale;
                const my = (e.clientY - rect.top - offset.y) / scale;
                setTempLineEnd({ x: mx, y: my });
            }
        } else if (isCanvasDragging.current) {
            setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        }
    };

    const handleMouseUp = () => {
        if (draggingNodeId) {
            // Save final position to DB
            const member = members.find(m => m.id === draggingNodeId);
            if (member) dbService.updateMember(member);
            setDraggingNodeId(null);
        }
        setConnectingStart(null);
        setTempLineEnd(null);
        isCanvasDragging.current = false;
    };

    // Handle Connection Logic
    const onHandleMouseDown = (e: React.MouseEvent, id: string, handle: HandleType) => {
        e.stopPropagation();
        if (isLocked) return;
        setConnectingStart({ id, handle });
    };

    const onHandleMouseUp = (e: React.MouseEvent, targetId: string, targetHandle: HandleType) => {
        e.stopPropagation();
        if (connectingStart && connectingStart.id !== targetId) {
            // Create Connection
            const newConn: Connection = {
                id: crypto.randomUUID(),
                sourceId: connectingStart.id,
                targetId,
                sourceHandle: connectingStart.handle,
                targetHandle,
                label: 'Relation',
                labelZh: '关系'
            };
            dbService.addConnection(newConn);
            setConnections(prev => [...prev, newConn]);
        }
        setConnectingStart(null);
        setTempLineEnd(null);
    };

    // Data Management Handlers
    const handleSaveMember = (member: FamilyMember) => {
        // Handle "Is Self" Logic - unset others if this is self
        if (member.isSelf) {
            const others = members.filter(m => m.isSelf && m.id !== member.id);
            others.forEach(m => {
                m.isSelf = false;
                dbService.updateMember(m);
            });
            setMembers(prev => prev.map(m => m.id === member.id ? member : { ...m, isSelf: false }));
        }

        const existing = members.find(m => m.id === member.id);
        if (existing) {
            dbService.updateMember(member);
            setMembers(prev => prev.map(m => m.id === member.id ? member : m));
        } else {
            // New Member: Place in center of screen if X/Y not set properly
            if (member.x === 0 && member.y === 0 && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                member.x = (-offset.x + rect.width/2) / scale;
                member.y = (-offset.y + rect.height/2) / scale;
            }
            dbService.addMember(member);
            setMembers(prev => [...prev, member]);
        }
        setIsMemberModalOpen(false);
        setEditingMember(null);
    };

    const handleSaveConnection = (conn: Connection) => {
        dbService.updateConnection(conn);
        setConnections(prev => prev.map(c => c.id === conn.id ? conn : c));
        setIsConnModalOpen(false);
        setEditingConnection(null);
    };

    const handleDeleteConnection = (id: string) => {
        dbService.deleteConnection(id);
        setConnections(prev => prev.filter(c => c.id !== id));
    };

    // --- Empty State ---
    if (members.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-6">
                <div className="text-center space-y-6 max-w-md">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary">
                        <span className="material-symbols-outlined text-5xl">forest</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.emptyStateTitle}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{t.emptyStateDesc}</p>
                    </div>
                    <button 
                        onClick={() => { setEditingMember(null); setIsMemberModalOpen(true); }}
                        className="px-8 py-3 bg-primary hover:bg-primary-dark text-slate-900 font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105"
                    >
                        {t.addCenterMember}
                    </button>
                </div>
                <EditMemberModal 
                    isOpen={isMemberModalOpen} 
                    onClose={() => setIsMemberModalOpen(false)} 
                    onSave={handleSaveMember}
                    lang={lang}
                    member={{ id: crypto.randomUUID(), name: '', role: 'Me', x: 0, y: 0, gender: 'male', avatar: 'https://picsum.photos/200', isSelf: true } as FamilyMember}
                />
            </div>
        );
    }

    return (
        <div 
            className="flex-1 relative overflow-hidden bg-background-light dark:bg-background-dark cursor-grab active:cursor-grabbing h-full selection:bg-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            ref={containerRef}
        >
            {/* Grid */}
            <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark bg-grid opacity-40 pointer-events-none"></div>

            <div 
                className="absolute inset-0 transform-gpu transition-transform duration-75 origin-top-left"
                style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
            >
                {/* SVG Connections Layer */}
                <svg className="absolute top-0 left-0 overflow-visible z-0" style={{ width: 1, height: 1 }}>
                    {/* Existing Connections */}
                    {connections.map((conn) => {
                        const source = members.find(m => m.id === conn.sourceId);
                        const target = members.find(m => m.id === conn.targetId);
                        if (!source || !target) return null;

                        const start = getHandlePosition(source.x, source.y, conn.sourceHandle);
                        const end = getHandlePosition(target.x, target.y, conn.targetHandle);
                        const path = generatePath(start.x, start.y, conn.sourceHandle, end.x, end.y, conn.targetHandle);
                        
                        // Center label
                        const midX = (start.x + end.x) / 2;
                        const midY = (start.y + end.y) / 2;

                        return (
                            <g key={conn.id} className="group cursor-pointer" onClick={(e) => { e.stopPropagation(); setEditingConnection(conn); setIsConnModalOpen(true); }}>
                                <path 
                                    d={path}
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth={4}
                                    className="dark:stroke-gray-700 transition-colors group-hover:stroke-primary/50"
                                />
                                <path 
                                    d={path}
                                    fill="none"
                                    stroke="#80ec13"
                                    strokeWidth={2}
                                />
                                {/* Label Bubble */}
                                <foreignObject x={midX - 40} y={midY - 12} width={80} height={24}>
                                    <div className="flex items-center justify-center px-2 py-0.5 bg-white dark:bg-gray-800 border border-primary/30 rounded-full shadow-sm text-[10px] font-bold text-center truncate select-none hover:scale-110 transition-transform">
                                        {showChinese && conn.labelZh ? conn.labelZh : conn.label}
                                    </div>
                                </foreignObject>
                            </g>
                        );
                    })}

                    {/* Temporary Dragging Line */}
                    {connectingStart && tempLineEnd && (
                        <path 
                            d={`M ${getHandlePosition(
                                members.find(m => m.id === connectingStart.id)!.x, 
                                members.find(m => m.id === connectingStart.id)!.y, 
                                connectingStart.handle
                            ).x} ${getHandlePosition(
                                members.find(m => m.id === connectingStart.id)!.x, 
                                members.find(m => m.id === connectingStart.id)!.y, 
                                connectingStart.handle
                            ).y} L ${tempLineEnd.x} ${tempLineEnd.y}`}
                            fill="none"
                            stroke="#80ec13"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                        />
                    )}
                </svg>

                {/* Nodes Layer */}
                {members.map((node) => (
                    <div 
                        key={node.id}
                        className={`absolute node-card group ${isLocked ? '' : 'cursor-move'}`}
                        style={{ 
                            transform: `translate(${node.x}px, ${node.y}px)`,
                            width: CARD_WIDTH,
                            height: CARD_HEIGHT
                        }}
                        onMouseDown={(e) => { e.stopPropagation(); if(!isLocked) setDraggingNodeId(node.id); }}
                        onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
                    >
                        {/* Connection Handles (Visible on Hover or when connecting) */}
                        {!isLocked && (['top', 'right', 'bottom', 'left'] as HandleType[]).map(handle => (
                            <div 
                                key={handle}
                                className={`
                                    absolute w-4 h-4 bg-white dark:bg-gray-800 border-2 border-primary rounded-full z-30 cursor-crosshair
                                    transition-all hover:scale-150 hover:bg-primary
                                    ${handle === 'top' ? '-top-2 left-1/2 -translate-x-1/2' : ''}
                                    ${handle === 'right' ? '-right-2 top-1/2 -translate-y-1/2' : ''}
                                    ${handle === 'bottom' ? '-bottom-2 left-1/2 -translate-x-1/2' : ''}
                                    ${handle === 'left' ? '-left-2 top-1/2 -translate-y-1/2' : ''}
                                    ${connectingStart ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'}
                                `}
                                onMouseDown={(e) => onHandleMouseDown(e, node.id, handle)}
                                onMouseUp={(e) => onHandleMouseUp(e, node.id, handle)}
                                title={t.connectPrompt}
                            />
                        ))}

                        {/* Card Content */}
                        <div className={`
                            w-full h-full p-4 rounded-xl flex items-center gap-4 transition-all select-none
                            ${selectedId === node.id 
                                ? 'bg-card-light dark:bg-card-dark backdrop-blur-md ring-2 ring-primary shadow-xl border-primary' 
                                : 'bg-card-light dark:bg-card-dark backdrop-blur-md border border-white/50 dark:border-white/10 shadow-lg hover:border-primary/50'
                            }
                        `}>
                            <div className="relative">
                                <div 
                                    className="w-14 h-14 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-700 shadow-sm pointer-events-none"
                                    style={{backgroundImage: `url('${node.avatar}')`}}
                                ></div>
                                {node.isSelf && (
                                     <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 bg-primary rounded-full border-2 border-white dark:border-gray-800 text-[10px] font-bold text-slate-900" title="Me">
                                        M
                                     </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 text-left pointer-events-none">
                                <h3 className="text-slate-900 dark:text-white font-bold truncate">
                                    {showChinese && node.nameZh ? node.nameZh : node.name}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {node.birthDate || 'Unknown'}
                                </p>
                                <span className="inline-block mt-1 text-[10px] uppercase tracking-wider text-gray-400">{node.role}</span>
                            </div>
                            
                            {/* Quick Actions */}
                            {!isLocked && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setEditingMember(node); setIsMemberModalOpen(true); }}
                                    className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-gray-400 hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
                 <div className="flex items-center gap-2 p-2 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10">
                    <button 
                        onClick={() => setIsLocked(!isLocked)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${isLocked ? 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/10' : 'text-primary bg-primary/10 ring-2 ring-primary/20'}`}
                        title={isLocked ? t.unlock : t.lock}
                    >
                        <span className="material-symbols-outlined">{isLocked ? 'lock' : 'lock_open'}</span>
                    </button>
                     <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    <button 
                        onClick={() => centerOnSelf()}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors"
                        title={t.centerOnMe}
                    >
                         <span className="material-symbols-outlined">my_location</span>
                    </button>
                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    <button 
                        onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors"
                    >
                        <span className="material-symbols-outlined">remove</span>
                    </button>
                    <div className="px-2 text-sm font-semibold text-gray-600 dark:text-gray-300 min-w-[3rem] text-center">
                        {Math.round(scale * 100)}%
                    </div>
                    <button 
                        onClick={() => setScale(s => Math.min(2, s + 0.1))}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors"
                    >
                        <span className="material-symbols-outlined">add</span>
                    </button>
                </div>
            </div>

            {/* Add Member FAB */}
            <div className="absolute bottom-40 right-8 z-20 flex flex-col gap-4 items-end">
                <button 
                    onClick={() => { setEditingMember(null); setIsMemberModalOpen(true); }}
                    className="w-16 h-16 bg-primary hover:bg-primary-dark text-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(128,236,19,0.3)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
                    title={t.addMember}
                >
                    <span className="material-symbols-outlined text-3xl">add</span>
                </button>
            </div>

            {/* Modals */}
            <EditMemberModal 
                isOpen={isMemberModalOpen}
                onClose={() => setIsMemberModalOpen(false)}
                onSave={handleSaveMember}
                member={editingMember}
                lang={lang}
            />
            <EditConnectionModal
                isOpen={isConnModalOpen}
                onClose={() => setIsConnModalOpen(false)}
                onSave={handleSaveConnection}
                onDelete={handleDeleteConnection}
                connection={editingConnection}
                lang={lang}
            />
        </div>
    );
};

export default TreeView;