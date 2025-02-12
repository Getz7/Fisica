def calcular_tiempo_crecimiento(initialLength, finalLength, timeUnit):
    growthRate = 2  
    
    if finalLength <= initialLength:
        return "La longitud final debe ser mayor que la inicial."
    

    timeInMonths = (finalLength - initialLength) / growthRate


    if timeUnit == "dias":
        tiempo = timeInMonths * 30
        unidad = "días"
    elif timeUnit == "semanas":
        tiempo = timeInMonths * 4.3
        unidad = "semanas"
    elif timeUnit == "meses":
        tiempo = timeInMonths
        unidad = "meses"
    else:
        return "Unidad de tiempo no válida. Use 'dias', 'semanas' o 'meses'."
    
    return f"El cabello alcanzará {finalLength} cm en aproximadamente {tiempo:.1f} {unidad}."


initialLength = float(input("Ingrese la longitud inicial del cabello (cm): "))
finalLength = float(input("Ingrese la longitud final deseada del cabello (cm): "))
timeUnit = input("Ingrese la unidad de tiempo (dias, semanas, meses): ").strip().lower()


resultado = calcular_tiempo_crecimiento(initialLength, finalLength, timeUnit)
print(resultado)
