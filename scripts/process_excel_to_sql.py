#!/usr/bin/env python3
"""
Script para processar planilha de escolarização e gerar SQL para BD
"""
import pandas as pd
import sys
from pathlib import Path

def main():
    file_path = "escolarizacao-6 anos-ou-mais-por-sexo-idades-existencia-deficiencia.xlsx"
    
    print("Lendo arquivo Excel...")
    # Ler sem headers, pois estão mal formatados
    df = pd.read_excel(file_path, header=None)
    
    print(f"\nDimensões originais: {df.shape[0]} linhas x {df.shape[1]} colunas")
    
    # Mostrar as primeiras linhas para entender a estrutura
    print("\n=== PRIMEIRAS 10 LINHAS (para análise) ===")
    for i in range(min(10, len(df))):
        print(f"Linha {i}: {df.iloc[i, 0]}")
    
    # Identificar onde começam os dados reais
    # Geralmente planilhas do IBGE têm metadados no topo
    start_row = None
    for i in range(len(df)):
        val = str(df.iloc[i, 0]).strip()
        # Procurar por indicadores de início de dados
        if any(keyword in val.lower() for keyword in ['brasil', 'total', 'região']):
            start_row = i
            break
    
    if start_row is None:
        print("\n❌ Não foi possível identificar o início dos dados")
        return
    
    print(f"\n✓ Dados começam na linha {start_row}")
    
    # Extrair dados a partir da linha identificada
    data_df = df.iloc[start_row:].copy()
    data_df = data_df.reset_index(drop=True)
    
    # Tentar identificar colunas relevantes
    print("\n=== ESTRUTURA DOS DADOS ===")
    print(f"Colunas disponíveis: {data_df.shape[1]}")
    print("\nPrimeiras 5 linhas de dados:")
    print(data_df.head())
    
    # Criar estrutura normalizada
    # Assumindo: Col 0 = Localidade, demais colunas = dados por categoria
    normalized_data = []
    
    for idx, row in data_df.iterrows():
        localidade = str(row[0]).strip() if pd.notna(row[0]) else None
        if not localidade or localidade == 'nan':
            continue
            
        # Processar cada coluna de dados
        for col_idx in range(1, len(row)):
            valor = row[col_idx]
            if pd.notna(valor) and str(valor).strip() != '':
                try:
                    valor_num = float(str(valor).replace(',', '.'))
                    normalized_data.append({
                        'localidade': localidade,
                        'coluna_idx': col_idx,
                        'valor': valor_num
                    })
                except:
                    pass
    
    # Criar DataFrame normalizado
    normalized_df = pd.DataFrame(normalized_data)
    
    print(f"\n✓ Dados normalizados: {len(normalized_df)} registros")
    print("\nAmostra dos dados normalizados:")
    print(normalized_df.head(10))
    
    # Gerar SQL
    output_sql = Path("escolarizacao_data.sql")
    
    with open(output_sql, 'w', encoding='utf-8') as f:
        f.write("-- Dados de escolarização processados\n")
        f.write("-- Fonte: IBGE\n\n")
        
        f.write("CREATE TABLE IF NOT EXISTS escolarizacao (\n")
        f.write("    id SERIAL PRIMARY KEY,\n")
        f.write("    localidade VARCHAR(255) NOT NULL,\n")
        f.write("    categoria_idx INTEGER,\n")
        f.write("    taxa_escolarizacao DECIMAL(5,2),\n")
        f.write("    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n")
        f.write(");\n\n")
        
        f.write("-- Inserir dados\n")
        for _, row in normalized_df.iterrows():
            localidade = row['localidade'].replace("'", "''")
            f.write(f"INSERT INTO escolarizacao (localidade, categoria_idx, taxa_escolarizacao) ")
            f.write(f"VALUES ('{localidade}', {row['coluna_idx']}, {row['valor']});\n")
    
    print(f"\n✅ SQL gerado: {output_sql}")
    
    # Gerar CSV também
    output_csv = Path("escolarizacao_data.csv")
    normalized_df.to_csv(output_csv, index=False, encoding='utf-8')
    print(f"✅ CSV gerado: {output_csv}")
    
    # Estatísticas
    print("\n=== ESTATÍSTICAS ===")
    print(f"Total de registros: {len(normalized_df)}")
    print(f"Localidades únicas: {normalized_df['localidade'].nunique()}")
    print(f"Categorias únicas: {normalized_df['coluna_idx'].nunique()}")
    print(f"\nLocalidades:")
    for loc in normalized_df['localidade'].unique()[:10]:
        print(f"  - {loc}")

if __name__ == "__main__":
    main()
