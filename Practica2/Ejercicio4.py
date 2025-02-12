import sympy as sp

def calcSeparation(a1, a2, d0, timeEvaluation=3):

    x1_t = 0.5 * a1 * timeEvaluation**2 
    x2_t = 0.5 * a2 * timeEvaluation**2  
    separationTime = d0 + x1_t + x2_t 
    t = sp.symbols('t')
    x1 = 0.5 * a1 * t**2
    x2 = 0.5 * a2 * t**2
    eq_colision = d0 + x1 + x2 
    solutions = sp.solve(eq_colision, t)


    collitionTIme = None
    for sol in solutions:
        if sol.is_real and sol > 0:
            collitionTIme = float(sol)
            break  

    return separationTime, collitionTIme

if __name__ == "__main__":
   
    a1 = float(input("Ingrese la aceleración del primer carrito (m/s²): "))
    a2 = float(input("Ingrese la aceleración del segundo carrito (m/s²): "))
    d0 = float(input("Ingrese la distancia inicial entre los carritos (m): "))


    separationTime, collitionTIme = calcSeparation(a1, a2, d0)

 
    print(f"\nResultados:")
    print(f"Separación después de 3 segundos: {separationTime:.2f} m")
    if collitionTIme:
        print(f"Tiempo de colisión: {collitionTIme:.2f} s")
    else:
        print("Los carritos nunca colisionan.")
