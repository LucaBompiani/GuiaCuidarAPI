#!/usr/bin/env python3
import pandas as pd

file_path = "escolarizacao-6 anos-ou-mais-por-sexo-idades-existencia-deficiencia.xlsx"
df = pd.read_excel(file_path, header=None)

print("=== ESTRUTURA COMPLETA DAS PRIMEIRAS 8 LINHAS ===\n")
for row_idx in range(8):
    print(f"LINHA {row_idx}:")
    for col_idx in range(min(20, len(df.columns))):
        val = df.iloc[row_idx, col_idx]
        if pd.notna(val):
            print(f"  [{col_idx}] = {val}")
    print()
