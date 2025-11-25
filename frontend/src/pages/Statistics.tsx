import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Brain, Activity, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TEAEstado {
    id: string;
    local: string;
    dificuldades: string;
    absolute: string;
    relative: string;
}

interface TEAEscolarizacao {
    id: string;
    localidade: string;
    ano: string;
    sexo: string;
    faixa_idade: string;
    tipo_deficiencia: string;
    taxa_escolarizacao: string;
}

const Statistics = () => {
    const [dadosEstados, setDadosEstados] = useState<TEAEstado[]>([]);
    const [dadosEscolarizacao, setDadosEscolarizacao] = useState<TEAEscolarizacao[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStatistics();
    }, []);

    // Função para formatar números com "M" (milhões) e "k" (milhares)
    const formatarNumero = (valor: number): string => {
        if (valor >= 1000000) {
            const milhoes = valor / 1000000;
            return milhoes % 1 === 0 ? `${milhoes}M` : `${milhoes.toFixed(1)}M`;
        }
        if (valor >= 1000) {
            const milhares = valor / 1000;
            return milhares % 1 === 0 ? `${milhares}k` : `${milhares.toFixed(1)}k`;
        }
        return valor.toString();
    };

    const loadStatistics = async () => {
        setLoading(true);
        try {
            console.log("🔄 Carregando dados...");

            // Carregar dados de nível por estado
            const { data: dataNivel, error: errorNivel } = await supabase
                .from("TEA_nivel_por_estado" as any)
                .select("*");

            // Carregar dados de escolarização
            const { data: dataEscolarizacao, error: errorEscolarizacao } = await supabase
                .from("TEA_escolarizacao_por_estado" as any)
                .select("*");

            if (errorNivel) {
                console.error("❌ Erro ao carregar níveis:", errorNivel);
            }

            if (errorEscolarizacao) {
                console.error("❌ Erro ao carregar escolarização:", errorEscolarizacao);
            }

            if (dataNivel && dataNivel.length > 0) {
                console.log("✅ Dados de nível carregados:", dataNivel.length, "registros");
                setDadosEstados((dataNivel as any) || []);
            }

            if (dataEscolarizacao && dataEscolarizacao.length > 0) {
                console.log("✅ Dados de escolarização carregados:", dataEscolarizacao.length, "registros");
                setDadosEscolarizacao((dataEscolarizacao as any) || []);
            }
        } catch (error: any) {
            console.error("❌ Erro:", error);
        } finally {
            setLoading(false);
        }
    };

    // Processar dados para visualizações
    const processarDadosPorEstado = () => {
        const estadosUnicos = new Map<string, { total: number; uma: number; duas: number }>();

        dadosEstados.forEach(item => {
            const estado = item.local.trim();
            if (estado.includes('Brasil') || estado.includes('Norte') ||
                estado.includes('Sul') || estado.includes('Sudeste') ||
                estado.includes('Nordeste') || estado.includes('Centro-Oeste')) {
                return; // Pular totalizadores
            }

            if (!estadosUnicos.has(estado)) {
                estadosUnicos.set(estado, { total: 0, uma: 0, duas: 0 });
            }

            const dados = estadosUnicos.get(estado)!;
            const valor = parseInt(item.absolute);

            if (item.dificuldades === '1 dificuldade') {
                dados.uma = valor;
            } else {
                dados.duas = valor;
            }
            dados.total = dados.uma + dados.duas;
        });

        return Array.from(estadosUnicos.entries())
            .map(([estado, dados]) => ({
                estado: estado.trim(),
                total: dados.total,
                uma_dificuldade: dados.uma,
                duas_ou_mais: dados.duas
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);
    };

    const processarDadosPorRegiao = () => {
        const regioes = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];
        const dadosRegioes = new Map<string, { total: number }>();

        dadosEstados.forEach(item => {
            const local = item.local.trim();
            const regiao = regioes.find(r => local.includes(r));

            if (regiao) {
                if (!dadosRegioes.has(regiao)) {
                    dadosRegioes.set(regiao, { total: 0 });
                }
                dadosRegioes.get(regiao)!.total += parseInt(item.absolute);
            }
        });

        return Array.from(dadosRegioes.entries()).map(([regiao, dados]) => ({
            regiao,
            total: dados.total
        }));
    };

    // Processar dados de escolarização
    const processarEscolarizacaoPorFaixaEtaria = () => {
        // Filtrar apenas dados do Brasil, Total (ambos os sexos), Pessoa com deficiência
        const dadosBrasil = dadosEscolarizacao.filter(item =>
            item.localidade === 'Brasil' &&
            item.sexo === 'Total' &&
            item.tipo_deficiencia === 'Pessoa com deficiência' &&
            item.faixa_idade !== 'Total'
        );

        return dadosBrasil.map(item => ({
            faixa: item.faixa_idade,
            taxa: parseFloat(item.taxa_escolarizacao)
        }));
    };

    const processarComparacaoDeficiencia = () => {
        // Comparar pessoas com e sem deficiência por faixa etária
        const dadosBrasil = dadosEscolarizacao.filter(item =>
            item.localidade === 'Brasil' &&
            item.sexo === 'Total' &&
            item.faixa_idade !== 'Total' &&
            item.tipo_deficiencia !== 'Total'
        );

        const faixas = ['6 a 14 anos', '15 a 17 anos', '18 a 24 anos', '25 anos ou mais'];

        return faixas.map(faixa => {
            const comDef = dadosBrasil.find(d => d.faixa_idade === faixa && d.tipo_deficiencia === 'Pessoa com deficiência');
            const semDef = dadosBrasil.find(d => d.faixa_idade === faixa && d.tipo_deficiencia === 'Pessoa sem deficiência');

            return {
                faixa,
                com_deficiencia: comDef ? parseFloat(comDef.taxa_escolarizacao) : 0,
                sem_deficiencia: semDef ? parseFloat(semDef.taxa_escolarizacao) : 0
            };
        });
    };

    const processarEscolarizacaoPorEstado = () => {
        // Pegar estados (não regiões) com dados de pessoas com deficiência, faixa 6-14 anos
        const estados = ['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará',
            'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão',
            'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará',
            'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro',
            'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima',
            'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'];

        const dadosEstados = dadosEscolarizacao.filter(item =>
            estados.includes(item.localidade) &&
            item.sexo === 'Total' &&
            item.faixa_idade === '6 a 14 anos' &&
            item.tipo_deficiencia === 'Pessoa com deficiência'
        );

        return dadosEstados
            .map(item => ({
                estado: item.localidade,
                taxa: parseFloat(item.taxa_escolarizacao)
            }))
            .sort((a, b) => a.taxa - b.taxa) // Ordenar do menor para o maior
            .slice(0, 15); // Top 15 estados com menor taxa
    };

    const obterTotalBrasil = () => {
        const dadosBrasil = dadosEstados.filter(item => item.local.trim() === 'Brasil');
        return dadosBrasil.reduce((sum, item) => sum + parseInt(item.absolute), 0);
    };

    const obterDistribuicaoDificuldades = () => {
        const brasil = dadosEstados.filter(item => item.local.trim() === 'Brasil');
        const uma = brasil.find(item => item.dificuldades === '1 dificuldade');
        const duas = brasil.find(item => item.dificuldades === '2 ou mais dificuldades');

        return [
            { nome: '1 Dificuldade', valor: uma ? parseInt(uma.absolute) : 0, cor: '#3b82f6' },
            { nome: '2+ Dificuldades', valor: duas ? parseInt(duas.absolute) : 0, cor: '#ec4899' }
        ];
    };

    // Processar dados apenas quando carregados
    const topEstados = dadosEstados.length > 0 ? processarDadosPorEstado() : [];
    const dadosRegioes = dadosEstados.length > 0 ? processarDadosPorRegiao() : [];
    const totalBrasil = dadosEstados.length > 0 ? obterTotalBrasil() : 0;
    const distribuicaoDificuldades = dadosEstados.length > 0 ? obterDistribuicaoDificuldades() : [];

    // Debug
    console.log("Estados processados:", topEstados.length);
    console.log("Regiões processadas:", dadosRegioes.length);
    console.log("Total Brasil:", totalBrasil);
    console.log("Distribuição:", distribuicaoDificuldades);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card shadow-soft sticky top-0 z-10">
                <div className="container mx-auto max-w-6xl px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button asChild variant="ghost">
                            <Link to="/explorar">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Voltar
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold">Estatísticas TEA</h1>
                        <Button asChild>
                            <Link to="/auth">Entrar</Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto max-w-7xl px-4 py-8">
                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <p className="text-muted-foreground">Carregando estatísticas...</p>
                    </div>
                ) : dadosEstados.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                        <p className="text-muted-foreground text-lg">Nenhum dado estatístico disponível no momento.</p>
                        <p className="text-sm text-muted-foreground">A tabela TEA_nivel_por_estado pode não estar populada no banco de dados.</p>
                        <Button asChild variant="outline">
                            <Link to="/explorar">Voltar para Explorar</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Estatísticas sobre Autismo no Brasil</h2>
                            <p className="text-muted-foreground">
                                Dados sobre pessoas com Transtorno do Espectro Autista (TEA) no país
                            </p>
                        </div>

                        {/* Cards de resumo */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total no Brasil</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalBrasil.toLocaleString('pt-BR')}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Pessoas com TEA (Censo 2022)
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Prevalência</CardTitle>
                                    <Brain className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">~7,3%</div>
                                    <p className="text-xs text-muted-foreground">
                                        Da população com alguma dificuldade
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">1 Dificuldade</CardTitle>
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {distribuicaoDificuldades[0]?.valor.toLocaleString('pt-BR')}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Pessoas com 1 dificuldade
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">2+ Dificuldades</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {distribuicaoDificuldades[1]?.valor.toLocaleString('pt-BR')}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Pessoas com 2+ dificuldades
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Gráfico de distribuição por nível de dificuldade */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribuição por Nível de Dificuldade</CardTitle>
                                <CardDescription>
                                    Proporção de pessoas com TEA por quantidade de dificuldades no Brasil
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={distribuicaoDificuldades}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ nome, valor }) => `${nome}: ${formatarNumero(valor)}`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="valor"
                                        >
                                            {distribuicaoDificuldades.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.cor} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR')} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Top 10 Estados */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top 10 Estados</CardTitle>
                                    <CardDescription>
                                        Estados com maior número de pessoas com TEA
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={topEstados} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" tickFormatter={formatarNumero} />
                                            <YAxis dataKey="estado" type="category" width={120} />
                                            <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR')} />
                                            <Legend />
                                            <Bar dataKey="total" fill="#3b82f6" name="Total" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Distribuição por Região */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Distribuição por Região</CardTitle>
                                    <CardDescription>
                                        Total de pessoas com TEA por região do Brasil
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={dadosRegioes}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="regiao" />
                                            <YAxis tickFormatter={formatarNumero} />
                                            <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR')} />
                                            <Legend />
                                            <Bar dataKey="total" fill="#10b981" name="Total" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Seção de Escolarização */}
                        {dadosEscolarizacao.length > 0 && (
                            <>
                                <div className="mt-12">
                                    <h2 className="text-3xl font-bold mb-2">Escolarização de Pessoas com Deficiência</h2>
                                    <p className="text-muted-foreground">
                                        Taxas de escolarização por faixa etária (Censo 2022)
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Comparação Com/Sem Deficiência */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Comparação de Taxas de Escolarização</CardTitle>
                                            <CardDescription>
                                                Pessoas com deficiência vs sem deficiência por faixa etária
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ResponsiveContainer width="100%" height={400}>
                                                <BarChart data={processarComparacaoDeficiencia()}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="faixa" angle={-15} textAnchor="end" height={80} />
                                                    <YAxis tickFormatter={(value) => `${value}%`} />
                                                    <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                                                    <Legend />
                                                    <Bar dataKey="com_deficiencia" fill="#f59e0b" name="Com Deficiência (%)" />
                                                    <Bar dataKey="sem_deficiencia" fill="#10b981" name="Sem Deficiência (%)" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>

                                    {/* Escolarização por Estado */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Estados com Menores Taxas (6-14 anos)</CardTitle>
                                            <CardDescription>
                                                15 estados com menor taxa de escolarização de pessoas com deficiência
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ResponsiveContainer width="100%" height={400}>
                                                <BarChart data={processarEscolarizacaoPorEstado()} layout="vertical">
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis type="number" domain={[85, 95]} tickFormatter={(value) => `${value}%`} />
                                                    <YAxis dataKey="estado" type="category" width={120} />
                                                    <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                                                    <Legend />
                                                    <Bar dataKey="taxa" fill="#ef4444" name="Taxa (%)" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        )}

                        {/* Informações adicionais */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sobre os Dados</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Fonte dos Dados</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Os dados apresentados são baseados no Censo Demográfico 2022 do IBGE,
                                        que incluiu pela primeira vez perguntas específicas sobre o Transtorno do
                                        Espectro Autista (TEA). Os números representam pessoas que declararam ter
                                        diagnóstico de autismo.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Níveis de Dificuldade</h3>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                        <li><strong>1 Dificuldade:</strong> Pessoas com TEA que apresentam uma área de dificuldade funcional</li>
                                        <li><strong>2+ Dificuldades:</strong> Pessoas com TEA que apresentam duas ou mais áreas de dificuldade funcional</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Desafios no Brasil</h3>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                        <li>Diagnóstico tardio, especialmente em meninas e casos leves</li>
                                        <li>Acesso limitado a terapias especializadas em muitas regiões</li>
                                        <li>Falta de profissionais capacitados em áreas remotas</li>
                                        <li>Necessidade de maior inclusão escolar e social</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Avanços Recentes</h3>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                        <li>Lei Berenice Piana (Lei 12.764/2012) - Política Nacional de Proteção dos Direitos da Pessoa com TEA</li>
                                        <li>Carteira de Identificação da Pessoa com TEA (Lei 13.977/2020)</li>
                                        <li>Inclusão de perguntas sobre TEA no Censo 2022</li>
                                        <li>Maior conscientização e campanhas de informação</li>
                                        <li>Expansão de centros especializados em grandes cidades</li>
                                    </ul>
                                </div>

                                {dadosEscolarizacao.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-2">Escolarização</h3>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Os dados de escolarização mostram a porcentagem de pessoas que frequentam escola ou creche,
                                            comparando pessoas com e sem deficiência por faixa etária.
                                        </p>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                            <li>Crianças de 6 a 14 anos: Faixa de educação básica obrigatória</li>
                                            <li>Jovens de 15 a 17 anos: Ensino médio</li>
                                            <li>Adultos de 18 a 24 anos: Ensino superior e profissionalizante</li>
                                            <li>Adultos 25+: Educação continuada e especialização</li>
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Statistics;
