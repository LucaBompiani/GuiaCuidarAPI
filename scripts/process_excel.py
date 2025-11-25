#!/usr/bin/env python3
"""
Script para processar planilha de escolarização e torná-la utilizável em BD
"""
import pandas as pd
import sys

def main():
    # Ler o arquivo Excel
    file_path = "escolarizacao-6 anos-ou-mais-por-sexo-idades-existencia-deficiencia.xlsx"
    
    print("Lendo arquivo Excel...")
    df = pd.read_excel(file_path)
    
    print("\n=== INFORMAÇÕES DA PLANILHA ===")
    print(f"Dimensões: {df.shape[0]} linhas x {df.shape[1]} colunas")
    
    print("\n=== HEADERS (Colunas) ===")
    for i, col in enumerate(df.columns):
        print(f"{i}: {col}")
    
    print("\n=== PRIMEIRAS 5 LINHAS ===")
    print(df.head())
    
    print("\n=== TIPOS DE DADOS ===")
    print(df.dtypes)
    
    print("\n=== VALORES NULOS ===")
    print(df.isnull().sum())

if __name__ == "__main__":
    main()
