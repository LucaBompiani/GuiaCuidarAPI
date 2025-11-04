import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type Dependente = Database["public"]["Tables"]["Dependente"]["Row"];
type MaterialDeApoio = Database["public"]["Tables"]["MaterialDeApoio"]["Row"];
type CategoriaMaterial = Database["public"]["Tables"]["CategoriaMaterial"]["Row"];

const Favorites = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dependentes, setDependentes] = useState<Dependente[]>([]);
  const [selectedDependent, setSelectedDependent] = useState<string>("");
  const [favorites, setFavorites] = useState<MaterialDeApoio[]>([]);
  const [categorias, setCategorias] = useState<CategoriaMaterial[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedDependent) {
      loadFavorites();
    }
  }, [selectedDependent]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [
        { data: dependentesData, error: dependentesError },
        { data: categoriasData, error: categoriasError },
      ] = await Promise.all([
        supabase.from("Dependente").select("*").eq("responsavel_id", user.id).order("data_criacao", { ascending: false }),
        supabase.from("CategoriaMaterial").select("*"),
      ]);

      if (dependentesError) throw dependentesError;
      if (categoriasError) throw categoriasError;

      setDependentes(dependentesData || []);
      setCategorias(categoriasData || []);

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

  const loadFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !selectedDependent) return;

      const { data, error } = await supabase
        .from("MaterialFavorito")
        .select("material_id, materiais:MaterialDeApoio(*)")
        .eq("responsavel_id", user.id)
        .eq("dependente_id", parseInt(selectedDependent, 10));

      if (error) throw error;

      const favoriteMaterials = data?.map((item) => item.materiais) || [];
      setFavorites(favoriteMaterials);
    } catch (error: any) {
      console.error("Erro ao carregar favoritos:", error);
      toast({
        title: "Erro ao carregar favoritos",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
              Você precisa cadastrar um dependente na página de Perfil para visualizar favoritos.
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
        <h2 className="text-3xl font-bold mb-2">Favoritos</h2>
        <p className="text-muted-foreground">
          Veja os materiais favoritos do seu dependente
        </p>
      </div>

      {/* Dependent Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Selecione o Dependente</CardTitle>
          <CardDescription>
            Os favoritos serão filtrados de acordo com o dependente selecionado
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
                  {dependent.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhum material favorito encontrado para este dependente.
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {favorites.map((material) => (
            <Card key={material.id} className="shadow-soft hover:shadow-medium transition-all">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary">
                    {getCategoriaLabel(material.categoria_id)}
                  </Badge>
                  <Star className="w-5 h-5 fill-accent text-accent" />
                </div>
                <CardTitle className="text-xl">{material.titulo}</CardTitle>
                <CardDescription>{material.corpo}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{material.corpo}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;