from decimal import Decimal
class Cuenta:
    
    def __init__(self,saldo):
        self.__saldo= Decimal(str(saldo))
        
    def consultar_saldo(self):
        return self.__saldo
    
    def depositar(self,monto):
        monto = Decimal(str(monto))
        
    def extraer(self,monto):
        monto = Decimal(str(monto))       
        if monto <= self.__saldo:
            self.__saldo -= monto 
            return True
        return False
    
    