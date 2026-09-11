export class Cuenta {
  // Encapsulamiento privado (__saldo en Python)
  private __saldo: number;

  constructor(saldoInicial: number = 5000000) {
    this.__saldo = Number(saldoInicial);
  }

  consultar_saldo(): number {
    return this.__saldo;
  }

  depositar(monto: number): void {
    const cantidad = Number(monto);
    if (cantidad > 0) {
      this.__saldo += cantidad;
    }
  }

  extraer(monto: number): boolean {
    const cantidad = Number(monto);
    if (cantidad > 0 && cantidad <= this.__saldo) {
      this.__saldo -= cantidad;
      return true;
    }
    return false;
  }

  reset(saldo: number = 5000000): void {
    this.__saldo = Number(saldo);
  }
}
