import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    titulo: string;
    autor?: string;
    corpo?: string;
    url_artigo?: string;
    url_imagem?: string;
  } | null;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ isOpen, onClose, article }) => {
  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2l h-[80vh] overflow-y-auto">
        {/* Imagem do artigo */}
        {article.url_imagem && (
          <div className="mb-4">
            <img
              src={article.url_imagem}
              alt={article.titulo}
              className="w-full h-64 object-cover rounded-md"
            />
          </div>
        )}

        <DialogHeader>
          {/* Título */}
          <div className="mb-4">
            <DialogTitle className="text-2xl font-bold">{article.titulo}</DialogTitle>
          </div>

          {/* Autor */}
          {article.autor && (
            <DialogDescription className="text-sm text-muted-foreground">
              <p>Por: {article.autor}</p>
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Corpo do artigo */}
        <div className="mt-6 whitespace-pre-wrap text-base leading-relaxed">
          {article.corpo ? (
            <p>{article.corpo}</p>
          ) : (
            <p className="text-muted-foreground">Nenhum conteúdo disponível para este artigo.</p>
          )}
        </div>

        {/* Link para o artigo */}
        {article.url_artigo && (
          <div className="mt-6">
            <Button asChild variant="link">
              <a href={article.url_artigo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Acessar Artigo
              </a>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ArticleModal;