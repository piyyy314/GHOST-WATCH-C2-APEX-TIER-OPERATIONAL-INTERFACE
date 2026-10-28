import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { NetworkNode, NodeType } from '../types';
import { 
  Zap, ZoomIn, ZoomOut, RotateCcw, Filter, ShieldAlert, 
  FileCode, User, Radio, Layers, AlertTriangle, ShieldCheck
} from 'lucide-react';

export interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  category: 'LURE' | 'SOURCE_IP' | 'THREAT_EVENT' | 'CORE_C2' | 'DEVICE';
  status: string;
  details: string;
  ipAddress?: string;
  dnsToken?: string;
  threatLevel?: 'INFO' | 'WARNING' | 'CRITICAL';
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node;
  target: string | D3Node;
  relationship: string;
  category: 'PROBE' | 'CANARY_TRIGGER' | 'TELEMETRY' | 'CONTAINMENT' | 'COMMAND';
}

interface D3ForceGraphProps {
  onSelectNode?: (node: NetworkNode) => void;
  onTriggerAction?: (actionName: string, targetNodeId: string) => void;
}

// Initial Tri-Partite Graph Dataset: Lures <-> Source IPs <-> Threat Events <-> Core C2
const INITIAL_D3_NODES: D3Node[] = [
  // CORE C2
  {
    id: 'CORE_C2_APEX',
    label: 'GW-C2 [HB-9982-AX-2026]',
    category: 'CORE_C2',
    status: 'ONLINE',
    details: 'Apex Sovereign Command Core with FIPS 203 ML-KEM Root',
    threatLevel: 'INFO'
  },
  // LURES
  {
    id: 'LURE_SUBMARINE_V19',
    label: 'LURE: Submarine Acoustics v1.9',
    category: 'LURE',
    status: 'TRIGGERED (3x)',
    dnsToken: 'sonar-telemetry-11.ghost.watch.local',
    details: 'Decoy technical manual with steganographic Exif metadata watermark',
    threatLevel: 'WARNING'
  },
  {
    id: 'LURE_PROPULSION_SCHEMA',
    label: 'LURE: Space-Frame Propulsion',
    category: 'LURE',
    status: 'ACTIVE',
    dnsToken: 'audit-vault-49.ghost.watch.local',
    details: 'Linguistic synonym-shifted PDF manual placed in database cache',
    threatLevel: 'INFO'
  },
  {
    id: 'LURE_EXO_GUIDANCE',
    label: 'LURE: Exo-Atmospheric Interceptor',
    category: 'LURE',
    status: 'ACTIVE',
    dnsToken: 'guidance-sync-82.ghost.watch.local',
    details: 'Steganographic LSB telemetry key embedded in cover banner',
    threatLevel: 'INFO'
  },
  {
    id: 'LURE_CITRON_CREDS',
    label: 'LURE: Citron Tree Credentials',
    category: 'LURE',
    status: 'ACTIVE',
    dnsToken: 'credential-relay-93.ghost.watch.local',
    details: 'Altered licensing syntax decoy credential file',
    threatLevel: 'INFO'
  },
  // SOURCE IPS (Adversaries / Proxies)
  {
    id: 'IP_185_220_101_5',
    label: '185.220.101.5 (Tor Exit)',
    category: 'SOURCE_IP',
    ipAddress: '185.220.101.5',
    status: 'ISOLATED',
    details: 'Tor proxy node attributed to APT-42 reconnaissance sweeps',
    threatLevel: 'CRITICAL'
  },
  {
    id: 'IP_94_23_221_14',
    label: '94.23.221.14 (Targeted VPN)',
    category: 'SOURCE_IP',
    ipAddress: '94.23.221.14',
    status: 'PROBING',
    details: 'Commercial VPN endpoint conducting high-frequency API scraping',
    threatLevel: 'CRITICAL'
  },
  {
    id: 'IP_45_138_22_91',
    label: '45.138.22.91 (Compromised Botnet)',
    category: 'SOURCE_IP',
    ipAddress: '45.138.22.91',
    status: 'FLAGGED',
    details: 'Distributed crawler targeting WE-FORGE decoy tables',
    threatLevel: 'WARNING'
  },
  {
    id: 'IP_LAE_NODE_09',
    label: 'LAE_Node_09 (Service Account)',
    category: 'SOURCE_IP',
    ipAddress: '10.99.1.104',
    status: 'REVOKED & QUARANTINED',
    details: 'Autonomous insider database crawler with 4.8 hops/sec lateral speed',
    threatLevel: 'CRITICAL'
  },
  // THREAT EVENTS
  {
    id: 'EVT_CANARY_TRIP_01',
    label: 'EVT-313-31302: Canary Tripped',
    category: 'THREAT_EVENT',
    status: '313-BIND #31302',
    details: 'Canary token clicked for Lure Submarine Acoustics. Synthetic latency injected.',
    threatLevel: 'WARNING'
  },
  {
    id: 'EVT_LATERAL_EXFIL_02',
    label: 'EVT-313-31303: Lateral Exfil Probe',
    category: 'THREAT_EVENT',
    status: '313-BIND #31303',
    details: 'Rapid multi-point query of watermarked documents. Redirected to AETHER honeypot.',
    threatLevel: 'CRITICAL'
  },
  {
    id: 'EVT_API_SCRAPE_03',
    label: 'EVT-313-31307: API Scrape L3 Contain',
    category: 'THREAT_EVENT',
    status: '313-BIND #31307',
    details: 'Decoy API scrape request captured on shadow DNS endpoint.',
    threatLevel: 'CRITICAL'
  },
  {
    id: 'EVT_LORA_MESH_PROBE',
    label: 'EVT-313-31301: 915MHz RF Scan',
    category: 'THREAT_EVENT',
    status: '313-BIND #31301',
    details: 'Green Pine RF spectrum probe. Low-power automated scan filtered.',
    threatLevel: 'INFO'
  },
  // DEVICES / SENSORS
  {
    id: 'DEV_GREEN_PINE',
    label: 'Green Pine Sensor 12',
    category: 'DEVICE',
    status: 'MONITORING',
    details: 'LoRa 915.0 MHz out-of-band spectrum analyzer sensor',
    threatLevel: 'INFO'
  },
  {
    id: 'DEV_DAVID_SLING',
    label: "David's Sling BMC Interface",
    category: 'DEVICE',
    status: 'SECURE',
    details: 'Kinetic interceptor battery launcher telemetry node',
    threatLevel: 'INFO'
  }
];

const INITIAL_D3_LINKS: D3Link[] = [
  // Source IPs accessing Lures
  { source: 'IP_185_220_101_5', target: 'LURE_SUBMARINE_V19', relationship: 'exfiltrated', category: 'PROBE' },
  { source: 'IP_94_23_221_14', target: 'LURE_PROPULSION_SCHEMA', relationship: 'scraped', category: 'PROBE' },
  { source: 'IP_45_138_22_91', target: 'LURE_EXO_GUIDANCE', relationship: 'probed', category: 'PROBE' },
  { source: 'IP_LAE_NODE_09', target: 'LURE_CITRON_CREDS', relationship: 'lateral-theft', category: 'PROBE' },

  // Lures triggering Threat Events
  { source: 'LURE_SUBMARINE_V19', target: 'EVT_CANARY_TRIP_01', relationship: 'tripped', category: 'CANARY_TRIGGER' },
  { source: 'IP_185_220_101_5', target: 'EVT_LATERAL_EXFIL_02', relationship: 'generated', category: 'PROBE' },
  { source: 'IP_94_23_221_14', target: 'EVT_API_SCRAPE_03', relationship: 'triggered', category: 'PROBE' },
  { source: 'DEV_GREEN_PINE', target: 'EVT_LORA_MESH_PROBE', relationship: 'detected', category: 'TELEMETRY' },

  // Threat Events feeding into Core C2
  { source: 'EVT_CANARY_TRIP_01', target: 'CORE_C2_APEX', relationship: 'escalated-L2', category: 'CONTAINMENT' },
  { source: 'EVT_LATERAL_EXFIL_02', target: 'CORE_C2_APEX', relationship: 'quarantined-L3', category: 'CONTAINMENT' },
  { source: 'EVT_API_SCRAPE_03', target: 'CORE_C2_APEX', relationship: 'contained-L3', category: 'CONTAINMENT' },
  { source: 'EVT_LORA_MESH_PROBE', target: 'CORE_C2_APEX', relationship: 'ingested-SIEM', category: 'TELEMETRY' },

  // Core C2 controlling Devices & monitoring Lures
  { source: 'CORE_C2_APEX', target: 'DEV_GREEN_PINE', relationship: 'lora-harvest', category: 'COMMAND' },
  { source: 'CORE_C2_APEX', target: 'DEV_DAVID_SLING', relationship: 'kinetic-lock', category: 'COMMAND' },
  { source: 'CORE_C2_APEX', target: 'LURE_PROPULSION_SCHEMA', relationship: 'monitors', category: 'COMMAND' },
  { source: 'CORE_C2_APEX', target: 'LURE_CITRON_CREDS', relationship: 'monitors', category: 'COMMAND' },
  { source: 'CORE_C2_APEX', target: 'IP_185_220_101_5', relationship: 'null-routed', category: 'CONTAINMENT' },
  { source: 'CORE_C2_APEX', target: 'IP_LAE_NODE_09', relationship: 'sigkill-revoked', category: 'CONTAINMENT' }
];

export const D3ForceGraph: React.FC<D3ForceGraphProps> = ({ onSelectNode, onTriggerAction }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomGRef = useRef<SVGGElement>(null);

  const [selectedD3Node, setSelectedD3Node] = useState<D3Node | null>(INITIAL_D3_NODES[1]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [chargeStrength, setChargeStrength] = useState<number>(-260);
  const [linkDistance, setLinkDistance] = useState<number>(110);
  const [isPhysicsActive, setIsPhysicsActive] = useState<boolean>(true);

  // Filter nodes according to selected category
  const filteredNodes = useMemo(() => {
    if (activeCategoryFilter === 'ALL') return INITIAL_D3_NODES;
    return INITIAL_D3_NODES.filter(n => n.category === activeCategoryFilter);
  }, [activeCategoryFilter]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  const filteredLinks = useMemo(() => {
    return INITIAL_D3_LINKS.filter(link => {
      const srcId = typeof link.source === 'object' ? (link.source as D3Node).id : link.source;
      const tgtId = typeof link.target === 'object' ? (link.target as D3Node).id : link.target;
      return filteredNodeIds.has(srcId as string) && filteredNodeIds.has(tgtId as string);
    });
  }, [filteredNodeIds]);

  // D3 force simulation setup
  useEffect(() => {
    if (!svgRef.current || !zoomGRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(zoomGRef.current);
    const width = svgRef.current.clientWidth || 700;
    const height = 480;

    // Clear previous elements inside zoom group
    g.selectAll('*').remove();

    // Prepare deep clones of data for D3 mutation
    const nodes: D3Node[] = filteredNodes.map(d => ({ ...d }));
    const links: D3Link[] = filteredLinks.map(d => ({
      ...d,
      source: typeof d.source === 'object' ? (d.source as D3Node).id : d.source,
      target: typeof d.target === 'object' ? (d.target as D3Node).id : d.target
    }));

    // Setup Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Setup Simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink<D3Node, D3Link>(links).id(d => d.id).distance(linkDistance))
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(38));

    if (!isPhysicsActive) {
      simulation.stop();
    }

    // Colors mapping
    const getCategoryColor = (cat: string) => {
      switch (cat) {
        case 'CORE_C2': return '#10b981'; // Emerald
        case 'LURE': return '#f59e0b'; // Amber
        case 'SOURCE_IP': return '#ef4444'; // Rose
        case 'THREAT_EVENT': return '#d946ef'; // Fuchsia
        case 'DEVICE': return '#06b6d4'; // Cyan
        default: return '#94a3b8';
      }
    };

    const getCategoryBg = (cat: string) => {
      switch (cat) {
        case 'CORE_C2': return 'rgba(16, 185, 129, 0.2)';
        case 'LURE': return 'rgba(245, 158, 11, 0.2)';
        case 'SOURCE_IP': return 'rgba(239, 68, 68, 0.2)';
        case 'THREAT_EVENT': return 'rgba(217, 70, 239, 0.2)';
        case 'DEVICE': return 'rgba(6, 182, 212, 0.2)';
        default: return 'rgba(148, 163, 184, 0.2)';
      }
    };

    // Render Links
    const linkGroup = g.append('g').attr('class', 'links');
    const link = linkGroup
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', (d) => {
        if (d.category === 'CANARY_TRIGGER') return '#f59e0b';
        if (d.category === 'PROBE') return '#ef4444';
        if (d.category === 'CONTAINMENT') return '#06b6d4';
        return '#334155';
      })
      .attr('stroke-width', (d) => (d.category === 'CANARY_TRIGGER' ? 2 : 1.2))
      .attr('stroke-dasharray', (d) => (d.category === 'PROBE' ? '4 3' : d.category === 'CONTAINMENT' ? '2 2' : 'none'))
      .attr('opacity', 0.7);

    // Link labels
    const linkLabel = linkGroup
      .selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .text((d) => d.relationship)
      .attr('fill', '#64748b')
      .attr('font-size', '8px')
      .attr('font-family', 'monospace')
      .attr('text-anchor', 'middle');

    // Drag behavior
    function dragstarted(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
      if (!event.active && isPhysicsActive) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
      if (!event.active && isPhysicsActive) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    const drag = d3.drag<SVGGElement, D3Node>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);

    // Render Nodes Group
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const node = nodeGroup
      .selectAll<SVGGElement, D3Node>('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('cursor', 'grab')
      .call(drag);

    // Node outer circle (halo/pulse)
    node.append('circle')
      .attr('r', (d) => (d.category === 'CORE_C2' ? 26 : d.category === 'THREAT_EVENT' ? 22 : 18))
      .attr('fill', (d) => getCategoryBg(d.category))
      .attr('stroke', (d) => getCategoryColor(d.category))
      .attr('stroke-width', (d) => (selectedD3Node?.id === d.id ? 2.5 : 1.5))
      .attr('stroke-dasharray', (d) => (d.status.includes('REVOKED') || d.status.includes('ISOLATED') ? '3 3' : 'none'));

    // Node inner icon/dot
    node.append('circle')
      .attr('r', 5)
      .attr('fill', (d) => getCategoryColor(d.category));

    // Node text label
    node.append('text')
      .text((d) => d.label)
      .attr('y', (d) => (d.category === 'CORE_C2' ? 36 : 30))
      .attr('text-anchor', 'middle')
      .attr('fill', '#cbd5e1')
      .attr('font-size', '9px')
      .attr('font-weight', (d) => (selectedD3Node?.id === d.id ? 'bold' : 'normal'))
      .attr('font-family', 'monospace')
      .attr('pointer-events', 'none');

    // Click handler for node inspection
    node.on('click', (_event, d) => {
      setSelectedD3Node(d);
      if (onSelectNode) {
        // Map to NetworkNode interface
        const netNode: NetworkNode = {
          id: d.id,
          label: d.label,
          type: d.category === 'CORE_C2' ? NodeType.CORE_C2 :
                d.category === 'LURE' ? NodeType.LURE :
                d.category === 'SOURCE_IP' ? NodeType.ADVERSARY :
                NodeType.DEVICE,
          status: d.status,
          details: d.details,
          x: d.x || 300,
          y: d.y || 200
        };
        onSelectNode(netNode);
      }
    });

    // Simulation tick handler
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkLabel
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 3);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [filteredNodes, filteredLinks, linkDistance, chargeStrength, isPhysicsActive, selectedD3Node?.id]);

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomGRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(500).call(
      d3.zoom<SVGSVGElement, unknown>().transform,
      d3.zoomIdentity
    );
  };

  return (
    <div className="flex flex-col gap-3 font-mono text-xs">
      {/* Controls & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 p-2.5 rounded border border-slate-900 text-[10px]">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" /> Filter:
          </span>
          {['ALL', 'LURE', 'SOURCE_IP', 'THREAT_EVENT', 'CORE_C2', 'DEVICE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                activeCategoryFilter === cat
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/50'
                  : 'bg-slate-950 text-slate-400 border border-slate-900 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL' ? '● ALL ENTITIES' :
               cat === 'LURE' ? '🍯 LURES' :
               cat === 'SOURCE_IP' ? '🛑 SOURCE IPS' :
               cat === 'THREAT_EVENT' ? '⚡ THREAT EVENTS' :
               cat === 'CORE_C2' ? '👑 CORE C2' : '📡 SENSORS'}
            </button>
          ))}
        </div>

        {/* Physics Controls & Zoom */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[9px] text-slate-400">
            <span>Charge:</span>
            <input
              type="range"
              min="-600"
              max="-100"
              value={chargeStrength}
              onChange={(e) => setChargeStrength(Number(e.target.value))}
              className="w-16 accent-cyan-400 cursor-pointer"
            />
          </div>
          <button
            onClick={() => setIsPhysicsActive(!isPhysicsActive)}
            className={`px-2 py-0.5 rounded border cursor-pointer text-[9px] font-bold ${
              isPhysicsActive ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {isPhysicsActive ? '⏸ Pause Physics' : '▶ Resume Physics'}
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-900 cursor-pointer flex items-center gap-1 text-[9px]"
            title="Reset Zoom & Pan"
          >
            <RotateCcw className="w-2.5 h-2.5" /> Reset View
          </button>
        </div>
      </div>

      {/* D3 Force Directed Graph Canvas */}
      <div className="relative border border-slate-900 bg-slate-950 rounded overflow-hidden min-h-[460px] flex">
        {/* Graph Legend Overlay */}
        <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-2 text-[9.5px] bg-slate-950/90 p-2 rounded border border-slate-900 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-bold">Core C2</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-slate-300 font-bold">Lure Decoys</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span className="text-slate-300 font-bold">Source IPs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
            <span className="text-slate-300 font-bold">Threat Events</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-300 font-bold">Sensors</span>
          </div>
        </div>

        {/* Drag / Zoom instruction */}
        <div className="absolute bottom-2 right-2 z-10 text-[9px] text-slate-500 bg-slate-950/80 px-2 py-1 rounded border border-slate-900 pointer-events-none">
          Drag nodes to reposition • Scroll to zoom • Click node to inspect
        </div>

        <svg ref={svgRef} className="w-full h-[460px] select-none">
          <g ref={zoomGRef} />
        </svg>

        {/* Node Detail Inspection Panel on Selection */}
        {selectedD3Node && (
          <div className="absolute bottom-2 left-2 max-w-sm w-full bg-slate-950/95 border border-cyan-500/50 p-3 rounded shadow-2xl text-[10px] flex flex-col gap-2 z-20 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  selectedD3Node.category === 'SOURCE_IP' ? 'bg-rose-400 animate-ping' :
                  selectedD3Node.category === 'LURE' ? 'bg-amber-400' :
                  selectedD3Node.category === 'THREAT_EVENT' ? 'bg-fuchsia-400 animate-pulse' :
                  'bg-emerald-400'
                }`} />
                <span className="font-bold text-slate-100 truncate text-[11px]">{selectedD3Node.label}</span>
              </div>
              <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                selectedD3Node.threatLevel === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                selectedD3Node.threatLevel === 'WARNING' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {selectedD3Node.status}
              </span>
            </div>

            <p className="text-slate-400 leading-tight">{selectedD3Node.details}</p>

            {selectedD3Node.ipAddress && (
              <div className="text-[9px]">
                <span className="text-slate-500">ATTACKER IP: </span>
                <span className="text-rose-400 font-mono font-bold select-all">{selectedD3Node.ipAddress}</span>
              </div>
            )}

            {selectedD3Node.dnsToken && (
              <div className="text-[9px]">
                <span className="text-slate-500">CANARY TOKEN: </span>
                <span className="text-cyan-400 font-mono font-bold select-all">{selectedD3Node.dnsToken}</span>
              </div>
            )}

            {/* Kinetic action buttons */}
            {onTriggerAction && (
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-900 mt-0.5">
                {selectedD3Node.category === 'SOURCE_IP' && (
                  <>
                    <button
                      onClick={() => onTriggerAction('NeutralizeSession', selectedD3Node.id)}
                      className="px-2 py-0.5 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 cursor-pointer font-bold text-[9px]"
                    >
                      💥 Neutralize Session
                    </button>
                    <button
                      onClick={() => onTriggerAction('QuarantineHost', selectedD3Node.id)}
                      className="px-2 py-0.5 rounded bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 cursor-pointer font-bold text-[9px]"
                    >
                      🚫 Quarantine to AETHER
                    </button>
                  </>
                )}
                {selectedD3Node.category === 'CORE_C2' && (
                  <button
                    onClick={() => onTriggerAction('ForceKeyRotation', selectedD3Node.id)}
                    className="px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 cursor-pointer font-bold text-[9px]"
                  >
                    🔑 Rotate ML-KEM Root
                  </button>
                )}
                <button
                  onClick={() => setSelectedD3Node(null)}
                  className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 hover:text-slate-200 cursor-pointer text-[9px] ml-auto"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
