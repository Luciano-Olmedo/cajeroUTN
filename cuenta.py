from decimal import Decimal
class Cuenta:
    
    def __init__(self,saldo):
        self.saldo= Decimal(str(saldo))
        
    def consultar_saldo(self):
        return self.saldo
    
    def depositar(self,monto):
        monto = Decimal(str(monto))
        
    def extraer(self,monto):
        monto = Decimal(str(monto))       
        if monto <= self.saldo:
            self.saldo -= monto 
            return True
        return False
    
    