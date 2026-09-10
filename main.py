from cajero import *
from cuenta import *
from decimal import Decimal

cuenta = Cuenta(100)
cajero = Cajero(1234, cuenta)

pin = int(input("Ingrese su pin: "))

if cajero.validar_pin(pin):
    print("Ingreso exitoso")

while True:
    print("\nCajero Automático")
    print("1- Extraer Dinero")
    print("2- Consultar Saldo")
    print("3- Salir")

    opcion = int(input("seleccione una opcion: "))

    if opcion == 1:
        monto = Decimal(input("Ingrese el monto a extraer: "))
        if cajero.extraer_dinero(monto):
            print(f"Extracion realizada")
        else:
            print("Saldo insuficiente")
    if opcion == 2:
        print(f"Saldo disponible:$ {cajero.consultar_saldo()}")

    if opcion == 3:
        print("Gracias por venir retire su tarjeta")
        break
 
