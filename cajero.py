class Cajero:

    def __init__(self, cuenta):
        self.__cuenta = cuenta

    def consultar_saldo(self):
        return self.__cuenta.consultar_saldo()

    def extraer_dinero(self, monto):
        return self.__cuenta.extraer_dinero(monto)