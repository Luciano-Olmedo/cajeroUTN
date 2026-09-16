from cuenta import Cuenta

class CuentaPesos(Cuenta):
    def __init__(self, saldo):
        super().__init__(saldo)