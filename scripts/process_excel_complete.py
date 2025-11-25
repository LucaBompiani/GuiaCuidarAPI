#!/usr/bin/env python3
"""
Script completo para processar planilha de escolarização com categorias identificadas
"""
import pandas as pd
from pathlib import Path

def main():
    file_path = "escolarizacao-6 anos-ou-mais-por-sexo-idades-existencia-deficiencia.xlsx"
    
    print("📊 Processando planilha de escolarização...\n")
    
    # Ler planilha completa
    df = pd.read_excel(file_path, header=None)
    
    # Identificar headers (geralmente nas primeiras linhas)
    print("=== ANÁLISE DE HEADERS ===")
    for i in range(min(7, len(df))):
        print(f"Linha {i}:")
        for j in range(min(10, len(df.columns))):
            val = df.iloc[i, j]
            if pd.notna(val):
                print(f"  Col {j}: {str(val)[:80]}")
    
    # Extrair headers das linhas 3-6 (onde geralmente estão as categorias)
    headers = []
    for col_idx in range(len(df.columns)):
        header_parts = []
        for row_idx in range(3, 7):  # Linhas com categorias
            val = df.iloc[row_idx, col_idx]
            if pd.notna(val) and str(val).strip() not in ['nan', '']:
                header_parts.append(str(val).strip())
        
        if header_parts:
            headers.append(' | '.join(header_parts))
        else:
            headers.append(f'col_{col_idx}')
    
    print(f"\n=== HEADERS IDENTIFICADOS ({len(headers)} colunas) ===")
    for i, h in enumerate(headers[:15]):  # Mostrar primeiros 15
        print(f"{i}: {h}")
    
    # Dados começam após os headers
    data_start = 7
    data_df = df.iloc[data_start:].copy()
    data_df.columns = headers
    data_df = data_df.reset_index(drop=True)
    
    # Limpar dados
    data_df = data_df.dropna(how='all')
    
    print(f"\n✓ Dados extraídos: {len(data_df)} linhas")
    print("\nPrimeiras linhas:")
    print(data_df.head())
    
    # Normalizar dados para formato de BD
    normalized_data = []
    
    localidade_col = headers[0]
    
    for idx, row in data_df.iterrows():
        localidade_val = row.iloc[0] if len(row) > 0 else None
        if pd.isna(localidade_val):
            continue
        localidade = str(localidade_val).strip()
        if not localidade or localidade == 'nan':
            continue
        
        # Processar cada coluna de dados (começando da coluna 1)
        for col_idx in range(1, len(headers)):
            col_name = headers[col_idx]
            valor = row.iloc[col_idx]
            
            if pd.notna(valor) and str(valor).strip() != '':
                try:
                    valor_num = float(str(valor).replace(',', '.'))
                    
                    # Parsear categorias do header
                    parts = col_name.split('|')
                    sexo = parts[0].strip() if len(parts) > 0 else None
                    idade = parts[1].strip() if len(parts) > 1 else None
                    deficiencia = parts[2].strip() if len(parts) > 2 else None
                    
                    normalized_data.append({
                        'localidade': localidade,
                        'sexo': sexo,
                        'faixa_idade': idade,
                        'tipo_deficiencia': deficiencia,
                        'taxa_escolarizacao': valor_num
                    })
                except Exception as e:
                    pass
    
    normalized_df = pd.DataFrame(normalized_data)
    
    print(f"\n✅ Dados normalizados: {len(normalized_df)} registros")
    print("\nAmostra:")
    print(normalized_df.head(10))
    
    # Gerar SQL
    output_sql = Path("escolarizacao_normalized.sql")
    
    with open(output_sql, 'w', encoding='utf-8') as f:
        f.write("-- Dados de escolarização por sexo, idade e deficiência\n")
        f.write("-- Fonte: IBGE - Tabela 10139\n\n")
        
        f.write("CREATE TABLE IF NOT EXISTS escolarizacao_ibge (\n")
        f.write("    id SERIAL PRIMARY KEY,\n")
        f.write("    localidade VARCHAR(255) NOT NULL,\n")
        f.write("    sexo VARCHAR(50),\n")
        f.write("    faixa_idade VARCHAR(100),\n")
        f.write("    tipo_deficiencia VARCHAR(255),\n")
        f.write("    taxa_escolarizacao DECIMAL(5,2),\n")
        f.write("    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n")
        f.write(");\n\n")
        
        f.write("-- Limpar dados existentes\n")
        f.write("TRUNCATE TABLE escolarizacao_ibge;\n\n")
        
        f.write("-- Inserir dados\n")
        for _, row in normalized_df.iterrows():
            localidade = row['localidade'].replace("'", "''")
            sexo = row['sexo'].replace("'", "''") if pd.notna(row['sexo']) else 'NULL'
            idade = row['faixa_idade'].replace("'", "''") if pd.notna(row['faixa_idade']) else 'NULL'
            deficiencia = row['tipo_deficiencia'].replace("'", "''") if pd.notna(row['tipo_deficiencia']) else 'NULL'
            
            sexo_val = f"'{sexo}'" if sexo != 'NULL' else 'NULL'
            idade_val = f"'{idade}'" if idade != 'NULL' else 'NULL'
            def_val = f"'{deficiencia}'" if deficiencia != 'NULL' else 'NULL'
            
            f.write(f"INSERT INTO escolarizacao_ibge (localidade, sexo, faixa_idade, tipo_deficiencia, taxa_escolarizacao) ")
            f.write(f"VALUES ('{localidade}', {sexo_val}, {idade_val}, {def_val}, {row['taxa_escolarizacao']});\n")
    
    print(f"\n✅ SQL gerado: {output_sql}")
    
    # Gerar CSV
    output_csv = Path("escolarizacao_normalized.csv")
    normalized_df.to_csv(output_csv, index=False, encoding='utf-8')
    print(f"✅ CSV gerado: {output_csv}")
    
    # Estatísticas detalhadas
    print("\n=== ESTATÍSTICAS ===")
    print(f"Total de registros: {len(normalized_df)}")
    print(f"Localidades: {normalized_df['localidade'].nunique()}")
    print(f"Categorias de sexo: {normalized_df['sexo'].nunique()}")
    print(f"Faixas de idade: {normalized_df['faixa_idade'].nunique()}")
    print(f"Tipos de deficiência: {normalized_df['tipo_deficiencia'].nunique()}")
    
    print("\n📍 Localidades:")
    for loc in sorted(normalized_df['localidade'].unique()):
        count = len(normalized_df[normalized_df['localidade'] == loc])
        print(f"  - {loc}: {count} registros")

if __name__ == "__main__":
    main()
