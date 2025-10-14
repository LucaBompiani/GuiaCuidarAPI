import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, BookOpen, Users, Activity, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const categoryIcons = {
  higiene: Heart,
  educacao: BookOpen,
  atividades: Activity,
  alimentacao: Users,
  comunicacao: MessageCircle,
};

const categoryLabels = {
  higiene: "Higiene",
  educacao: "Educação",
  atividades: "Atividades",
  alimentacao: "Alimentação",
  comunicacao: "Comunicação",
};

const Explore = () => {
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    loadTips();
  }, []);

  const loadTips = async () => {
    try {
      const { data, error } = await supabase
        .from("tips")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTips(data || []);
    } catch (error) {
      console.error("Erro ao carregar dicas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTips = selectedCategory === "all" 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  const categories = Object.keys(categoryLabels);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Dicas e Orientações sobre TEA</h2>
          <p className="text-muted-foreground text-lg">
            Explore nosso conteúdo educativo sobre cuidados com pessoas no espectro autista. 
            Para dicas personalizadas ao nível de suporte do seu dependente, crie uma conta gratuita.
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-2">
            <TabsTrigger value="all">Todas</TabsTrigger>
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat}>
                {categoryLabels[cat as keyof typeof categoryLabels]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando dicas...</p>
          </div>
        ) : filteredTips.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma dica encontrada nesta categoria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTips.map((tip) => {
              const Icon = categoryIcons[tip.category as keyof typeof categoryIcons];
              return (
                <Card key={tip.id} className="shadow-soft hover:shadow-medium transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Icon className="w-8 h-8 text-primary" />
                      <Badge variant="secondary">
                        Nível {tip.support_level.split('_')[1]}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{tip.title}</CardTitle>
                    <CardDescription>
                      {categoryLabels[tip.category as keyof typeof categoryLabels]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-4">{tip.content}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center bg-muted rounded-lg p-8">
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
