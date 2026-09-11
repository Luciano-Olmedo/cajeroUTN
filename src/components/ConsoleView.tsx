import React, { useEffect, useRef } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import { LogEntry } from '../types';

interface ConsoleViewProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const ConsoleView: React.FC<ConsoleViewProps> = ({ logs, onClearLogs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-full font-mono text-xs">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold tracking-wider text-xs">Salida de consola (python main.py)</span>
        </div>
        <button
          id="btn-clear-console"
          type="button"
          onClick={onClearLogs}
          title="Limpiar consola"
          className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-800"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Terminal lines */}
      <div
        ref={scrollRef}
        className="p-4 flex-1 overflow-y-auto space-y-1.5 min-h-[160px] max-h-[300px] lg:max-h-none"
      >
        <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-800/80">
          # Ejecutando Luciano-Olmedo/cajeroUTN
        </div>
        {logs.map((log) => {
          let textClass = 'text-slate-300';
          if (log.type === 'input') textClass = 'text-amber-300 font-semibold';
          if (log.type === 'success') textClass = 'text-emerald-400 font-semibold';
          if (log.type === 'error') textClass = 'text-rose-400 font-semibold';
          if (log.type === 'system') textClass = 'text-cyan-400';

          return (
            <div key={log.id} className={`leading-relaxed whitespace-pre-wrap ${textClass}`}>
              {log.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};
