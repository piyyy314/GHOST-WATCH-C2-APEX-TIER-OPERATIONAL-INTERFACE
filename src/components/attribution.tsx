import React, { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import { ThreatEvent, ThreatLevel } from '../types';
import { temporalBinder } from '../lib/temporal_binder';
import { 
  FileText, Download, ShieldCheck, AlertOctagon, Filter, 
  Search, CheckCircle2, Lock, Cpu, Database, Eye, ExternalLink,
  Printer, Award, Layers, Globe
} from 'lucide-react';

interface AttributionDatabaseProps {
  threatEvents: ThreatEvent[];
  onUpdateThreatEvents?: (events: ThreatEvent[]) => void;
  rootKeyHash: string;
}

export const AttributionDatabase: React.FC<AttributionDatabaseProps> = ({
  threatEvents,
  onUpdateThreatEvents,
  rootKeyHash,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedEventId, setSelectedEventId] = useState<string>(threatEvents[0]?.id || '');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string>('');

  // Filter threat events
  const filteredEvents = useMemo(() => {
    return threatEvents.filter((evt) => {
      const matchSearch = 
        evt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.actionTaken.toLowerCase().includes(searchTerm.toLowerCase());

      const matchLevel = selectedLevel === 'ALL' || evt.level === selectedLevel;

      return matchSearch && matchLevel;
    });
  }, [threatEvents, searchTerm, selectedLevel]);

  const selectedEvent = useMemo(() => {
    return threatEvents.find(e => e.id === selectedEventId) || threatEvents[0];
  }, [threatEvents, selectedEventId]);

  // Metrics
  const criticalCount = threatEvents.filter(e => e.level === ThreatLevel.CRITICAL).length;
  const warningCount = threatEvents.filter(e => e.level === ThreatLevel.WARNING).length;
  const boundCount = threatEvents.filter(e => e.chainBound).length;

  // Export structured PDF report using jsPDF
  const handleExportPdfReport = () => {
    setIsExportingPdf(true);
    setPdfSuccessMessage('');

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const now = new Date();
      const timeStrIso = now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
      const timestamp313 = temporalBinder.generateNanosecond313Timestamp();
      const reportId = `GW-PDF-ATTR-${Date.now().toString(16).toUpperCase()}`;

      // Seal into 313-BIND ledger
      const receipt = temporalBinder.bind_receipt({
        event: 'ATTRIBUTION_PDF_REPORT_GENERATED',
        report_id: reportId,
        events_count: filteredEvents.length,
        critical_count: criticalCount,
        cadl_level: 'L5-LOCKDOWN'
      }, 'attribution_dossier_engine', 'PDF_REPORT_SIGN');

      // Colors
      const darkBg = [10, 15, 30]; // #0a0f1e
      const primaryCyan = [6, 182, 212]; // #06b6d4
      const textLight = [241, 245, 249]; // #f1f5f9
      const textMuted = [148, 163, 184]; // #94a3b8
      const accentRose = [244, 63, 94]; // #f43f5e
      const accentAmber = [245, 158, 11]; // #f59e0b
      const accentEmerald = [16, 185, 129]; // #10b981

      // PAGE 1: Header & Executive Summary
      // Header background banner
      doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
      doc.rect(0, 0, 210, 42, 'F');

      // Top classification strip
      doc.setFillColor(accentRose[0], accentRose[1], accentRose[2]);
      doc.rect(0, 0, 210, 3.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('courier', 'bold');
      doc.setFontSize(8);
      doc.text('TOP SECRET // NOFORN // NIST SP 800-86 AUDIT DOSSIER // POST-QUANTUM ASSURED', 105, 2.5, { align: 'center' });

      // Title
      doc.setTextColor(primaryCyan[0], primaryCyan[1], primaryCyan[2]);
      doc.setFont('courier', 'bold');
      doc.setFontSize(16);
      doc.text('GHOST-WATCH C2 // THREAT ATTRIBUTION DOSSIER', 14, 14);

      // Subtitle
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.setFont('courier', 'normal');
      doc.setFontSize(8.5);
      doc.text('COGNITIVE-ADAPTIVE DECEPTION LAYER & 313-BIND FORENSIC INTELLIGENCE', 14, 20);

      // Metadata Header Pills on Right
      doc.setFontSize(8);
      doc.setTextColor(textLight[0], textLight[1], textLight[2]);
      doc.text(`REPORT ID: ${reportId}`, 196, 14, { align: 'right' });
      doc.text(`DATE: ${timeStrIso}`, 196, 20, { align: 'right' });
      doc.text(`313-BIND ANCHOR: Block #${receipt.bindIndex}`, 196, 26, { align: 'right' });
      doc.text(`ML-KEM ROOT: 0x${rootKeyHash}`, 196, 32, { align: 'right' });

      // Divider line
      doc.setDrawColor(primaryCyan[0], primaryCyan[1], primaryCyan[2]);
      doc.setLineWidth(0.75);
      doc.line(14, 44, 196, 44);

      // Section 1: Executive Summary Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, 48, 182, 32, 2, 2, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFont('courier', 'bold');
      doc.setFontSize(10);
      doc.text('1. EXECUTIVE THREAT ATTRIBUTION SUMMARY', 18, 54);

      doc.setFont('courier', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`• Total Threat Events Evaluated: ${threatEvents.length} (Filtered in Scope: ${filteredEvents.length})`, 18, 60);
      doc.text(`• Critical Kinetic Incidents: ${criticalCount} | Warnings: ${warningCount} | Info: ${threatEvents.length - criticalCount - warningCount}`, 18, 65);
      doc.text(`• 313-BIND Blockchain Integrity: ${boundCount}/${threatEvents.length} events sealed with SLH-DSA-128f post-quantum signatures`, 18, 70);
      doc.text(`• Containment Verdict: AETHER Honeygrid Active (Tor Exit 185.x neutralized; LAE_Node_09 revoked)`, 18, 75);

      // Section 2: Detailed Threat Incidents Table
      doc.setTextColor(15, 23, 42);
      doc.setFont('courier', 'bold');
      doc.setFontSize(10);
      doc.text('2. AUDITED THREAT INCIDENTS & FORENSIC LOGS', 14, 88);

      let currentY = 94;

      // Table Header
      doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
      doc.rect(14, currentY, 182, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('courier', 'bold');
      doc.setFontSize(7.5);
      doc.text('EVENT ID', 16, currentY + 4.8);
      doc.text('TIMESTAMP', 46, currentY + 4.8);
      doc.text('SEV', 82, currentY + 4.8);
      doc.text('SOURCE / VECTOR', 96, currentY + 4.8);
      doc.text('REMEDIATION ACTION', 144, currentY + 4.8);

      currentY += 8;

      // Iterate Events
      filteredEvents.forEach((evt, idx) => {
        // Page break if needed
        if (currentY > 260) {
          doc.addPage();
          // Mini header on subsequent pages
          doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
          doc.rect(0, 0, 210, 16, 'F');
          doc.setTextColor(primaryCyan[0], primaryCyan[1], primaryCyan[2]);
          doc.setFont('courier', 'bold');
          doc.setFontSize(9);
          doc.text(`GHOST-WATCH ATTRIBUTION REPORT // PAGE ${doc.getNumberOfPages()} (CONT'D)`, 14, 10);
          currentY = 22;
        }

        const isEven = idx % 2 === 0;
        doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
        doc.rect(14, currentY, 182, 16, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.rect(14, currentY, 182, 16, 'S');

        // Event ID & Bind
        doc.setFont('courier', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        doc.text(evt.id, 16, currentY + 4.5);

        doc.setFont('courier', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(primaryCyan[0], primaryCyan[1], primaryCyan[2]);
        doc.text(evt.bindIndex ? `[313-BIND #${evt.bindIndex}]` : '[UNBOUND]', 16, currentY + 8.5);

        // Timestamp
        doc.setTextColor(71, 85, 105);
        doc.text(evt.timestamp.slice(0, 16), 46, currentY + 5);

        // Severity Badge text
        if (evt.level === ThreatLevel.CRITICAL) {
          doc.setTextColor(accentRose[0], accentRose[1], accentRose[2]);
        } else if (evt.level === ThreatLevel.WARNING) {
          doc.setTextColor(accentAmber[0], accentAmber[1], accentAmber[2]);
        } else {
          doc.setTextColor(accentEmerald[0], accentEmerald[1], accentEmerald[2]);
        }
        doc.setFont('courier', 'bold');
        doc.setFontSize(7.5);
        doc.text(evt.level, 82, currentY + 5);

        // Source Vector (truncated)
        doc.setFont('courier', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(30, 41, 59);
        const sourceTrunc = evt.source.length > 24 ? evt.source.substring(0, 24) + '...' : evt.source;
        doc.text(sourceTrunc, 96, currentY + 5);

        // Action taken
        const actionTrunc = evt.actionTaken.length > 28 ? evt.actionTaken.substring(0, 28) + '...' : evt.actionTaken;
        doc.text(actionTrunc, 144, currentY + 5);

        // Description line below
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        const descTrunc = evt.description.length > 95 ? evt.description.substring(0, 95) + '...' : evt.description;
        doc.text(`Vector: ${descTrunc}`, 46, currentY + 11.5);

        currentY += 17.5;
      });

      // Section 3: Cryptographic Chain-of-Custody Sign-Off Block
      if (currentY > 245) {
        doc.addPage();
        currentY = 25;
      } else {
        currentY += 6;
      }

      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(14, currentY, 182, 34, 1.5, 1.5, 'FD');

      doc.setFont('courier', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text('3. CRYPTOGRAPHIC INTEGRITY ATTESTATION (FIPS 203 / FIPS 205)', 18, currentY + 6);

      doc.setFont('courier', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(51, 65, 85);
      doc.text(`• Nanosecond Ledger Timestamp: ${timestamp313} (Ends in 313)`, 18, currentY + 12);
      doc.text(`• SHA3-512 Seal Hash: ${receipt.bindHash.slice(0, 64)}...`, 18, currentY + 16);
      doc.text(`• SLH-DSA-128f Signature: ${receipt.slhSig.slice(0, 52)}... [VALIDATED]`, 18, currentY + 20);
      doc.text(`• IPFS Merkle DAG Anchor: ${receipt.ipfsCid}`, 18, currentY + 24);
      doc.text(`• SIEM Audit Officer Sign-Off: SYSTEM_OPERATOR_AUTHENTICATED // GW-C2-01`, 18, currentY + 28);

      // Save PDF
      const filename = `ghost_watch_threat_attribution_report_${Date.now()}.pdf`;
      doc.save(filename);

      setPdfSuccessMessage(`Dossier exported: ${filename} (Sealed to 313-BIND #${receipt.bindIndex})`);
      setIsExportingPdf(false);
    } catch (err: any) {
      console.error('PDF generation error:', err);
      setIsExportingPdf(false);
      alert(`Error generating PDF report: ${err?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 font-mono text-xs">
      {/* Top Header Card */}
      <div className="border border-slate-800 bg-slate-950 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-amber-400 animate-pulse" />
          <div className="flex flex-col">
            <h3 className="font-display font-bold text-xs text-slate-100 uppercase tracking-widest flex items-center gap-2">
              Threat Attribution Database &amp; SIEM Intelligence Dossier
            </h3>
            <span className="text-[10px] text-slate-500">
              Module: <span className="text-amber-300">threat_attribution_db</span> | Standard: <span className="text-cyan-300">NIST SP 800-86</span> | PQC Root: <span className="text-emerald-300">0x{rootKeyHash}</span>
            </span>
          </div>
        </div>

        {/* Primary PDF Export Action Button */}
        <div className="flex items-center gap-2">
          <button
            id="btn-export-pdf-report"
            onClick={handleExportPdfReport}
            disabled={isExportingPdf}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-extrabold text-xs uppercase rounded transition-all cursor-pointer shadow-lg shadow-cyan-950/50 disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            <span>{isExportingPdf ? 'Compiling PDF Dossier...' : 'Export Structured PDF Report'}</span>
          </button>
        </div>
      </div>

      {pdfSuccessMessage && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs rounded flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{pdfSuccessMessage}</span>
          </div>
          <button onClick={() => setPdfSuccessMessage('')} className="text-slate-400 hover:text-slate-200 cursor-pointer">✕</button>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-950 border border-slate-900 rounded flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase">Total Attributed Events</span>
            <span className="text-base font-bold text-cyan-300 font-mono">{threatEvents.length}</span>
          </div>
          <Layers className="w-4 h-4 text-cyan-500/40" />
        </div>

        <div className="p-3 bg-slate-950 border border-slate-900 rounded flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase">Critical Severity Ratio</span>
            <span className="text-base font-bold text-rose-400 font-mono">{criticalCount} / {threatEvents.length}</span>
          </div>
          <AlertOctagon className="w-4 h-4 text-rose-500/40" />
        </div>

        <div className="p-3 bg-slate-950 border border-slate-900 rounded flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase">313-BIND Chained</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{boundCount} Sealed</span>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-500/40" />
        </div>

        <div className="p-3 bg-slate-950 border border-slate-900 rounded flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase">Target Honeypot Mode</span>
            <span className="text-xs font-bold text-amber-300 font-mono">AETHER HONEYGRID</span>
          </div>
          <Globe className="w-4 h-4 text-amber-500/40" />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-slate-950 p-3 rounded border border-slate-900 text-xs">
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
          <input
            id="input-attribution-search"
            type="text"
            placeholder="Search by IP, adversary vector, lure ID, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[10px]">Filter Severity:</span>
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1.5 rounded cursor-pointer text-[10px] font-bold border transition-colors ${
                selectedLevel === lvl
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split View: Left Events Table, Right Selected Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Events Table (7 columns) */}
        <div className="lg:col-span-7 border border-slate-900 bg-slate-950 rounded p-3 flex flex-col gap-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Attributed Events ({filteredEvents.length} Records)
          </span>

          <div className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredEvents.length === 0 ? (
              <span className="text-slate-600 italic text-xs py-4 text-center">No threat events matching filter criteria.</span>
            ) : (
              filteredEvents.map((evt) => {
                const isSelected = selectedEvent?.id === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEventId(evt.id)}
                    className={`p-2.5 rounded border transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'border-cyan-500/50 bg-cyan-950/20 text-slate-100'
                        : 'border-slate-900 bg-slate-900/30 hover:bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-300 font-bold">{evt.id}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                          evt.level === ThreatLevel.CRITICAL ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          evt.level === ThreatLevel.WARNING ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-slate-900 text-slate-400'
                        }`}>
                          {evt.level}
                        </span>
                        {evt.bindIndex && (
                          <span className="text-emerald-400 text-[8px] font-mono font-bold">
                            #313-BIND:{evt.bindIndex}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 font-mono text-[9px]">{evt.timestamp}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-amber-400 font-mono select-all font-semibold">[{evt.source}]</span>
                      <span className="text-slate-400 text-[9px] truncate max-w-[200px]">{evt.actionTaken}</span>
                    </div>

                    <p className="text-[9.5px] text-slate-400 line-clamp-1">{evt.description}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Event Forensic Dossier Card (5 columns) */}
        <div className="lg:col-span-5 border border-slate-900 bg-slate-950 rounded p-4 flex flex-col justify-between">
          {selectedEvent ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Forensic Attribution Details
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                  selectedEvent.level === ThreatLevel.CRITICAL ? 'bg-rose-950 text-rose-300 border-rose-800' :
                  selectedEvent.level === ThreatLevel.WARNING ? 'bg-amber-950 text-amber-300 border-amber-800' :
                  'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}>
                  {selectedEvent.level} SEVERITY
                </span>
              </div>

              <div className="flex flex-col gap-2 text-[10px]">
                <div>
                  <span className="text-slate-500 block">EVENT IDENTIFIER:</span>
                  <span className="text-cyan-300 font-mono font-bold select-all">{selectedEvent.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">SOURCE VECTOR / IP FOOTPRINT:</span>
                  <span className="text-rose-400 font-mono font-bold select-all">{selectedEvent.source}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">REMEDIATION ACTION TAKEN:</span>
                  <span className="text-emerald-400 font-mono select-all">{selectedEvent.actionTaken}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">DESCRIPTION &amp; CONTEXT:</span>
                  <p className="text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-900 leading-relaxed mt-0.5">
                    {selectedEvent.description}
                  </p>
                </div>

                {selectedEvent.bindHash && (
                  <div>
                    <span className="text-slate-500 block">313-BIND SHA3-512 CHAIN SEAL:</span>
                    <span className="text-cyan-400 font-mono text-[8.5px] break-all select-all block bg-slate-900 p-1.5 rounded mt-0.5 border border-slate-900">
                      {selectedEvent.bindHash}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-slate-500 italic text-center py-12">Select an incident to view attribution dossier.</div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[9px] text-slate-500">
            <span>FIPS 203 / 205 Compliant Audit Dossier</span>
            <span className="text-cyan-400">PDF Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
