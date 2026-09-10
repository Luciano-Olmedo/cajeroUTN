class Cajero:
    def __init__(self,pin,cuenta):
        self.pin= pin
        self.cuenta=cuenta       
        
    def validar_pin(self,pin_ingresado):                        
        return  pin_ingresado == self.pin
         
        
    def extraer_dinero(self,monto):
        return self.cuenta.extraer(monto)
        
        

    def consultar_saldo(self):
        return self.cuenta.consultar_saldo()