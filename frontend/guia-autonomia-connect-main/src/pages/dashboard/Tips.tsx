import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, BookOpen, Users, Activity, MessageCircle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const supportLevelLabels = {
  nivel_1: "Nível 1",
  nivel_2: "Nível 2",
  nivel_3: "Nível 3",
};

const Tips = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dependents, setDependents] = useState<any[]>([]);
  const [selectedDependent, setSelectedDependent] = useState<string>("");
  const [tips, setTips] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    loadDependents();
  }, []);

  useEffect(() => {
    if (selectedDependent) {
      loadTips();
      loadFavorites();
    }
  }, [selectedDependent]);

  const loadDependents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("dependents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setDependents(data || []);
      if (data && data.length > 0) {
        setSelectedDependent(data[0].id);
      }
    } catch (error: any) {
      console.error("Erro ao carregar dependentes:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTips = async () => {
    try {
      const dependent = dependents.find(d => d.id === selectedDependent);
      if (!dependent) return;

      const { data, error } = await supabase
        .from("tips")
        .select("*")
        .eq("support_level", dependent.support_level)
        .order("category");

      if (error) throw error;
      setTips(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar dicas:", error);
    }
  };

  const loadFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("favorite_tips")
        .select("tip_id")
        .eq("user_id", user.id);

      if (error) throw error;
      
      const favSet = new Set(data?.map(f => f.tip_id) || []);
      setFavorites(favSet);
    } catch (error: any) {
      console.error("Erro ao carregar favoritos:", error);
    }
  };

  const toggleFavorite = async (tipId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (favorites.has(tipId)) {
        const { error } = await supabase
          .from("favorite_tips")
          .delete()
          .eq("user_id", user.id)
          .eq("tip_id", tipId);

        if (error) throw error;
        
        const newFavorites = new Set(favorites);
        newFavorites.delete(tipId);
        setFavorites(newFavorites);
        
        toast({ title: "Removido dos favoritos" });
      } else {
        const { error } = await supabase
          .from("favorite_tips")
          .insert({ user_id: user.id, tip_id: tipId });

        if (error) throw error;
        
        setFavorites(new Set([...favorites, tipId]));
        toast({ title: "Adicionado aos favoritos" });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar favoritos",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredTips = selectedCategory === "all"
    ? tips
    : tips.filter(tip => tip.category === selectedCategory);

  const currentDependent = dependents.find(d => d.id === selectedDependent);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (dependents.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Nenhum dependente cadastrado</CardTitle>
            <CardDescription>
              Você precisa cadastrar um dependente na página de Perfil para visualizar dicas personalizadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/dashboard/perfil">Ir para Perfil</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Dicas de Cuidados Diários</h2>
        <p className="text-muted-foreground">
          Dicas personalizadas para o nível de suporte do seu dependente
        </p>
      </div>

      {/* Dependent Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Selecione o Dependente</CardTitle>
          <CardDescription>
            As dicas serão filtradas de acordo com o nível de suporte selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedDependent} onValueChange={setSelectedDependent}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dependents.map((dependent) => (
                <SelectItem key={dependent.id} value={dependent.id}>
                  {dependent.name} - {supportLevelLabels[dependent.support_level as keyof typeof supportLevelLabels]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="all">Todas</TabsTrigger>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <TabsTrigger key={key} value={key}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Tips Grid */}
      {filteredTips.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma dica encontrada para esta categoria.
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredTips.map((tip) => {
            const Icon = categoryIcons[tip.category as keyof typeof categoryIcons];
            const isFavorite = favorites.has(tip.id);
            
            return (
              <Card key={tip.id} className="shadow-soft hover:shadow-medium transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Icon className="w-8 h-8 text-primary" />
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {categoryLabels[tip.category as keyof typeof categoryLabels]}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleFavorite(tip.id)}
                      >
                        <Star 
                          className={`w-5 h-5 ${isFavorite ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                        />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{tip.title}</CardTitle>
                  <CardDescription>
                    Personalizado para {currentDependent?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{tip.content}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tips;
