import React, { useState } from 'react';
import { ShieldAlert, AlertOctagon, Key, Database, RefreshCw, KeyRound, CheckCircle } from 'lucide-react';

interface OmegaProps {
  onTriggerWipe: () => void;
  isWiped: boolean;
  onRestore: () => void;
}

export const OmegaContingency: React.FC<OmegaProps> = ({ onTriggerWipe, isWiped, onRestore }) => {
  const [confirmInput, setConfirmInput] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [verificationWord, setVerificationWord] = useState('');
  const [restoreError, setRestoreError] = useState('');
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  const fullSeed = [
    "vortex", "neon", "carbon", "phantom", "nexus", "tactical",
    "sierra", "pulse", "zenith", "echo", "quartz", "cobalt",
    "cipher", "orbit", "binary", "flux", "omega", "hunter",
    "stealth", "grid", "shadow", "vertex", "ionic", "static"
  ];

  const triggerSequence = () => {
    if (confirmInput !== 'CONFIRM_WIPE') return;
    setCountdown(5);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) {
          clearInterval(interval);
          return null;
        }
        if (prev <= 1) {
          clearInterval(interval);
          onTriggerWipe();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRestore = (e: React.FormEvent) => {
    e.preventDefault();
    // Demand that they verify the 17th seed word (word list is 0-indexed, so 17th is index 16: "omega")
    // Or let's say "omega" or "hunter"
    if (verificationWord.toLowerCase().trim() === 'omega' || verificationWord.toLowerCase().trim() === 'vortex') {
      setRestoreSuccess(true);
      setRestoreError('');
      setTimeout(() => {
        onRestore();
        setVerificationWord('');
        setConfirmInput('');
        setRestoreSuccess(false);
      }, 1500);
    } else {
      setRestoreError("CRYPTOGRAPHIC DISCREPANCY: Input seed does not match the geographical Split-Key signature ledger.");
    }
  };

  return (
    <div className="border border-slate-800 bg-slate-950 p-6 rounded font-mono relative overflow-hidden">
      
      {!isWiped ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-3">
                <AlertOctagon className="w-5 h-5 text-rose-500 animate-pulse" />
                <h3 className="font-display font-medium text-[13px] text-slate-200 tracking-widest uppercase">
                  Omega Contingency (Wipe)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-4 text-justify">
                <strong>CRITICAL OPERATIONS GUIDE:</strong> Executing the Omega Contingency immediately purges all volatile keys, exfiltration decoy profiles, and active DNS tokens from server-side hosting memory. Sovereignty reverts entirely to the physical seed.
              </p>
            </div>

            <div className="border border-rose-950 bg-rose-950/20 p-3 rounded text-[10px] text-rose-400">
              <span className="font-bold block uppercase mb-1">Trigger Signature Action</span>
              <span>CTRL+SHIFT+ALT+WIPE is simulated below to instantly isolate and sanitize host HB-9982-AX-2026.</span>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col gap-4 border-l border-slate-900 pl-0 md:pl-6">
            <div className="bg-slate-900/10 border border-slate-900 p-4 rounded flex flex-col gap-3">
              <span className="text-xs text-slate-300 font-bold">CRYPTO MEMORY PURGE FORM</span>
              <div>
                <label className="text-slate-500 block text-[10px] mb-1">To verify authorize command authorization, type "CONFIRM_WIPE":</label>
                <div className="flex gap-2">
                  <input
                    id="input-confirm-wipe"
                    type="text"
                    required
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    placeholder="CONFIRM_WIPE"
                    className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-rose-400 placeholder-slate-700 font-bold focus:outline-none focus:border-rose-500 flex-1 uppercase"
                  />
                  <button
                    id="btn-confirm-wipe-action"
                    disabled={confirmInput !== 'CONFIRM_WIPE' || countdown !== null}
                    onClick={triggerSequence}
                    className="px-4 py-1.5 rounded bg-rose-950 border border-rose-500/50 hover:bg-rose-900 text-rose-300 font-bold text-xs cursor-pointer select-none transition-colors disabled:opacity-50"
                  >
                    ⚡ Execute Wipe
                  </button>
                </div>
              </div>

              {countdown !== null && (
                <div className="p-3 bg-rose-900 text-center rounded border border-rose-500 animate-pulse">
                  <span className="font-display font-bold text-lg text-white block uppercase">WARNING: ACTIVE PURGE COUNTDOWN</span>
                  <span className="font-mono text-xs text-rose-200">Wiping physical memory frames in {countdown} seconds ...</span>
                </div>
              )}
            </div>

            <div className="bg-slate-900/35 border border-slate-900 p-3.5 rounded text-[11px] text-slate-400">
              <span className="font-bold text-slate-300 block mb-1">The Split-Key physical storage scheme:</span>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-slate-950 border border-slate-900 p-2 rounded text-[10px]">
                  <strong className="text-amber-500 block uppercase mb-0.5">Split-Key Alpha (Words 1-12)</strong>
                  <span className="font-mono text-slate-500 leading-normal">
                    vortex, neon, carbon, phantom, nexus, tactical, sierra, pulse, zenith, echo, quartz, cobalt
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-2 rounded text-[10px]">
                  <strong className="text-amber-500 block uppercase mb-0.5">Split-Key Omega (Words 13-24)</strong>
                  <span className="font-mono text-slate-500 leading-normal">
                    cipher, orbit, binary, flux, omega, hunter, stealth, grid, shadow, vertex, ionic, static
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center max-w-lg mx-auto py-6">
          <ShieldAlert className="w-16 h-16 text-rose-500 animate-ping mb-4 stroke-1" />
          <h2 className="font-display font-bold text-base text-rose-400 uppercase tracking-widest text-center">
            [ GHOST-WATCH CORE: SECURED AND PURGED ]
          </h2>
          <p className="text-[11px] text-slate-400 text-center leading-normal mt-2 max-w-sm mb-6">
            All database lures, SIEM syncs, and private ML-KEM session keys have been successfully scrubbed. The system is currently in safe cold-isolation.
          </p>

          <form onSubmit={handleRestore} className="w-full bg-slate-900/60 p-4 rounded border border-slate-800 text-xs flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-slate-200 font-bold border-b border-slate-800 pb-1.5 uppercase tracking-wide">
              <Key className="w-4 h-4 text-emerald-400" /> Cryo-Vault Seed Recovery Entry
            </div>

            <p className="text-[10px] text-slate-500 leading-normal">
              Digital identity preservation verified via manual Split-Key entry. Input the <strong>17th word</strong> (index 16, representing key omega state) or <strong>1st word</strong> of your geographic physical backup key plate:
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-400">Restoration Seed Word Entry:</label>
              <input
                id="input-verification-seed"
                type="text"
                required
                value={verificationWord}
                onChange={(e) => setVerificationWord(e.target.value)}
                placeholder="Type 'omega' or 'vortex'"
                className="bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-bold focus:outline-none focus:border-emerald-500 placeholder-slate-700"
              />
            </div>

            {restoreError && (
              <span className="text-rose-400 font-bold text-[10px] bg-rose-950/20 border border-rose-900/40 p-2 rounded block leading-normal">
                {restoreError}
              </span>
            )}

            {restoreSuccess && (
              <span className="text-emerald-400 font-bold text-[10px] bg-emerald-950/20 border border-emerald-900/40 p-2 rounded block leading-normal flex items-center gap-1.5 select-none">
                <CheckCircle className="w-4 h-4 text-emerald-450 animate-bounce" /> CRYPTOGRAPHIC ALIGNMENT SECURED. Reassembling core keyring...
              </span>
            )}

            <button
              id="btn-reconstruct-c2"
              type="submit"
              disabled={restoreSuccess}
              className="w-full py-2 bg-emerald-950 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900 font-bold uppercase tracking-wider text-xs rounded transition-colors cursor-pointer select-none"
            >
              Reconstruct C2 Framework
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
