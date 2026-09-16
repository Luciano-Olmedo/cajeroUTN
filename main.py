from cuenta_pesos import CuentaPesos
from cajero import Cajero


cuenta = CuentaPesos(100000000)
cajero = Cajero(cuenta)


while True:

    print("\n--- CAJERO AUTOMÁTICO ---")
    print("1. Extracción")
    print("2. Consulta de saldo")
    print("3. Salir")

    opcion = input("Seleccione una opción: ")

    if opcion == "1":

        monto = float(input("Ingrese el monto a extraer: "))

        if cajero.extraer_dinero(monto):
            print("Extracción realizada correctamente.")
        else:
            print("No se pudo realizar la extracción.")

    elif opcion == "2":

        saldo = cajero.consultar_saldo()
        print(f"Saldo disponible: ${saldo:.2f}")

    elif opcion == "3":

        print("Gracias por utilizar el cajero.")
        break

    else:
        print("Opción inválida.")