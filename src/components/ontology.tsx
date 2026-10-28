import React, { useState, useEffect, useMemo } from 'react';
import { NetworkNode, NetworkLink, NodeType } from '../types';
import { Network, Link as LinkIcon, Plus, User, FileCode, Shield, Activity, HelpCircle, Layers, Award, ToggleLeft, ToggleRight, Radio, Sliders, RefreshCw, Sparkles, EyeOff, Zap } from 'lucide-react';
import { D3ForceGraph } from './d3_force_graph';

interface OntologyProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  onAddNode: (node: NetworkNode) => void;
  onAddLink: (link: NetworkLink) => void;
  onTriggerAction: (actionName: string, targetNodeId: string) => void;
}

export const OntologyEditor: React.FC<OntologyProps> = ({
  nodes,
  links,
  onAddNode,
  onAddLink,
  onTriggerAction,
}) => {
  const [graphMode, setGraphMode] = useState<'D3_FORCE' | 'KINETIC_GRID'>('D3_FORCE');
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);

  // Form State
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodeType, setNewNodeType] = useState<NodeType>(NodeType.LURE);
  const [newNodeDetails, setNewNodeDetails] = useState('');
  
  const [newLinkSource, setNewLinkSource] = useState('');
  const [newLinkTarget, setNewLinkTarget] = useState('');
  const [newLinkLabel, setNewLinkLabel] = useState('');

  // ----------------------------------------------------
  // Cognitive-Adaptive Deception Layer Setup (Ontology-level)
  // ----------------------------------------------------
  const [tick, setTick] = useState(0);

  // Auto-detect threat if any node is ADVERSARY or status is TRIGGERED Or ISOLATED
  const hasActiveThreat = useMemo(() => {
    return nodes.some(n => n.type === NodeType.ADVERSARY || n.status === 'TRIGGERED' || n.status === 'ISOLATED');
  }, [nodes]);

  const [adaptiveDefenseActive, setAdaptiveDefenseActive] = useState(false);
  const [obfuscationMode, setObfuscationMode] = useState<'DUMMY_CHAFF' | 'POLAR_ROTATION' | 'ENTROPY_SCRAMBLE' | 'COGNITIVE_CLOAK'>('DUMMY_CHAFF');
  const [shiftIntensity, setShiftIntensity] = useState(60); // % intensity

  // Sync if threat changes, but allow manual override
  useEffect(() => {
    if (hasActiveThreat) {
      setAdaptiveDefenseActive(true);
    }
  }, [hasActiveThreat]);

  // RequestAnimationFrame tick generator
  useEffect(() => {
    let animFrame: number;
    const updateTick = () => {
      // speed up tick progression slightly when scrambling is active
      const speed = adaptiveDefenseActive ? (shiftIntensity / 50) : 1;
      setTick(t => (t + speed * 1.5) % 10000);
      animFrame = requestAnimationFrame(updateTick);
    };
    animFrame = requestAnimationFrame(updateTick);
    return () => cancelAnimationFrame(animFrame);
  }, [adaptiveDefenseActive, shiftIntensity]);

  // Scramble utility function to garble/obfuscate links relationship text
  const scrambleText = (str: string) => {
    return str.split('').map((char, idx) => {
      if (char === ' ' || char === ':') return char;
      const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()';
      const charCode = char.charCodeAt(0) + Math.floor(tick * 0.1) + idx;
      return alphabet[charCode % alphabet.length];
    }).join('');
  };

  const svgHeight = 480;
  const svgWidth = 720;

  // Compute live coordinates with physical shifting boundary offsets
  const adaptedNodes = useMemo(() => {
    return nodes.map((node) => {
      let x = node.x;
      let y = node.y;

      // Real UI float physics simulation - gentle drift
      const offsetSeedX = node.label.charCodeAt(0) || 12;
      const offsetSeedY = node.label.charCodeAt(1) || 7;
      x += Math.sin(tick * 0.015 + offsetSeedX) * 2;
      y += Math.cos(tick * 0.015 + offsetSeedY) * 2;

      // Active threat detection layout scrambling
      if (adaptiveDefenseActive) {
        const factor = shiftIntensity / 100;

        switch (obfuscationMode) {
          case 'ENTROPY_SCRAMBLE': {
            // High frequency cryptographic scattering (twitching nodes)
            const seed = node.id.charCodeAt(node.id.length - 1) || 9;
            x += Math.sin(tick * 0.12 + seed) * (18 * factor);
            y += Math.cos(tick * 0.12 + seed) * (18 * factor);
            break;
          }
          case 'POLAR_ROTATION': {
            // Smooth planetary orbits around central C2 coordinator node (400, 300 base)
            const cx = 360;
            const cy = 240;
            const dx = node.x - cx;
            const dy = node.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (node.type !== NodeType.CORE_C2 && dist > 15) {
              const baseAngle = Math.atan2(dy, dx);
              const rotationAngle = baseAngle + (tick * 0.003 * factor);
              x = cx + Math.cos(rotationAngle) * dist;
              y = cy + Math.sin(rotationAngle) * dist;
            }
            break;
          }
          case 'COGNITIVE_CLOAK': {
            // Compress coordinates seamlessly around the command core
            const c2 = nodes.find(n => n.type === NodeType.CORE_C2) || { x: 360, y: 240 };
            if (node.id !== c2.id) {
              const dx = node.x - c2.x;
              const dy = node.y - c2.y;
              // Shrink towards center with periodic defensive breathing
              const shieldPulse = 0.55 + Math.sin(tick * 0.01) * 0.05;
              const targetGrip = 1 - (factor * shieldPulse);
              x = c2.x + dx * targetGrip;
              y = c2.y + dy * targetGrip;
            }
            break;
          }
          case 'DUMMY_CHAFF': {
            // Slow randomized physical drift bounds
            const seed = node.id.charCodeAt(0) || 5;
            x += Math.sin(tick * 0.005 + seed) * (25 * factor);
            y += Math.cos(tick * 0.005 + seed) * (25 * factor);
            break;
          }
        }
      }

      return {
        ...node,
        x: Math.max(30, Math.min(svgWidth - 30, x)),
        y: Math.max(35, Math.min(svgHeight - 35, y)),
      };
    });
  }, [nodes, tick, adaptiveDefenseActive, obfuscationMode, shiftIntensity]);

  // Index maps for lookup links
  const adaptedNodesMap = useMemo(() => {
    const map = new Map<string, NetworkNode>();
    adaptedNodes.forEach(n => map.set(n.id, n));
    return map;
  }, [adaptedNodes]);

  // Inject virtual spoof links dynamically to obfuscate the real target relationships
  const decoyLinks = useMemo(() => {
    if (!adaptiveDefenseActive) return [];

    const chaff: { id: string; source: string; target: string; relationship: string; isDecoy: boolean }[] = [];

    if (nodes.length > 2) {
      nodes.forEach((n, idx) => {
        if (n.type !== NodeType.ADVERSARY && idx < nodes.length - 1) {
          const targetNode = nodes[idx + 1];
          if (targetNode && targetNode.type !== NodeType.ADVERSARY && n.id !== targetNode.id) {
            const pathExists = links.some(l => 
              (l.source === n.id && l.target === targetNode.id) || 
              (l.source === targetNode.id && l.target === n.id)
            );

            // Connect non-existent branches dynamically corresponding to tick pacing
            if (!pathExists && idx % 2 === 0) {
              chaff.push({
                id: `CHAFF_REL_${n.id}_${targetNode.id}`,
                source: n.id,
                target: targetNode.id,
                relationship: 'spoofed_chaff_tunnel',
                isDecoy: true
              });
            }
          }
        }
      });
    }
    return chaff;
  }, [nodes, links, adaptiveDefenseActive]);

  // Get active relation text labels
  const getRelationLabel = (relationship: string, isDecoy: boolean) => {
    if (adaptiveDefenseActive) {
      if (obfuscationMode === 'ENTROPY_SCRAMBLE') {
        return scrambleText(relationship);
      }
      if (obfuscationMode === 'COGNITIVE_CLOAK') {
        return '🔒 [TOPOLOGY_SHIELD_MASK]';
      }
      if (obfuscationMode === 'POLAR_ROTATION') {
        return `🔄 [ORBITAL_${relationship.toUpperCase()}]`;
      }
      return isDecoy ? '░░ chaff_tunnel_decoy ░░' : `[DECRYPTED_ROUTING: ${relationship}]`;
    }
    return relationship;
  };

  // Helper icons for node types
  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case NodeType.CORE_C2:
        return <Layers className="w-5 h-5 text-emerald-400" />;
      case NodeType.LURE:
        return <FileCode className="w-5 h-5 text-amber-400" />;
      case NodeType.ADVERSARY:
        return <User className="w-5 h-5 text-rose-500 animate-pulse" />;
      case NodeType.DEVICE:
        return <Shield className="w-5 h-5 text-cyan-400" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case NodeType.CORE_C2:
        return 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300';
      case NodeType.LURE:
        return 'border-amber-500/50 bg-amber-950/40 text-amber-300';
      case NodeType.ADVERSARY:
        return 'border-rose-500/50 bg-rose-950/40 text-rose-300';
      case NodeType.DEVICE:
        return 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300';
      default:
        return 'border-slate-500/50 bg-slate-900/40 text-slate-300';
    }
  };

  const handleCreateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeLabel) return;

    const id = `NODE_${newNodeType}_${Date.now()}`;
    const newNode: NetworkNode = {
      id,
      label: newNodeLabel,
      type: newNodeType,
      status: 'ACTIVE',
      details: newNodeDetails || 'Created via ontological modeler',
      x: Math.random() * 400 + 150,
      y: Math.random() * 260 + 100,
    };

    onAddNode(newNode);
    setNewNodeLabel('');
    setNewNodeDetails('');
    setShowAddNodeModal(false);
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkSource || !newLinkTarget || !newLinkLabel) return;

    const id = `LINK_${Date.now()}`;
    const newLink: NetworkLink = {
      id,
      source: newLinkSource,
      target: newLinkTarget,
      relationship: newLinkLabel,
    };

    onAddLink(newLink);
    setNewLinkSource('');
    setNewLinkTarget('');
    setNewLinkLabel('');
    setShowAddLinkModal(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full font-mono">
      {/* Visual Canvas Block */}
      <div className="lg:col-span-8 flex flex-col border border-slate-800 rounded bg-slate-950 p-4 relative overflow-hidden">
        {/* Animated matrix scanning grid line to indicate active security scanning */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30 animate-pulse pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 z-10 bg-slate-950/95 py-1">
          <div className="flex items-center gap-2 font-mono">
            <Network className={`w-5 h-5 ${adaptiveDefenseActive ? 'text-fuchsia-400 animate-spin' : 'text-emerald-400 animate-pulse'}`} />
            <span className="font-display font-medium text-slate-200 tracking-wider flex items-center gap-2">
              PALANTIR ONTOLOGICAL TARGET MODEL
              {adaptiveDefenseActive && (
                <span className="text-[9px] px-1.5 py-0.5 border border-fuchsia-500/80 bg-fuchsia-950/40 text-fuchsia-400 animate-pulse rounded uppercase font-bold">
                  TOPOLOGY ADAPTATION ACTIVE
                </span>
              )}
            </span>
          </div>

          {/* Mode Switcher and Object creation actions */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded text-[10px]">
              <button
                id="btn-view-d3-force"
                onClick={() => setGraphMode('D3_FORCE')}
                className={`px-2.5 py-1 rounded cursor-pointer font-bold flex items-center gap-1 transition-colors ${
                  graphMode === 'D3_FORCE' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3 h-3 text-cyan-400" />
                D3.js Force Simulation
              </button>
              <button
                id="btn-view-kinetic-grid"
                onClick={() => setGraphMode('KINETIC_GRID')}
                className={`px-2.5 py-1 rounded cursor-pointer font-bold flex items-center gap-1 transition-colors ${
                  graphMode === 'KINETIC_GRID' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Network className="w-3 h-3 text-fuchsia-400" />
                Cognitive Kinetic Grid
              </button>
            </div>

            <button
              id="btn-add-object"
              onClick={() => setShowAddNodeModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-500/20 rounded cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Object Type
            </button>
            <button
              id="btn-add-relationship"
              onClick={() => setShowAddLinkModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-cyan-500/40 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-500/20 rounded cursor-pointer transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5" /> Relationship
            </button>
          </div>
        </div>

        {graphMode === 'D3_FORCE' ? (
          <D3ForceGraph
            onSelectNode={setSelectedNode}
            onTriggerAction={onTriggerAction}
          />
        ) : (
          /* SVG Nodes & Links visualization */
          <div className="relative border border-slate-900 bg-slate-950/60 rounded flex-1 min-h-[400px]">
            {/* Legend */}
            <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-2 text-[10px] bg-slate-950/85 p-2 rounded border border-slate-900/80">
              <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500/20 border border-emerald-500 rounded-full inline-block"></span> C2 Root</div>
              <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500/20 border border-amber-500 rounded-full inline-block"></span> Canary Lure</div>
              <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500/20 border border-rose-500 rounded-full inline-block"></span> Adversary</div>
              <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-cyan-500/20 border border-cyan-500 rounded-full inline-block"></span> Device Node</div>
              {adaptiveDefenseActive && (
                <div className="flex items-center gap-1 text-fuchsia-400 font-bold"><span className="w-2.5 h-2.5 bg-fuchsia-500/20 border border-fuchsia-400 dashed rounded-full inline-block animate-ping"></span> Spoof Chaff</div>
              )}
            </div>

            {adaptiveDefenseActive && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-slate-950/95 border border-fuchsia-500/60 px-3.5 py-2 rounded shadow-lg backdrop-blur-sm text-[9px] text-fuchsia-300 font-mono select-none border-dashed animate-pulse max-w-[95%] text-center">
                <RefreshCw className="w-3 h-3 text-fuchsia-400 animate-spin flex-shrink-0" />
                <span>TOPOLOGY ADAPTATION MODE ACTIVE: RESTUCTURING NODES & SCRAMBLING NETWORK MAPS TO DEFEAT RECONNAISSANCE</span>
              </div>
            )}

          <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="absolute inset-0">
            <defs>
              <style>{`
                @keyframes flow-dash {
                  to {
                    stroke-dashoffset: -20;
                  }
                }
                .link-flow {
                  stroke-dasharray: 6 3;
                  animation: flow-dash 1.2s linear infinite;
                }
                .link-flow-chaff {
                  stroke-dasharray: 4 4;
                  animation: flow-dash 0.8s linear infinite;
                }
              `}</style>
              {/* Deceptive visual network overlay grid */}
              <pattern id="deception-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#101a2e" strokeWidth="0.75" />
                <circle cx="0" cy="0" r="1.2" fill="#d946ef" opacity="0.4" />
              </pattern>

              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e293b" />
              </marker>
              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
              </marker>
              <marker
                id="arrow-chaff"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#d946ef" />
              </marker>
            </defs>

            {/* Radar scan-sweeps and security field rings when active defense is on */}
            {adaptiveDefenseActive && (
              <g>
                <rect 
                  width="100%" 
                  height="100%" 
                  fill="url(#deception-grid)" 
                  className="pointer-events-none opacity-40"
                />
                
                {(() => {
                  const c2Node = adaptedNodes.find(n => n.type === NodeType.CORE_C2);
                  if (!c2Node) return null;
                  return (
                    <g className="pointer-events-none origin-center" style={{ opacity: 0.18 }}>
                      <circle
                        cx={c2Node.x}
                        cy={c2Node.y}
                        r="90"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="1"
                        strokeDasharray="4 8"
                        className="animate-[spin_40s_linear_infinite]"
                      />
                      <circle
                        cx={c2Node.x}
                        cy={c2Node.y}
                        r="160"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="0.75"
                        strokeDasharray="2 4"
                      />
                      <circle
                        cx={c2Node.x}
                        cy={c2Node.y}
                        r="240"
                        fill="none"
                        stroke="#d946ef"
                        strokeWidth="0.5"
                        strokeDasharray="1 6"
                      />
                      {/* Laser sweep pointer vector */}
                      <line
                        x1={c2Node.x}
                        y1={c2Node.y}
                        x2={c2Node.x + Math.cos(tick * 0.035) * 260}
                        y2={c2Node.y + Math.sin(tick * 0.035) * 260}
                        stroke="#ef4444"
                        strokeWidth="0.5"
                        strokeDasharray="3 3"
                      />
                    </g>
                  );
                })()}
              </g>
            )}

            {/* Links rendered first */}
            {links.map((link) => {
              const fromNode = adaptedNodesMap.get(link.source);
              const toNode = adaptedNodesMap.get(link.target);
              if (!fromNode || !toNode) return null;

              const isHostile = fromNode.type === NodeType.ADVERSARY || toNode.type === NodeType.ADVERSARY;

              return (
                <g key={link.id}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isHostile ? '#ef4444' : adaptiveDefenseActive ? '#0284c7' : '#1e293b'}
                    strokeWidth={isHostile ? '1.5' : '1'}
                    strokeDasharray={isHostile ? '4 2' : adaptiveDefenseActive ? '5 3' : undefined}
                    className={adaptiveDefenseActive ? "link-flow" : ""}
                    markerEnd={`url(#${isHostile ? 'arrow-active' : 'arrow'})`}
                  />
                  {/* Delicate relational label descriptors */}
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2 - 5}
                    fill={isHostile ? '#fda4af' : adaptiveDefenseActive ? '#38bdf8' : '#64748b'}
                    fontSize="8"
                    textAnchor="middle"
                    className="font-mono bg-slate-950 bg-opacity-90 px-1 select-none"
                  >
                    {getRelationLabel(link.relationship, false)}
                  </text>
                </g>
              );
            })}

            {/* Decoy chaff links injected dynamically */}
            {adaptiveDefenseActive && decoyLinks.map((link) => {
              const fromNode = adaptedNodesMap.get(link.source);
              const toNode = adaptedNodesMap.get(link.target);
              if (!fromNode || !toNode) return null;

              // Smooth sine pulse opacity behavior
              const pulseOpacity = 0.35 + Math.sin(tick * 0.08 + link.id.charCodeAt(15)) * 0.15;

              return (
                <g key={link.id} style={{ opacity: pulseOpacity }}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#d946ef"
                    strokeWidth="0.75"
                    strokeDasharray="2 3"
                    className="link-flow-chaff"
                    markerEnd="url(#arrow-chaff)"
                  />
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2 - 5}
                    fill="#f472b6"
                    fontSize="7"
                    textAnchor="middle"
                    className="font-mono bg-slate-950 bg-opacity-90 px-1 select-none font-semibold animate-pulse"
                  >
                    {getRelationLabel(link.relationship, true)}
                  </text>
                </g>
              );
            })}

            {/* Nodes rendered second */}
            {adaptedNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isHostile = node.type === NodeType.ADVERSARY;
              
              // Apply active perimeter highlight ring when adaptive defense is shielding nodes
              const isDecoyShielded = adaptiveDefenseActive && node.type === NodeType.LURE;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x},${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group select-none"
                >
                  {isDecoyShielded && (
                    <circle
                      r="19"
                      fill="none"
                      stroke="#d946ef"
                      strokeWidth="0.5"
                      strokeDasharray="3 3"
                      className="animate-[spin_12s_linear_infinite] opacity-60"
                    />
                  )}

                  <circle
                    r="14"
                    fill={isHostile ? 'rgba(239, 68, 68, 0.15)' : isDecoyShielded ? 'rgba(217, 70, 239, 0.08)' : 'rgba(30, 41, 59, 0.7)'}
                    stroke={isSelected ? '#10b981' : isHostile ? '#ef4444' : isDecoyShielded ? '#d946ef' : '#334155'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    className="transition-all duration-300 group-hover:scale-110"
                  />
                  
                  {/* Miniature node details */}
                  <foreignObject x="-10" y="-10" width="20" height="20" className="pointer-events-none">
                    <div className="flex items-center justify-center w-full h-full">
                      {getNodeIcon(node.type)}
                    </div>
                  </foreignObject>

                  {/* Node Name Label */}
                  <text
                    y="26"
                    textAnchor="middle"
                    fill={isSelected ? '#34d399' : isDecoyShielded ? '#f0abfc' : '#e2e8f0'}
                    fontSize="10"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="select-none pointer-events-none drop-shadow-md font-mono"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>

      {/* Ontological Details & Action Side Panel */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="border border-slate-800 rounded bg-slate-950 p-4">
          <div className="flex items-center gap-2 mb-3 border-b border-slate-900 pb-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display font-medium text-sm text-slate-200 uppercase tracking-widest">
              Semantic Inspector
            </h3>
          </div>

          {selectedNode ? (
            <div className="flex flex-col gap-3 text-xs leading-relaxed">
              <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-slate-800/60">
                <span className="text-slate-400">Object Class:</span>
                <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${getNodeColor(selectedNode.type)}`}>
                  {selectedNode.type}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Entity Identifier:</span>
                <span className="text-emerald-300 font-mono text-[11px] select-all bg-slate-900/80 px-2 py-1 rounded block border border-slate-900">
                  {selectedNode.id}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Display Label:</span>
                <span className="text-slate-200 font-bold bg-slate-900/50 px-2 py-1 rounded block border border-slate-800">
                  {selectedNode.label}
                </span>
              </div>

              {selectedNode.status && (
                <div>
                  <span className="text-slate-400 block">Status Flag:</span>
                  <span className={`font-semibold ${selectedNode.status === 'ISOLATED' || selectedNode.status === 'TRIGGERED' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    ● {selectedNode.status}
                  </span>
                </div>
              )}

              <div>
                <span className="text-slate-400 block">Metadata Description:</span>
                <p className="text-slate-300 bg-slate-900/30 p-2 rounded border border-slate-900 text-[11px]">
                  {selectedNode.details}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Point of Contact / Director:</span>
                <span className="text-slate-300 flex items-center gap-1 bg-slate-900/40 px-2 py-1 rounded border border-slate-900"><Award className="w-3.5 h-3.5 text-emerald-400" /> Director (P-01)</span>
              </div>

              {/* Kinetic actions based on object node selected */}
              <div className="mt-2 border-t border-slate-900 pt-3">
                <span className="text-slate-400 block mb-2 font-display text-xs uppercase tracking-widest">
                  Kinetic Operations (Verbs)
                </span>
                <div className="flex flex-col gap-2">
                  <button
                    id="btn-neutralize-session"
                    onClick={() => onTriggerAction('NeutralizeSession', selectedNode.id)}
                    className="w-full text-left py-1.5 px-3 rounded text-rose-400 hover:text-white border border-rose-500/30 bg-rose-950/20 hover:bg-rose-500/30 hover:border-rose-500 transition-colors cursor-pointer"
                  >
                    ⚡ Execute NeutralizeSession
                  </button>
                  <button
                    id="btn-quarantine-host"
                    onClick={() => onTriggerAction('QuarantineHost', selectedNode.id)}
                    className="w-full text-left py-1.5 px-3 rounded text-yellow-400 hover:text-white border border-yellow-500/30 bg-yellow-950/20 hover:bg-yellow-500/30 hover:border-yellow-500 transition-colors cursor-pointer"
                  >
                    ⚡ Execute QuarantineHost
                  </button>
                  <button
                    id="btn-force-key-rotation"
                    onClick={() => onTriggerAction('ForceKeyRotation', selectedNode.id)}
                    className="w-full text-left py-1.5 px-3 rounded text-cyan-400 hover:text-white border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-500/30 hover:border-cyan-500 transition-colors cursor-pointer"
                  >
                    ⚡ Force ML-KEM Key Cycle
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              <Network className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
              Select a node in the Ontological Canvas to inspect geographic metadata, point of contact, and execute kinetic response protocols.
            </div>
          )}
        </div>

        {/* Adaptive Topology Controller Hub */}
        <div className="border border-slate-800 rounded bg-slate-950 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-secondary pb-2">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <RefreshCw className={`w-4 h-4 ${adaptiveDefenseActive ? 'animate-spin' : ''}`} />
              <h3 className="font-display font-medium text-xs text-slate-200 uppercase tracking-widest">
                Topology Adaptation Shield
              </h3>
            </div>
            
            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${
              adaptiveDefenseActive
                ? 'border-fuchsia-500/50 bg-fuchsia-950/20 text-fuchsia-300 animate-pulse'
                : 'border-slate-800 bg-slate-900 text-slate-500'
            }`}>
              {adaptiveDefenseActive ? 'RESTRUCTURING' : 'NOMINAL'}
            </span>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed">
            Adapts node layouts dynamically as an active countermeasure to intercept mapping. Spoofs telemetry signals internally during intrusion incidents using 'Topology Adaptation' to simulate active restructuring to defend against mapping attempts.
          </p>

          <div className="flex flex-col gap-3 text-xs">
            {/* Master Toggle */}
            <div className="flex items-center justify-between bg-slate-900/30 p-2 rounded border border-slate-900/60">
              <div className="flex flex-col">
                <span className="font-bold text-slate-300">Topology Adaptation Mode</span>
                <span className="text-[9px] text-slate-500">
                  {hasActiveThreat ? '⚡ ACTIVE RESTRUCTURING: Threat Detected' : 'Nominal - manual override ready'}
                </span>
              </div>
              <button
                id="toggle-adaptive-deception"
                type="button"
                onClick={() => setAdaptiveDefenseActive(!adaptiveDefenseActive)}
                className="cursor-pointer text-cyan-400 hover:text-cyan-300 transition-colors"
                title={`${adaptiveDefenseActive ? "Deactivate" : "Activate"} Obfuscation Shield`}
              >
                {adaptiveDefenseActive ? (
                  <ToggleRight className="w-8 h-8 text-fuchsia-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-600" />
                )}
              </button>
            </div>

            {/* Config Modes */}
            {adaptiveDefenseActive && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Obfuscation Core Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="opt-dummy-chaff"
                      type="button"
                      onClick={() => setObfuscationMode('DUMMY_CHAFF')}
                      className={`p-1.5 border rounded text-left transition-colors cursor-pointer ${
                        obfuscationMode === 'DUMMY_CHAFF'
                          ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <p className="font-bold text-[9px] flex items-center gap-1"><Sparkles className="w-2.5 h-2.5 text-cyan-400" /> Dummy Chaff</p>
                      <span className="text-[8px] opacity-70 block">Spoofs links mesh</span>
                    </button>

                    <button
                      id="opt-polar-rotation"
                      type="button"
                      onClick={() => setObfuscationMode('POLAR_ROTATION')}
                      className={`p-1.5 border rounded text-left transition-colors cursor-pointer ${
                        obfuscationMode === 'POLAR_ROTATION'
                          ? 'border-fuchsia-500 bg-fuchsia-950/20 text-fuchsia-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <p className="font-bold text-[9px] flex items-center gap-1"><Radio className="w-2.5 h-2.5 text-fuchsia-400 animate-pulse" /> Polar Orbit</p>
                      <span className="text-[8px] opacity-70 block">Rotational routes</span>
                    </button>

                    <button
                      id="opt-entropy-scramble"
                      type="button"
                      onClick={() => setObfuscationMode('ENTROPY_SCRAMBLE')}
                      className={`p-1.5 border rounded text-left transition-colors cursor-pointer ${
                        obfuscationMode === 'ENTROPY_SCRAMBLE'
                          ? 'border-amber-500 bg-amber-950/20 text-amber-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <p className="font-bold text-[9px] flex items-center gap-1"><EyeOff className="w-2.5 h-2.5 text-amber-400" /> Entropy Jitter</p>
                      <span className="text-[8px] opacity-70 block">Constant twitch</span>
                    </button>

                    <button
                      id="opt-cognitive-cloak"
                      type="button"
                      onClick={() => setObfuscationMode('COGNITIVE_CLOAK')}
                      className={`p-1.5 border rounded text-left transition-colors cursor-pointer ${
                        obfuscationMode === 'COGNITIVE_CLOAK'
                          ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <p className="font-bold text-[9px] flex items-center gap-1"><Shield className="w-2.5 h-2.5 text-emerald-400" /> Cloak Shroud</p>
                      <span className="text-[8px] opacity-70 block">Mask core paths</span>
                    </button>
                  </div>
                </div>

                {/* Displacement Bounds slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Displacement Boundary:</span>
                    <span className="text-cyan-400 font-bold font-mono">{shiftIntensity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-slate-500" />
                    <input
                      id="slider-shift-intensity"
                      type="range"
                      min="10"
                      max="100"
                      value={shiftIntensity}
                      onChange={(e) => setShiftIntensity(parseInt(e.target.value))}
                      className="w-full bg-slate-900 rounded-lg appearance-none h-1.5 accent-cyan-500 cursor-pointer focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-500 leading-none">
                    <span>Nominal Float</span>
                    <span>Extreme Scatter</span>
                  </div>
                </div>

                {/* Readouts */}
                <div className="bg-slate-900/40 p-2 rounded border border-slate-900 text-[10px] text-slate-400 flex flex-col gap-1 font-mono">
                  <div className="flex justify-between">
                    <span>Target Obfuscation Drift:</span>
                    <span className="text-fuchsia-400">± {Math.round(shiftIntensity * 0.25)}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chaff connections online:</span>
                    <span className="text-cyan-400 font-medium">{decoyLinks.length} virtual links</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Encryption Entropy Hash:</span>
                    <span className="text-emerald-400 truncate">ML-FIPS-SEC-{(tick * 13).toString(16).toUpperCase()}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Ontological Guidelines card */}
        <div className="border border-slate-900 bg-slate-950/40 p-3 rounded text-[11px] text-slate-400 leading-relaxed">
          <h4 className="font-bold text-slate-300 mb-1 border-b border-slate-900 pb-1">Foundry Project Guidelines</h4>
          <span className="block mb-1">● <strong>03-Ontology-Management</strong> maintains consistent schema structures.</span>
          <span className="block mb-1">● <strong>Group Organization:</strong> Categorize telemetry via groups rather than namespaces to prevent API mutation.</span>
          <span className="block">● <strong>ISO 8601 Naming:</strong> Align C2 manifests to chronological date ordering keys to optimize ledger scans.</span>
        </div>
      </div>

      {/* Add Object Type Modal */}
      {showAddNodeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 font-mono">
          <div className="bg-slate-950 border border-slate-800 rounded p-5 max-w-sm w-full">
            <h3 className="text-sm font-display font-medium text-slate-200 mb-3 uppercase tracking-wider">
              Inject New Semantic Object
            </h3>
            <form onSubmit={handleCreateNode}>
              <div className="flex flex-col gap-3 text-xs mb-4">
                <div>
                  <label className="text-slate-400 block mb-1">Object Class</label>
                  <select
                    id="select-node-type"
                    value={newNodeType}
                    onChange={(e) => setNewNodeType(e.target.value as NodeType)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value={NodeType.LURE}>Canary Lure (WE-FORGE)</option>
                    <option value={NodeType.ADVERSARY}>Adversary Node (L_Threat)</option>
                    <option value={NodeType.DEVICE}>Device / Physical Gate</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Display Label</label>
                  <input
                    id="input-node-label"
                    type="text"
                    required
                    value={newNodeLabel}
                    onChange={(e) => setNewNodeLabel(e.target.value)}
                    placeholder="e.g. LURE: Acoustic Profile"
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Details & Metadata</label>
                  <textarea
                    id="input-node-details"
                    value={newNodeDetails}
                    onChange={(e) => setNewNodeDetails(e.target.value)}
                    placeholder="Physical geolocation, IP subnets, or signature state guidelines..."
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button
                  id="btn-close-object-modal"
                  type="button"
                  onClick={() => setShowAddNodeModal(false)}
                  className="px-3 py-1.5 border border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-object"
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-950 border border-emerald-500/60 text-emerald-300 hover:bg-emerald-900 cursor-pointer"
                >
                  Inject Object
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Link Type Modal */}
      {showAddLinkModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 font-mono">
          <div className="bg-slate-950 border border-slate-800 rounded p-5 max-w-sm w-full">
            <h3 className="text-sm font-display font-medium text-slate-200 mb-3 uppercase tracking-wider">
              Establish Ontological Relationship
            </h3>
            <form onSubmit={handleCreateLink}>
              <div className="flex flex-col gap-3 text-xs mb-4">
                <div>
                  <label className="text-slate-400 block mb-1">Source Node</label>
                  <select
                    id="select-source-node"
                    required
                    value={newLinkSource}
                    onChange={(e) => setNewLinkSource(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Choose Source --</option>
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Target Node (Destination)</label>
                  <select
                    id="select-target-node"
                    required
                    value={newLinkTarget}
                    onChange={(e) => setNewLinkTarget(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Choose Target --</option>
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Relationship Label (Verb)</label>
                  <input
                    id="input-relationship-label"
                    type="text"
                    required
                    value={newLinkLabel}
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                    placeholder="e.g. exfiltrated, monitors, probed"
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button
                  id="btn-close-link-modal"
                  type="button"
                  onClick={() => setShowAddLinkModal(false)}
                  className="px-3 py-1.5 border border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-link"
                  type="submit"
                  className="px-3 py-1.5 bg-cyan-950 border border-cyan-500/60 text-cyan-300 hover:bg-cyan-940 cursor-pointer"
                >
                  Map Relationship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
