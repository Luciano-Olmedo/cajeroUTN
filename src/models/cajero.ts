import { Cuenta } from './cuenta';

export class Cajero {
  // Encapsulamiento privado (__pin en Python)
  private __pin: number;
  public cuenta: Cuenta;

  constructor(pin: number = 1234, cuenta: Cuenta) {
    this.__pin = Number(pin);
    this.cuenta = cuenta;
  }

  validar_pin(pin_ingresado: number): boolean {
    return Number(pin_ingresado) === this.__pin;
  }

  extraer_dinero(monto: number): boolean {
    return this.cuenta.extraer(monto);
  }

  consultar_saldo(): number {
    return this.cuenta.consultar_saldo();
  }
}
