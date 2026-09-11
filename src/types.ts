export type ScreenState = 'PIN' | 'MENU' | 'EXTRAER' | 'SALDO' | 'SALIR';

export interface LogEntry {
  id: string;
  timestamp: string;
  text: string;
  type?: 'input' | 'output' | 'system' | 'error' | 'success';
}
