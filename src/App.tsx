import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Cuenta } from './models/cuenta';
import { Cajero } from './models/cajero';
import { ScreenState, LogEntry } from './types';
import { AtmScreen } from './components/AtmScreen';
import { AtmKeypad } from './components/AtmKeypad';
import { ConsoleView } from './components/ConsoleView';
import {
  CreditCard,
  Banknote,
  RotateCcw,
  Sparkles,
  Github,
} from 'lucide-react';

export default function App() {
  // Initialize OOP models from the repository
  const cuenta = useMemo(() => new Cuenta(5000000), []);
  const cajero = useMemo(() => new Cajero(1234, cuenta), [cuenta]);

  // UI state
  const [screen, setScreen] = useState<ScreenState>('PIN');
  const [saldo, setSaldo] = useState<number>(cuenta.consultar_saldo());
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [montoInput, setMontoInput] = useState<string>('');
  const [extraccionMsg, setExtraccionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dispensingCash, setDispensingCash] = useState<boolean>(false);
  const [lastDispensedAmount, setLastDispensedAmount] = useState<number>(0);
  const [isCardInserted, setIsCardInserted] = useState<boolean>(true);

  // Terminal log
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      text: 'cuenta = Cuenta(5000000)\ncajero = Cajero(1234, cuenta)\nIngrese su pin: ',
      type: 'system',
    },
  ]);

  const addLog = useCallback((text: string, type: LogEntry['type'] = 'output') => {
    setLogs((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        text,
        type,
      },
    ]);
  }, []);

  // Update saldo state helper
  const syncSaldo = useCallback(() => {
    setSaldo(cajero.consultar_saldo());
  }, [cajero]);

  // Handle PIN validation
  const handleValidatePin = useCallback(() => {
    if (!pinInput) {
      setPinError('Ingrese un número de PIN');
      return;
    }

    const pinNumber = parseInt(pinInput, 10);
    addLog(`> ${pinInput}`, 'input');

    if (cajero.validar_pin(pinNumber)) {
      setPinError(null);
      addLog('Ingreso exitoso', 'success');
      addLog('\nCajero Automático\n1- Extraer Dinero\n2- Consultar Saldo\n3- Salir\nseleccione una opcion: ', 'system');
      setScreen('MENU');
      setPinInput('');
    } else {
      setPinError('PIN incorrecto. Intente con 1234');
      addLog('PIN incorrecto. Intente nuevamente', 'error');
      setPinInput('');
    }
  }, [pinInput, cajero, addLog]);

  // Handle Option Selection
  const handleSelectOption = useCallback((option: 1 | 2 | 3) => {
    addLog(`seleccione una opcion: ${option}`, 'input');

    if (option === 1) {
      setScreen('EXTRAER');
      setMontoInput('');
      setExtraccionMsg(null);
      addLog('Ingrese el monto a extraer: ', 'system');
    } else if (option === 2) {
      setScreen('SALDO');
      const saldoActual = cajero.consultar_saldo();
      syncSaldo();
      addLog(`Saldo disponible:$ ${saldoActual}`, 'output');
    } else if (option === 3) {
      setScreen('SALIR');
      setIsCardInserted(false);
      addLog('Gracias por venir retire su tarjeta', 'system');
    }
  }, [cajero, addLog, syncSaldo]);

  // Handle Extraction Confirmation
  const handleConfirmExtraccion = useCallback(() => {
    const monto = parseFloat(montoInput);
    if (isNaN(monto) || monto <= 0) {
      setExtraccionMsg({ type: 'error', text: 'Monto inválido' });
      return;
    }

    addLog(`Ingrese el monto a extraer: ${monto}`, 'input');

    if (cajero.extraer_dinero(monto)) {
      syncSaldo();
      setExtraccionMsg({ type: 'success', text: 'Extracion realizada' });
      addLog('Extracion realizada', 'success');
      setLastDispensedAmount(monto);
      setDispensingCash(true);
      setTimeout(() => setDispensingCash(false), 3500);
      setMontoInput('');
    } else {
      setExtraccionMsg({ type: 'error', text: 'Saldo insuficiente' });
      addLog('Saldo insuficiente', 'error');
    }
  }, [montoInput, cajero, addLog, syncSaldo]);

  const handleQuickMonto = useCallback((monto: number) => {
    setMontoInput(monto.toString());
  }, []);

  const handleBackToMenu = useCallback(() => {
    setScreen('MENU');
    setExtraccionMsg(null);
    setMontoInput('');
    addLog('\nCajero Automático\n1- Extraer Dinero\n2- Consultar Saldo\n3- Salir\nseleccione una opcion: ', 'system');
  }, [addLog]);

  // Reset entire session
  const handleResetSession = useCallback(() => {
    cuenta.reset(5000000);
    syncSaldo();
    setScreen('PIN');
    setPinInput('');
    setPinError(null);
    setMontoInput('');
    setExtraccionMsg(null);
    setDispensingCash(false);
    setIsCardInserted(true);
    setLogs([
      {
        id: 'reset-log',
        timestamp: new Date().toLocaleTimeString(),
        text: '--- Reinicio del Cajero ---\ncuenta = Cuenta(5000000)\ncajero = Cajero(1234, cuenta)\nIngrese su pin: ',
        type: 'system',
      },
    ]);
  }, [cuenta, syncSaldo]);

  // Keypad actions
  const handleDigitPress = useCallback((digit: string) => {
    if (screen === 'PIN') {
      if (pinInput.length < 4) {
        setPinInput((prev) => prev + digit);
        setPinError(null);
      }
    } else if (screen === 'MENU') {
      if (digit === '1') handleSelectOption(1);
      else if (digit === '2') handleSelectOption(2);
      else if (digit === '3') handleSelectOption(3);
    } else if (screen === 'EXTRAER') {
      if (montoInput.length < 6) {
        setMontoInput((prev) => (prev === '0' ? digit : prev + digit));
      }
    }
  }, [screen, pinInput, montoInput, handleSelectOption]);

  const handleClear = useCallback(() => {
    if (screen === 'PIN') {
      setPinInput('');
      setPinError(null);
    } else if (screen === 'EXTRAER') {
      setMontoInput('');
      setExtraccionMsg(null);
    }
  }, [screen]);

  const handleEnter = useCallback(() => {
    if (screen === 'PIN') {
      handleValidatePin();
    } else if (screen === 'EXTRAER') {
      handleConfirmExtraccion();
    } else if (screen === 'SALDO') {
      handleBackToMenu();
    } else if (screen === 'SALIR') {
      handleResetSession();
    }
  }, [screen, handleValidatePin, handleConfirmExtraccion, handleBackToMenu, handleResetSession]);

  const handleCancel = useCallback(() => {
    if (screen === 'EXTRAER' || screen === 'SALDO') {
      handleBackToMenu();
    } else if (screen === 'MENU') {
      handleSelectOption(3);
    } else if (screen === 'PIN') {
      setPinInput('');
    }
  }, [screen, handleBackToMenu, handleSelectOption]);

  // Listen to physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is inside a form input if any
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleDigitPress(e.key);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleEnter();
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        if (screen === 'PIN') {
          setPinInput((prev) => prev.slice(0, -1));
        } else if (screen === 'EXTRAER') {
          setMontoInput((prev) => prev.slice(0, -1));
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigitPress, handleEnter, handleCancel, screen]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-sm px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-sm md:text-base flex items-center gap-2">
                <span>Cajero Automático UTN</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                  POO
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Basado en <span className="text-emerald-400 font-mono">Luciano-Olmedo/cajeroUTN</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-global-reset"
              type="button"
              onClick={handleResetSession}
              title="Reiniciar a saldo inicial ($5.000.000)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
            <a
              href="https://github.com/Luciano-Olmedo/cajeroUTN"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Repositorio</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Center Column: ATM Machine (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* ATM Physical Housing Chassis */}
          <div className="w-full max-w-md bg-linear-to-b from-slate-800 via-slate-850 to-slate-900 border-2 border-slate-700 rounded-3xl p-5 md:p-6 shadow-2xl relative">
            {/* ATM Brand Header Plate */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-xs font-bold tracking-widest text-slate-300 uppercase">
                  UTN BANCA ELECTRÓNICA
                </span>
              </div>
              <div className="text-[10px] tracking-wider text-slate-500 font-mono">
                PIN: 1234
              </div>
            </div>

            {/* ATM Screen Container */}
            <div className="mb-6 relative">
              <AtmScreen
                screen={screen}
                pinInput={pinInput}
                pinError={pinError}
                saldo={saldo}
                montoInput={montoInput}
                extraccionMsg={extraccionMsg}
                onSelectOption={handleSelectOption}
                onConfirmExtraccion={handleConfirmExtraccion}
                onQuickMonto={handleQuickMonto}
                onBackToMenu={handleBackToMenu}
                onResetSession={handleResetSession}
              />
            </div>

            {/* Cash Dispenser Slot */}
            <div className="mb-5 bg-slate-950/80 border border-slate-700 rounded-xl p-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 px-1">
                <span className="flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                  Ranura de Efectivo (Cash Dispenser)
                </span>
                {dispensingCash && (
                  <span className="text-emerald-400 font-bold animate-pulse">
                    Dispensando ${lastDispensedAmount}...
                  </span>
                )}
              </div>
              {/* Cash slot opening */}
              <div className="relative h-6 bg-slate-900 rounded-lg border-2 border-slate-800 overflow-hidden flex items-center justify-center">
                <div className="w-4/5 h-1.5 bg-black rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]" />

                {/* Animated cash bills emerging when dispensing */}
                {dispensingCash && (
                  <div className="absolute inset-x-8 top-0 h-6 bg-emerald-700 border border-emerald-400 text-[10px] font-bold text-white flex items-center justify-center rounded shadow-lg animate-bounce">
                    💵 ${lastDispensedAmount} Pesos dispensados
                  </div>
                )}
              </div>
            </div>

            {/* ATM Lower Panel: Card Slot & Keypad */}
            <div className="grid grid-cols-1 gap-4 pt-2 border-t border-slate-700/60">
              {/* Card slot indicator */}
              <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isCardInserted
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                        : 'bg-amber-500 animate-ping'
                    }`}
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-300">
                      {isCardInserted ? 'Tarjeta ingresada' : 'Tarjeta retirada'}
                    </span>
                    <p className="text-[11px] text-slate-500 font-sans">
                      {isCardInserted ? 'Sesión en curso' : 'Retire su tarjeta o reinicie'}
                    </p>
                  </div>
                </div>

                {!isCardInserted && (
                  <button
                    id="btn-reinsert-card"
                    type="button"
                    onClick={handleResetSession}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-md transition-all active:scale-95"
                  >
                    Insertar
                  </button>
                )}
              </div>

              {/* Physical/Visual Keypad */}
              <AtmKeypad
                onDigitPress={handleDigitPress}
                onClear={handleClear}
                onEnter={handleEnter}
                onCancel={handleCancel}
                disabled={!isCardInserted && screen === 'SALIR'}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Console Mirror & Repo Specification Details (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Real-time Console Log Mirroring `python main.py` */}
          <div className="h-[360px] lg:h-[420px]">
            <ConsoleView logs={logs} onClearLogs={() => setLogs([])} />
          </div>

          {/* Quick reference panel showing the exact Python methods & values */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-semibold border-b border-slate-800 pb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Funcionalidades según repositorio</span>
            </div>

            <div className="space-y-2 text-slate-400 leading-relaxed font-sans">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono font-bold">1.</span>
                <div>
                  <strong className="text-slate-200 font-mono">cajero.validar_pin(1234)</strong>:
                  Verifica el PIN ingresado con el guardado en el cajero.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono font-bold">2.</span>
                <div>
                  <strong className="text-slate-200 font-mono">cajero.consultar_saldo()</strong>:
                  Consulta el saldo disponible en la clase <code className="font-mono text-emerald-300">Cuenta</code> (inicial: $5.000.000, atributo privado encapsulado).
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono font-bold">3.</span>
                <div>
                  <strong className="text-slate-200 font-mono">cajero.extraer_dinero(monto)</strong>:
                  Si <code className="font-mono text-slate-300">monto &lt;= saldo</code> descuenta y muestra &quot;Extracion realizada&quot;, sino &quot;Saldo insuficiente&quot;.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono font-bold">4.</span>
                <div>
                  <strong className="text-slate-200 font-mono">Salir</strong>:
                  Termina la sesión con &quot;Gracias por venir retire su tarjeta&quot;.
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
              Control: Puede usar tanto el teclado numérico en pantalla como el teclado de su computadora (teclas 0-9, Enter, Backspace, Esc).
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950 px-4 py-3 text-center text-xs text-slate-500 font-mono">
        Cajero Automático UTN • Simulación POO Python a Web
      </footer>
    </div>
  );
}
