import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import ArticleModal from "@/components/ui/article-modal";

type Artigo = Database["public"]["Tables"]["ArtigoInformativo"]["Row"];

const Articles = () => {
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Artigo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("ArtigoInformativo")
        .select("*")
        .order("data_criacao", { ascending: false });

      if (error) throw error;
      setArtigos(data || []);
    } catch (error) {
      console.error("Erro ao carregar artigos:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (artigo: Artigo) => {
    setSelectedArticle(artigo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedArticle(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Artigos Informativos</h2>
        <p className="text-muted-foreground">
          Explore artigos e informações sobre o espectro autista
        </p>
      </div>

      {artigos.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhum artigo disponível no momento.
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artigos.map((artigo) => (
            <Card
              key={artigo.id}
              className="shadow-soft hover:shadow-medium transition-all flex flex-col cursor-pointer"
              onClick={() => openModal(artigo)}
            >
              {artigo.url_imagem && (
                <img
                  src={artigo.url_imagem}
                  alt={artigo.titulo}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <CardHeader>
                <div className="flex items-start gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <CardTitle className="text-xl">{artigo.titulo}</CardTitle>
                </div>
                {artigo.autor && <CardDescription>Por: {artigo.autor}</CardDescription>}
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-4">{artigo.corpo}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ArticleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        article={selectedArticle}
      />
    </div>
  );
};

export default Articles;
