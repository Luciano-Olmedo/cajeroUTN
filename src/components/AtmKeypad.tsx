import React from 'react';
import { Delete, Check, X } from 'lucide-react';

interface AtmKeypadProps {
  onDigitPress: (digit: string) => void;
  onClear: () => void;
  onEnter: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

export const AtmKeypad: React.FC<AtmKeypadProps> = ({
  onDigitPress,
  onClear,
  onEnter,
  onCancel,
  disabled = false,
}) => {
  const numericKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', ''];

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-xl shadow-inner max-w-sm mx-auto">
      <div className="grid grid-cols-4 gap-2">
        {/* Left 3 columns: Numbers */}
        <div className="col-span-3 grid grid-cols-3 gap-2">
          {numericKeys.map((key, index) => {
            if (key === '') {
              return <div key={`empty-${index}`} className="h-12 w-full" />;
            }
            return (
              <button
                key={key}
                id={`keypad-btn-${key}`}
                type="button"
                disabled={disabled}
                onClick={() => onDigitPress(key)}
                className="h-12 w-full bg-linear-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 active:translate-y-0.5 text-slate-100 font-mono text-xl font-bold rounded-lg border border-slate-600 shadow-md flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {key}
              </button>
            );
          })}
        </div>

        {/* Right 1 column: Action function keys */}
        <div className="col-span-1 flex flex-col justify-between gap-2">
          {/* Cancel (Red) */}
          <button
            id="keypad-btn-cancel"
            type="button"
            disabled={disabled}
            onClick={onCancel}
            title="Cancelar / Salir"
            className="h-12 w-full bg-linear-to-b from-rose-700 to-rose-900 hover:from-rose-600 hover:to-rose-800 active:translate-y-0.5 text-rose-100 font-semibold text-xs tracking-wider uppercase rounded-lg border border-rose-500/60 shadow-md flex flex-col items-center justify-center gap-0.5 transition-all disabled:opacity-40"
          >
            <X className="w-4 h-4 text-rose-200" />
            <span className="text-[10px] leading-tight">CANCEL</span>
          </button>

          {/* Clear / Corregir (Yellow) */}
          <button
            id="keypad-btn-clear"
            type="button"
            disabled={disabled}
            onClick={onClear}
            title="Corregir / Borrar"
            className="h-12 w-full bg-linear-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 active:translate-y-0.5 text-amber-100 font-semibold text-xs tracking-wider uppercase rounded-lg border border-amber-500/60 shadow-md flex flex-col items-center justify-center gap-0.5 transition-all disabled:opacity-40"
          >
            <Delete className="w-4 h-4 text-amber-200" />
            <span className="text-[10px] leading-tight">CLEAR</span>
          </button>

          {/* Enter / Aceptar (Green) */}
          <button
            id="keypad-btn-enter"
            type="button"
            disabled={disabled}
            onClick={onEnter}
            title="Aceptar / Continuar"
            className="h-12 w-full bg-linear-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 active:translate-y-0.5 text-emerald-100 font-semibold text-xs tracking-wider uppercase rounded-lg border border-emerald-500/60 shadow-md flex flex-col items-center justify-center gap-0.5 transition-all disabled:opacity-40"
          >
            <Check className="w-4 h-4 text-emerald-200" />
            <span className="text-[10px] leading-tight">ENTER</span>
          </button>
        </div>
      </div>
    </div>
  );
};
