#!/usr/bin/env python3
import pandas as pd
from pathlib import Path

file_path = "escolarizacao-6 anos-ou-mais-por-sexo-idades-existencia-deficiencia.xlsx"
df = pd.read_excel(file_path, header=None)

ano_row = 3
sexo_row = 4
idade_row = 5
deficiencia_row = 6
data_start_row = 7

headers = []
current_ano = None
current_sexo = None
current_idade = None

for col_idx in range(len(df.columns)):
    ano_val = df.iloc[ano_row, col_idx]
    if pd.notna(ano_val):
        current_ano = ano_val
    
    sexo_val = df.iloc[sexo_row, col_idx]
    if pd.notna(sexo_val):
        current_sexo = sexo_val
    
    idade_val = df.iloc[idade_row, col_idx]
    if pd.notna(idade_val):
        current_idade = idade_val
    
    deficiencia_val = df.iloc[deficiencia_row, col_idx]
    
    headers.append({
        'col_idx': col_idx,
        'ano': current_ano,
        'sexo': current_sexo,
        'idade': current_idade,
        'deficiencia': deficiencia_val if pd.notna(deficiencia_val) else None
    })

print("=== HEADERS CORRIGIDOS ===")
for i, h in enumerate(headers[:25]):
    print(f"Col {i}: ano={h['ano']}, sexo={h['sexo']}, idade={h['idade']}, def={h['deficiencia']}")

data_df = df.iloc[data_start_row:].copy()
data_df = data_df.reset_index(drop=True)

normalized_data = []

for idx, row in data_df.iterrows():
    localidade = row.iloc[0]
    if pd.isna(localidade) or str(localidade).strip() == '':
        continue
    localidade = str(localidade).strip()
    
    for col_idx in range(1, len(row)):
        valor = row.iloc[col_idx]
        if pd.notna(valor) and str(valor).strip() != '':
            try:
                valor_num = float(str(valor).replace(',', '.'))
                header = headers[col_idx]
                
                normalized_data.append({
                    'localidade': localidade,
                    'ano': header['ano'],
                    'sexo': header['sexo'],
                    'faixa_idade': header['idade'],
                    'tipo_deficiencia': header['deficiencia'],
                    'taxa_escolarizacao': valor_num
                })
            except:
                pass

normalized_df = pd.DataFrame(normalized_data)

print(f"\n✅ Dados normalizados: {len(normalized_df)} registros")
print("\nAmostra (primeiros 20):")
print(normalized_df.head(20).to_string())

output_sql = Path("escolarizacao_normalized.sql")

with open(output_sql, 'w', encoding='utf-8') as f:
    f.write("CREATE TABLE IF NOT EXISTS escolarizacao_ibge (\n")
    f.write("    id SERIAL PRIMARY KEY,\n")
    f.write("    localidade VARCHAR(255) NOT NULL,\n")
    f.write("    ano INTEGER,\n")
    f.write("    sexo VARCHAR(50),\n")
    f.write("    faixa_idade VARCHAR(100),\n")
    f.write("    tipo_deficiencia VARCHAR(255),\n")
    f.write("    taxa_escolarizacao DECIMAL(5,2),\n")
    f.write("    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n")
    f.write(");\n\n")
    
    f.write("TRUNCATE TABLE escolarizacao_ibge;\n\n")
    
    for _, row in normalized_df.iterrows():
        localidade = row['localidade'].replace("'", "''")
        ano = f"{int(row['ano'])}" if pd.notna(row['ano']) else 'NULL'
        sexo = f"'{row['sexo']}'" if pd.notna(row['sexo']) else 'NULL'
        idade = f"'{row['faixa_idade']}'" if pd.notna(row['faixa_idade']) else 'NULL'
        deficiencia = f"'{row['tipo_deficiencia']}'" if pd.notna(row['tipo_deficiencia']) else 'NULL'
        
        f.write(f"INSERT INTO escolarizacao_ibge (localidade, ano, sexo, faixa_idade, tipo_deficiencia, taxa_escolarizacao) ")
        f.write(f"VALUES ('{localidade}', {ano}, {sexo}, {idade}, {deficiencia}, {row['taxa_escolarizacao']});\n")

print(f"\n✅ SQL: {output_sql}")

output_csv = Path("escolarizacao_normalized.csv")
normalized_df.to_csv(output_csv, index=False, encoding='utf-8')
print(f"✅ CSV: {output_csv}")

print("\n=== ESTATÍSTICAS ===")
print(f"Total: {len(normalized_df)}")
print(f"Localidades: {normalized_df['localidade'].nunique()}")
print(f"Anos: {sorted(normalized_df['ano'].dropna().unique())}")
print(f"Sexos: {sorted(normalized_df['sexo'].dropna().unique())}")
print(f"Idades: {sorted(normalized_df['faixa_idade'].dropna().unique())}")
print(f"Deficiências: {sorted(normalized_df['tipo_deficiencia'].dropna().unique())}")
