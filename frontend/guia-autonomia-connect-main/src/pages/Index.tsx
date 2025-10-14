import { Link } from "react-router-dom";
import { Heart, Users, BookOpen, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Boxes } from "@/components/ui/background-boxes";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40rem] flex flex-col justify-center items-center bg-gradient-hero py-20 px-4 text-primary-foreground overflow-hidden">
        <Boxes />
        <div className="container mx-auto max-w-6xl relative z-20 pointer-events-none">
          <div className="text-center animate-fade-in">
            <img src="../public/logo.svg" alt="Guia Cuidar" className="h-24 w-auto mx-auto mb-8" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Guia Cuidar
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Sua plataforma completa de apoio para cuidadores de pessoas no espectro autista
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
              <Button asChild size="lg" variant="secondary" className="shadow-medium hover:shadow-large transition-all">
                <Link to="/auth">Começar Agora</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                <Link to="/explorar">Explorar Conteúdo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Como Podemos Ajudar
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-soft hover:shadow-medium transition-all">
              <CardHeader>
                <Heart className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Dicas Personalizadas</CardTitle>
                <CardDescription>
                  Receba orientações adaptadas ao nível de suporte do seu dependente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Conteúdo sobre higiene, educação, atividades e muito mais, personalizado para suas necessidades específicas.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-all">
              <CardHeader>
                <Users className="w-12 h-12 text-secondary mb-4" />
                <CardTitle>Comunidade de Apoio</CardTitle>
                <CardDescription>
                  Conecte-se com outros cuidadores e profissionais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Compartilhe experiências, aprenda com outros cuidadores e construa uma rede de apoio sólida.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-all">
              <CardHeader>
                <MapPin className="w-12 h-12 text-accent mb-4" />
                <CardTitle>Serviços Locais</CardTitle>
                <CardDescription>
                  Encontre recursos próximos a você
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Busque escolas, centros de apoio, terapeutas e outros serviços especializados em sua região.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto max-w-4xl text-center">
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Cadastre-se gratuitamente e tenha acesso a todas as ferramentas e recursos para apoiar seu cuidado diário.
          </p>
          <Button asChild size="lg" className="shadow-medium">
            <Link to="/auth">
              Criar Conta Gratuita
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
