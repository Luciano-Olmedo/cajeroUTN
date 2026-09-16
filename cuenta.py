class Cuenta:

    def __init__(self, saldo):
        self.__saldo = saldo

    def consultar_saldo(self):
        return self.__saldo

    def extraer_dinero(self, monto):
        if monto <= 0:
            return False

        if monto > self.__saldo:
            return False

        self.__saldo -= monto
        return True