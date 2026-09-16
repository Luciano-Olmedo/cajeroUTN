from cuenta import Cuenta


class CuentaDolares(Cuenta):

    def __init__(self, saldo):
        super().__init__(saldo)