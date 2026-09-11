import React from 'react';
import { ScreenState } from '../types';
import {
  ShieldCheck,
  AlertTriangle,
  Banknote,
  DollarSign,
  ArrowLeft,
  LogOut,
  CreditCard,
  CheckCircle,
} from 'lucide-react';

interface AtmScreenProps {
  screen: ScreenState;
  pinInput: string;
  pinError: string | null;
  saldo: number;
  montoInput: string;
  extraccionMsg: { type: 'success' | 'error'; text: string } | null;
  onSelectOption: (option: 1 | 2 | 3) => void;
  onConfirmExtraccion: () => void;
  onQuickMonto: (monto: number) => void;
  onBackToMenu: () => void;
  onResetSession: () => void;
}

export const AtmScreen: React.FC<AtmScreenProps> = ({
  screen,
  pinInput,
  pinError,
  saldo,
  montoInput,
  extraccionMsg,
  onSelectOption,
  onConfirmExtraccion,
  onQuickMonto,
  onBackToMenu,
  onResetSession,
}) => {
  return (
    <div className="relative bg-neutral-950 border-4 border-slate-700 rounded-xl overflow-hidden shadow-2xl p-5 md:p-7 min-h-[360px] flex flex-col justify-between text-emerald-400 font-mono select-none">
      {/* Subtle CRT scanline overlay effect for authentic ATM feel */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-30 z-10" />

      {/* Screen Header */}
      <div className="relative z-20 flex items-center justify-between border-b border-emerald-900/60 pb-3 mb-4 text-xs md:text-sm tracking-wider">
        <div className="flex items-center gap-2 text-emerald-300 font-bold">
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span>CAJERO AUTOMÁTICO UTN</span>
        </div>
        <div className="text-emerald-500/80 text-[11px] uppercase tracking-widest">
          {screen === 'PIN' && 'Autenticación'}
          {screen === 'MENU' && 'Menú Principal'}
          {screen === 'EXTRAER' && 'Extracción'}
          {screen === 'SALDO' && 'Consulta de Saldo'}
          {screen === 'SALIR' && 'Sesión Finalizada'}
        </div>
      </div>

      {/* Main Screen Body based on Screen State */}
      <div className="relative z-20 flex-1 flex flex-col justify-center items-center py-2">
        {/* ================= 1. PIN SCREEN ================= */}
        {screen === 'PIN' && (
          <div className="w-full max-w-sm flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg md:text-xl font-bold text-emerald-200 tracking-wide">
                Ingrese su pin:
              </h2>
              <p className="text-xs text-emerald-600 font-sans">
                (PIN establecido en el repositorio: <span className="font-mono text-emerald-400 font-semibold">1234</span>)
              </p>
            </div>

            {/* PIN display boxes */}
            <div className="flex justify-center items-center gap-3 my-2">
              {[0, 1, 2, 3].map((index) => {
                const isFilled = index < pinInput.length;
                return (
                  <div
                    key={index}
                    className={`w-11 h-12 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                      isFilled
                        ? 'border-emerald-400 bg-emerald-950/90 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                        : 'border-emerald-900/60 bg-emerald-950/20 text-emerald-700'
                    }`}
                  >
                    {isFilled ? '•' : ''}
                  </div>
                );
              })}
            </div>

            {/* Error Message */}
            {pinError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 px-3 py-1.5 rounded-md animate-shake">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <p className="text-[11px] text-emerald-500/70">
              Use el teclado numérico o presione <span className="text-emerald-300 font-bold">ENTER</span> para validar.
            </p>
          </div>
        )}

        {/* ================= 2. MENU SCREEN ================= */}
        {screen === 'MENU' && (
          <div className="w-full flex flex-col justify-center space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-base md:text-lg font-bold text-emerald-200 uppercase tracking-wider">
                Cajero Automático
              </h2>
              <p className="text-xs text-emerald-500">Seleccione una opción:</p>
            </div>

            <div className="grid grid-cols-1 gap-3 max-w-md mx-auto w-full">
              {/* Opción 1: Extraer Dinero */}
              <button
                id="menu-btn-extraer"
                type="button"
                onClick={() => onSelectOption(1)}
                className="group flex items-center justify-between p-3.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/60 hover:border-emerald-400 rounded-lg transition-all text-left shadow-sm hover:shadow-[0_0_12px_rgba(52,211,153,0.2)] active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 group-hover:bg-emerald-800">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-emerald-200 group-hover:text-emerald-100 text-sm md:text-base">
                      Extraer Dinero
                    </span>
                    <p className="text-[11px] text-emerald-600 font-sans">Retiro de efectivo de la cuenta</p>
                  </div>
                </div>
                <Banknote className="w-5 h-5 text-emerald-500 group-hover:text-emerald-300" />
              </button>

              {/* Opción 2: Consultar Saldo */}
              <button
                id="menu-btn-saldo"
                type="button"
                onClick={() => onSelectOption(2)}
                className="group flex items-center justify-between p-3.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/60 hover:border-emerald-400 rounded-lg transition-all text-left shadow-sm hover:shadow-[0_0_12px_rgba(52,211,153,0.2)] active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 group-hover:bg-emerald-800">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-emerald-200 group-hover:text-emerald-100 text-sm md:text-base">
                      Consultar Saldo
                    </span>
                    <p className="text-[11px] text-emerald-600 font-sans">Ver el saldo disponible actual</p>
                  </div>
                </div>
                <DollarSign className="w-5 h-5 text-emerald-500 group-hover:text-emerald-300" />
              </button>

              {/* Opción 3: Salir */}
              <button
                id="menu-btn-salir"
                type="button"
                onClick={() => onSelectOption(3)}
                className="group flex items-center justify-between p-3.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/60 hover:border-emerald-400 rounded-lg transition-all text-left shadow-sm hover:shadow-[0_0_12px_rgba(52,211,153,0.2)] active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 group-hover:bg-emerald-800">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-emerald-200 group-hover:text-emerald-100 text-sm md:text-base">
                      Salir
                    </span>
                    <p className="text-[11px] text-emerald-600 font-sans">Finalizar sesión y retirar tarjeta</p>
                  </div>
                </div>
                <LogOut className="w-5 h-5 text-emerald-500 group-hover:text-emerald-300" />
              </button>
            </div>
          </div>
        )}

        {/* ================= 3. EXTRAER SCREEN ================= */}
        {screen === 'EXTRAER' && (
          <div className="w-full max-w-md flex flex-col items-center space-y-4">
            <div className="text-center">
              <h2 className="text-base font-bold text-emerald-200">1 - Ingrese el monto a extraer:</h2>
              <p className="text-xs text-emerald-500 font-sans">
                Saldo disponible: <span className="font-mono text-emerald-300 font-bold">${saldo}</span>
              </p>
            </div>

            {/* Input field */}
            <div className="w-full bg-black/60 border-2 border-emerald-500/60 rounded-xl p-3 flex items-center justify-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
              <span className="text-2xl text-emerald-500 font-bold mr-2">$</span>
              <span className="text-3xl font-mono font-bold tracking-wider text-emerald-300 min-h-[36px] flex items-center">
                {montoInput || '0'}
              </span>
            </div>

            {/* Quick denomination pills */}
            <div className="w-full">
              <p className="text-[11px] text-emerald-600 mb-1 text-center font-sans">Montos rápidos:</p>
              <div className="grid grid-cols-4 gap-2">
                {[1000, 5000, 20000, 100000].map((amt) => (
                  <button
                    key={amt}
                    id={`quick-amt-${amt}`}
                    type="button"
                    onClick={() => onQuickMonto(amt)}
                    className="py-1.5 px-2 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/60 hover:border-emerald-400 text-emerald-300 text-xs font-bold rounded-md transition-all active:scale-95 font-mono"
                  >
                    ${amt.toLocaleString('es-AR')}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback message (Extracion realizada / Saldo insuficiente) */}
            {extraccionMsg && (
              <div
                className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-bold transition-all ${
                  extraccionMsg.type === 'success'
                    ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                }`}
              >
                {extraccionMsg.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{extraccionMsg.text}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="w-full flex gap-2 pt-1">
              <button
                id="btn-confirmar-extraccion"
                type="button"
                onClick={onConfirmExtraccion}
                className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-emerald-950 font-bold rounded-lg transition-all text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-1.5"
              >
                <Banknote className="w-4 h-4" />
                <span>Extraer</span>
              </button>

              <button
                id="btn-volver-menu"
                type="button"
                onClick={onBackToMenu}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-emerald-300 font-semibold rounded-lg transition-all text-xs tracking-wider active:scale-98 flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= 4. SALDO SCREEN ================= */}
        {screen === 'SALDO' && (
          <div className="w-full max-w-md flex flex-col items-center text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
              <DollarSign className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xs uppercase tracking-widest text-emerald-500">
                Consulta de Saldo
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-emerald-200 tracking-wide font-mono">
                Saldo disponible:$ {saldo}
              </p>
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-900/60 rounded-lg text-xs text-emerald-400/90 font-sans max-w-xs">
              Monto actualizado de la cuenta según la clase <code className="font-mono text-emerald-300">Cuenta</code>.
            </div>

            <button
              id="btn-saldo-volver"
              type="button"
              onClick={onBackToMenu}
              className="py-2.5 px-6 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold rounded-lg transition-all text-xs tracking-wider uppercase shadow-md active:scale-98 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al menú</span>
            </button>
          </div>
        )}

        {/* ================= 5. SALIR SCREEN ================= */}
        {screen === 'SALIR' && (
          <div className="w-full max-w-sm flex flex-col items-center text-center space-y-5 py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
              <CreditCard className="w-7 h-7 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg md:text-xl font-bold text-emerald-200 tracking-wide">
                Gracias por venir retire su tarjeta
              </h2>
              <p className="text-xs text-emerald-500/80 font-sans">
                Operación completada con éxito en el cajero.
              </p>
            </div>

            <button
              id="btn-reiniciar-sesion"
              type="button"
              onClick={onResetSession}
              className="mt-4 py-2.5 px-6 bg-emerald-700 hover:bg-emerald-600 text-emerald-950 font-bold rounded-lg transition-all text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-98 flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Insertar tarjeta / Iniciar de nuevo</span>
            </button>
          </div>
        )}
      </div>

      {/* Screen Footer */}
      <div className="relative z-20 border-t border-emerald-900/60 pt-2.5 mt-3 flex items-center justify-between text-[11px] text-emerald-600">
        <span>RED UTN BANCARIA</span>
        <span className="font-mono">TERMINAL #001</span>
      </div>
    </div>
  );
};
