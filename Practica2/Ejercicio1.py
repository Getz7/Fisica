def impulseTimeCalculation(distanceMS):
    velocityMS = 100  
    timeMS = distanceMS / velocityMS
    return timeMS

if __name__ == "__main__":
    try:
        distanceMS = float(input("Ingrese la distancia desde el punto de contacto hasta el cerebro (en metros): "))
        if distanceMS <= 0:
            print("La distancia debe ser un número positivo.")
        else:
            timeMS = impulseTimeCalculation(distanceMS)
            print(f"El impulso nervioso tarda aproximadamente {timeMS:.6f} segundos en llegar al cerebro.")
    except ValueError:
        print("Por favor, ingrese un número válido.")
