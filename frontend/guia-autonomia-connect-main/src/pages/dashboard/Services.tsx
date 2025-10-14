import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, ExternalLink, Search } from "lucide-react";

const Services = () => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cepFilter, setCepFilter] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name");

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadFilteredServices();
  };

  const loadFilteredServices = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("services")
        .select("*");

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%`);
      }

      if (cepFilter) {
        query = query.ilike("cep", `${cepFilter}%`);
      }

      const { data, error } = await query.order("name");

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      console.error("Erro ao filtrar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Serviços e Suporte Local</h2>
        <p className="text-muted-foreground">
          Encontre escolas, centros de apoio e profissionais especializados em sua região
        </p>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Serviços</CardTitle>
          <CardDescription>
            Filtre por nome, cidade ou CEP para encontrar serviços próximos a você
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Nome ou Cidade</Label>
              <Input
                id="search"
                placeholder="Digite o nome ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                placeholder="00000-000"
                value={cepFilter}
                onChange={(e) => setCepFilter(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
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
                setCepFilter("");
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
                  <Badge>{service.type}</Badge>
                </div>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{service.address}</p>
                    <p>{service.city} - {service.state}</p>
                    <p className="text-muted-foreground">CEP: {service.cep}</p>
                  </div>
                </div>

                {service.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${service.phone}`} className="hover:text-primary">
                      {service.phone}
                    </a>
                  </div>
                )}

                {service.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${service.email}`} className="hover:text-primary">
                      {service.email}
                    </a>
                  </div>
                )}

                {service.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={service.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      Visitar site
                    </a>
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
