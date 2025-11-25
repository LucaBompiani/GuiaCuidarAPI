import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, BookOpen, MapPin, LogOut, Star, FileText } from "lucide-react";
// Importe o SidebarButton aqui
import { Sidebar, SidebarBody, SidebarLink, SidebarButton } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

// Adaptado para a nova estrutura do SidebarLink
const menuItems = [
    {
        label: "Perfil e Dependentes",
        href: "/dashboard/perfil",
        icon: <User className="w-5 h-5" />,
    },
    {
        label: "Materiais de Apoio",
        href: "/dashboard/dicas",
        icon: <BookOpen className="w-5 h-5" />,
    },
    {
        label: "Artigos",
        href: "/dashboard/artigos",
        icon: <FileText className="w-5 h-5" />,
    },
    {
        label: "Favoritos",
        href: "/dashboard/favoritos",
        icon: <Star className="w-5 h-5" />,
    },
    {
        label: "Serviços Locais",
        href: "/dashboard/servicos",
        icon: <MapPin className="w-5 h-5" />,
    },
];

const DashboardLayout = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) {
                navigate("/auth");
                return;
            }
            setUser(session.user);
        };

        checkAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate("/auth");
            } else {
                setUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            toast({
                title: "Logout realizado",
                description: "Até logo!",
            });
            navigate("/");
        } catch (error: any) {
            toast({
                title: "Erro ao sair",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="flex w-full">
            <Sidebar>
                <SidebarBody className="h-screen justify-between gap-10">
                    <div className="flex flex-col flex-1">
                        <div className="mt-8 flex flex-col gap-2">
                            {menuItems.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarButton
                            icon={<LogOut className="w-5 h-5" />}
                            label="Sair"
                            onClick={handleLogout}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>

            {/* Conteúdo principal */}
            <main className="flex-1 overflow-auto">
                <div className="p-6 md:p-8 md:pt-16">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
