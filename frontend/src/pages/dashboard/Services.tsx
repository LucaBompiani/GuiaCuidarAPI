import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

// Definindo os tipos com base no seu novo schema
type Servico = Database["public"]["Tables"]["ServicoLocal"]["Row"] & {
  TipoServico: {
    name: string;
  } | null;
};

type TipoServico = Database["public"]["Tables"]["TipoServico"]["Row"];

const Services = () => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Servico[]>([]);
  const [tiposServico, setTiposServico] = useState<TipoServico[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipoServico, setSelectedTipoServico] = useState<string>("");

  useEffect(() => {
    loadTiposServico();
    loadServices();
  }, []);

  const loadTiposServico = async () => {
    try {
      const { data, error } = await supabase
        .from("TipoServico")
        .select("*")
        .order("name");

      if (error) throw error;
      setTiposServico(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar tipos de serviço:", error);
    }
  };

  const loadServices = async (filter = "", tipoServicoId = "") => {
    setLoading(true);
    try {
      let query = supabase
        .from("ServicoLocal")
        .select(`
          *,
          TipoServico ( name )
        `);

      if (filter) {
        // Busca pelo nome do serviço ou pelo endereço
        query = query.or(`name.ilike.%${filter}%,endereco.ilike.%${filter}%`);
      }

      if (tipoServicoId) {
        // Filtra pelo tipo de serviço
        query = query.eq("tipo_servico_id", parseInt(tipoServicoId));
      }

      const { data, error } = await query.order("name");

      if (error) throw error;
      setServices(data as Servico[] || []);
    } catch (error: any) {
      console.error("Erro ao carregar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const tipoId = selectedTipoServico === "all" ? "" : selectedTipoServico;
    loadServices(searchTerm, tipoId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Serviços e Suporte Local</h2>
        <p className="text-muted-foreground">
          Encontre centros de apoio e profissionais especializados em sua região
        </p>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Serviços</CardTitle>
          <CardDescription>
            Filtre por nome, endereço ou tipo de serviço.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Nome ou Endereço</Label>
              <Input
                id="search"
                placeholder="Digite o nome do serviço ou endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo-servico">Tipo de Serviço</Label>
              <Select
                value={selectedTipoServico}
                onValueChange={setSelectedTipoServico}
              >
                <SelectTrigger id="tipo-servico">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {tiposServico.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      {tipo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedTipoServico("");
                loadServices();
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando serviços...</p>
        </div>
      ) : services.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhum serviço encontrado com os filtros aplicados.
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="shadow-soft hover:shadow-medium transition-all">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge>{service.TipoServico?.name || "Não especificado"}</Badge>
                </div>
                <CardTitle className="text-xl">{service.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {service.endereco && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p>{service.endereco}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
