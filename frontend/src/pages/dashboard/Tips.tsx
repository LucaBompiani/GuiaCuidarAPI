import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, BookOpen, Users, Activity, MessageCircle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type Dependente = Database["public"]["Tables"]["Dependente"]["Row"];
type MaterialDeApoio = Database["public"]["Tables"]["MaterialDeApoio"]["Row"];
type CategoriaMaterial = Database["public"]["Tables"]["CategoriaMaterial"]["Row"];
type NivelSuporte = Database["public"]["Tables"]["NivelSuporteTEA"]["Row"];

const categoryIcons = {
  1: BookOpen, // Educação
  2: MessageCircle, // Comunicação
  3: Activity, // Rotina
  4: Heart, // Sensorial
};

const Tips = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dependentes, setDependentes] = useState<Dependente[]>([]);
  const [selectedDependent, setSelectedDependent] = useState<string>("");
  const [materiais, setMateriais] = useState<MaterialDeApoio[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categorias, setCategorias] = useState<CategoriaMaterial[]>([]);
  const [niveisSuporte, setNiveisSuporte] = useState<NivelSuporte[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedDependent) {
      loadMateriais();
      loadFavorites();
    }
  }, [selectedDependent]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Carregar categorias e níveis de suporte uma vez
      const [
        { data: dependentesData, error: dependentesError },
        { data: categoriasData, error: categoriasError },
        { data: niveisData, error: niveisError },
      ] = await Promise.all([
        supabase.from("Dependente").select("*").eq("responsavel_id", user.id).order("data_criacao", { ascending: false }),
        supabase.from("CategoriaMaterial").select("*"),
        supabase.from("NivelSuporteTEA").select("*"),
      ]);

      if (dependentesError) throw dependentesError;
      if (categoriasError) throw categoriasError;
      if (niveisError) throw niveisError;

      setCategorias(categoriasData || []);
      setNiveisSuporte(niveisData || []);
      setDependentes(dependentesData || []);

      if (dependentesData && dependentesData.length > 0) {
        setSelectedDependent(String(dependentesData[0].id));
      }
    } catch (error: any) {
      console.error("Erro ao carregar dados iniciais:", error);
      toast({ title: "Erro ao carregar dados", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadMateriais = async () => {
    const dependent = dependentes.find(d => String(d.id) === selectedDependent);
    if (!dependent?.nivel_suporte_tea_id) return;

    try {
      const { data, error } = await supabase
        .from("MaterialDeApoio")
        .select("*")
        .eq("nivel_suporte_tea_id", dependent.nivel_suporte_tea_id)
        .order("categoria_id");

      if (error) throw error;
      setMateriais(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar materiais:", error);
    }
  };

  const loadFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !selectedDependent) return;

      const { data, error } = await supabase
        .from("MaterialFavorito")
        .select("material_id")
        .eq("responsavel_id", user.id)
        .eq("dependente_id", parseInt(selectedDependent, 10));

      if (error) throw error;
      
      const favSet = new Set(data?.map(f => f.material_id) || []);
      setFavorites(favSet);
    } catch (error: any) {
      console.error("Erro ao carregar favoritos:", error);
    }
  };

  const toggleFavorite = async (materialId: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !selectedDependent) return;

      const dependentIdAsNumber = parseInt(selectedDependent, 10);

      if (favorites.has(materialId)) {
        const { error } = await supabase
          .from("MaterialFavorito")
          .delete()
          .eq("responsavel_id", user.id)
          .eq("material_id", materialId)
          .eq("dependente_id", dependentIdAsNumber);

        if (error) throw error;
        
        const newFavorites = new Set(favorites);
        newFavorites.delete(materialId);
        setFavorites(newFavorites);
        
        toast({ title: "Removido dos favoritos" });
      } else {
        const { error } = await supabase
          .from("MaterialFavorito")
          .insert({ responsavel_id: user.id, material_id: materialId, dependente_id: dependentIdAsNumber });

        if (error) throw error;
        
        setFavorites(new Set([...favorites, materialId]));
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

  const filteredMateriais = selectedCategory === "all"
    ? materiais
    : materiais.filter(material => String(material.categoria_id) === selectedCategory);

  const currentDependent = dependentes.find(d => String(d.id) === selectedDependent);
  const getNivelSuporteLabel = (id: number | null) => niveisSuporte.find(n => n.id === id)?.nome || "Nível não definido";
  const getCategoriaLabel = (id: number | null) => categorias.find(c => c.id === id)?.nome || "Sem Categoria";

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (dependentes.length === 0) {
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
        <h2 className="text-3xl font-bold mb-2">Materiais de Apoio</h2>
        <p className="text-muted-foreground">
          Conteúdo personalizado para o nível de suporte do seu dependente
        </p>
      </div>

      {/* Dependent Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Selecione o Dependente</CardTitle>
          <CardDescription>
            Os materiais serão filtrados de acordo com o nível de suporte selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedDependent} onValueChange={setSelectedDependent}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dependentes.map((dependent) => (
                <SelectItem key={dependent.id} value={String(dependent.id)}>
                  {dependent.nome} - {getNivelSuporteLabel(dependent.nivel_suporte_tea_id)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
          <TabsTrigger value="all">Todas</TabsTrigger>
          {categorias.map((cat) => (
            <TabsTrigger key={cat.id} value={String(cat.id)}>
              {cat.nome}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Tips Grid */}
      {filteredMateriais.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhum material encontrado para esta categoria.
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredMateriais.map((material) => {
            const Icon = categoryIcons[material.categoria_id as keyof typeof categoryIcons] || BookOpen;
            const isFavorite = favorites.has(material.id);
            
            return (
              <Card key={material.id} className="shadow-soft hover:shadow-medium transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Icon className="w-8 h-8 text-primary" />
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {getCategoriaLabel(material.categoria_id)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleFavorite(material.id)}
                      >
                        <Star 
                          className={`w-5 h-5 ${isFavorite ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                        />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{material.titulo}</CardTitle>
                  <CardDescription>
                    Personalizado para {currentDependent?.nome}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{material.corpo}</p>
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
