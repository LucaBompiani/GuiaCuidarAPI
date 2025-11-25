import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const TestTEA = () => {
    const [resultado, setResultado] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const testarConexao = async () => {
        setLoading(true);
        setResultado("Testando...\n");

        try {
            // Teste 1: Listar todas as tabelas
            setResultado(prev => prev + "\n📋 Teste 1: Listando tabelas públicas...\n");
            const { data: tables, error: tablesError } = await supabase
                .from("information_schema.tables" as any)
                .select("table_name")
                .eq("table_schema", "public");

            if (tablesError) {
                setResultado(prev => prev + `❌ Erro ao listar tabelas: ${tablesError.message}\n`);
            } else {
                setResultado(prev => prev + `✅ Tabelas encontradas: ${tables?.length || 0}\n`);
                const teaTable = (tables as any)?.find((t: any) => t.table_name?.includes("TEA"));
                if (teaTable) {
                    setResultado(prev => prev + `✅ Tabela TEA encontrada: ${teaTable.table_name}\n`);
                } else {
                    setResultado(prev => prev + `⚠️ Nenhuma tabela com 'TEA' no nome\n`);
                }
            }

            // Teste 2: Tentar query direta
            setResultado(prev => prev + "\n📊 Teste 2: Query na tabela TEA_nivel_por_estado...\n");
            const { data, error, count } = await supabase
                .from("TEA_nivel_por_estado" as any)
                .select("*", { count: "exact" });

            if (error) {
                setResultado(prev => prev + `❌ Erro: ${error.message}\n`);
                setResultado(prev => prev + `Código: ${error.code}\n`);
                setResultado(prev => prev + `Detalhes: ${JSON.stringify(error.details)}\n`);
                setResultado(prev => prev + `Hint: ${error.hint}\n`);
            } else {
                setResultado(prev => prev + `✅ Query executada com sucesso!\n`);
                setResultado(prev => prev + `Total de registros: ${count || data?.length || 0}\n`);
                if (data && data.length > 0) {
                    setResultado(prev => prev + `\n📄 Amostra dos dados (primeiros 3):\n`);
                    setResultado(prev => prev + JSON.stringify(data.slice(0, 3), null, 2) + "\n");
                } else {
                    setResultado(prev => prev + `⚠️ Tabela existe mas está vazia\n`);
                }
            }

            // Teste 3: Query específica
            setResultado(prev => prev + "\n🇧🇷 Teste 3: Buscando dados do Brasil...\n");
            const { data: brasilData, error: brasilError } = await supabase
                .from("TEA_nivel_por_estado" as any)
                .select("*")
                .eq("local", "Brasil");

            if (brasilError) {
                setResultado(prev => prev + `❌ Erro: ${brasilError.message}\n`);
            } else {
                setResultado(prev => prev + `✅ Registros do Brasil: ${brasilData?.length || 0}\n`);
                if (brasilData && brasilData.length > 0) {
                    setResultado(prev => prev + JSON.stringify(brasilData, null, 2) + "\n");
                }
            }

        } catch (error: any) {
            setResultado(prev => prev + `\n❌ Erro geral: ${error.message}\n`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>🔍 Teste de Conexão - Tabela TEA_nivel_por_estado</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={testarConexao} disabled={loading}>
                            {loading ? "Testando..." : "Executar Testes"}
                        </Button>

                        {resultado && (
                            <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                                {resultado}
                            </pre>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>📝 Instruções</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Se aparecer erro "relation does not exist":</strong></p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>A tabela não existe no banco de dados</li>
                            <li>Execute os scripts SQL em supabase-project/volumes/db/init/</li>
                        </ul>

                        <p className="mt-4"><strong>Se aparecer erro de permissão:</strong></p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>RLS (Row Level Security) está bloqueando</li>
                            <li>Execute o script DEBUG_TEA.sql no Supabase Dashboard</li>
                        </ul>

                        <p className="mt-4"><strong>Se retornar 0 registros:</strong></p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>A tabela existe mas está vazia</li>
                            <li>Execute o script 03_tea_dados.sql</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TestTEA;
