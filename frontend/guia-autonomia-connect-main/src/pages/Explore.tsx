import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Tipos para as novas tabelas de conteúdo público
type Artigo = Database["public"]["Tables"]["ArtigoInformativo"]["Row"];
type DadoEstatistico = Database["public"]["Tables"]["DadosEstatisticosTEA"]["Row"];

const Explore = () => {
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [dados, setDados] = useState<DadoEstatistico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublicContent();
  }, []);

  const loadPublicContent = async () => {
    setLoading(true);
    try {
      const [
        { data: artigosData, error: artigosError },
        { data: dadosData, error: dadosError },
      ] = await Promise.all([
        supabase.from("ArtigoInformativo").select("*").order("data_criacao", { ascending: false }),
        supabase.from("DadosEstatisticosTEA").select("*").order("data_criacao", { ascending: false }),
      ]);

      if (artigosError) throw artigosError;
      if (dadosError) throw dadosError;

      setArtigos(artigosData || []);
      setDados(dadosData || []);
    } catch (error) {
      console.error("Erro ao carregar conteúdo público:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Explorar Conteúdo</h1>
            <Button asChild>
              <Link to="/auth">Entrar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Conhecimento e Informação sobre o TEA</h2>
          <p className="text-muted-foreground text-lg">
            Explore nossos artigos e dados sobre o espectro autista. 
            Para dicas personalizadas, crie uma conta gratuita.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando conteúdo...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Seção de Artigos */}
            <section>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                Artigos Informativos
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artigos.map((artigo) => (
                  <Card key={artigo.id} className="shadow-soft hover:shadow-medium transition-all flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-xl">{artigo.titulo}</CardTitle>
                      {artigo.autor && <CardDescription>Por: {artigo.autor}</CardDescription>}
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground line-clamp-4">{artigo.corpo}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Seção de Dados Estatísticos */}
            <section>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BarChart2 className="w-6 h-6 text-primary" />
                Dados e Fatos
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dados.map((dado) => (
                  <Card key={dado.id} className="shadow-soft hover:shadow-medium transition-all text-center">
                    <CardHeader>
                      <CardTitle className="text-4xl font-extrabold text-primary">{dado.conteudo}</CardTitle>
                      <CardDescription>{dado.nome}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{dado.descricao}</p>
                      {dado.fonte && <p className="text-xs text-muted-foreground mt-2">Fonte: {dado.fonte}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* CTA Final */}
        <div className="mt-16 text-center bg-muted rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Quer dicas personalizadas?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Cadastre-se gratuitamente e receba recomendações específicas para o nível de suporte do seu dependente.
          </p>
          <Button asChild size="lg">
            <Link to="/auth">Criar Conta Gratuita</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Explore;
