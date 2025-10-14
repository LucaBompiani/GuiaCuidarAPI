import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["Responsavel"]["Row"];
type Dependente = Database["public"]["Tables"]["Dependente"]["Row"];
type NivelSuporte = Database["public"]["Tables"]["NivelSuporteTEA"]["Row"];

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dependentes, setDependentes] = useState<Dependente[]>([]);
  const [niveisSuporte, setNiveisSuporte] = useState<NivelSuporte[]>([]);
  const [editingDependent, setEditingDependent] = useState<Dependente | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    nivel_suporte_tea_id: "",
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [
        { data: profileData, error: profileError },
        { data: dependentesData, error: dependentesError },
        { data: niveisData, error: niveisError },
      ] = await Promise.all([
        supabase.from("Responsavel").select("*").eq("id", user.id).single(),
        supabase.from("Dependente").select("*").eq("responsavel_id", user.id).order("data_criacao", { ascending: false }),
        supabase.from("NivelSuporteTEA").select("*"),
      ]);

      if (profileError) throw profileError;
      if (dependentesError) throw dependentesError;
      if (niveisError) throw niveisError;

      setProfile(profileData);
      setDependentes(dependentesData || []);
      setNiveisSuporte(niveisData || []);

      if (niveisData && niveisData.length > 0) {
        setFormData(prev => ({ ...prev, nivel_suporte_tea_id: String(niveisData[0].id) }));
      }

    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
      toast({ title: "Erro ao carregar dados", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDependent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const dependentData = {
        nome: formData.nome,
        nivel_suporte_tea_id: parseInt(formData.nivel_suporte_tea_id),
        responsavel_id: user.id,
      };

      if (editingDependent) {
        const { error } = await supabase
          .from("Dependente")
          .update(dependentData)
          .eq("id", editingDependent.id);

        if (error) throw error;
        toast({ title: "Dependente atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from("Dependente")
          .insert(dependentData);

        if (error) throw error;
        toast({ title: "Dependente adicionado com sucesso!" });
      }

      setFormData({ nome: "", nivel_suporte_tea_id: niveisSuporte[0]?.id.toString() || "" });
      setEditingDependent(null);
      // Recarrega apenas os dependentes
      const { data, error } = await supabase.from("Dependente").select("*").eq("responsavel_id", user.id).order("data_criacao", { ascending: false });
      if (error) throw error;
      setDependentes(data || []);

    } catch (error: any) {
      toast({
        title: "Erro ao salvar dependente",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dependent: Dependente) => {
    setEditingDependent(dependent);
    setFormData({
      nome: dependent.nome,
      nivel_suporte_tea_id: String(dependent.nivel_suporte_tea_id),
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase
        .from("Dependente")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;
      
      toast({ title: "Dependente removido com sucesso!" });
      setDependentes(prev => prev.filter(d => d.id !== deleteId));
    } catch (error: any) {
      toast({
        title: "Erro ao remover dependente",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const getNivelSuporteLabel = (id: number | null) => niveisSuporte.find(n => n.id === id)?.nome || "N/A";

  if (loading && !profile) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Perfil e Dependentes</h2>
        <p className="text-muted-foreground">
          Gerencie suas informações e os dependentes cadastrados
        </p>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Suas Informações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nome</Label>
            <p className="text-lg font-medium">{profile?.nome}</p>
          </div>
          <div>
            <Label>Email</Label>
            <p className="text-lg font-medium">{profile?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Dependentes List */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Dependentes Cadastrados</h3>
        {dependentes.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum dependente cadastrado ainda. Adicione um abaixo.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {dependentes.map((dependent) => (
              <Card key={dependent.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{dependent.nome}</CardTitle>
                      <CardDescription>
                        {getNivelSuporteLabel(dependent.nivel_suporte_tea_id)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(dependent)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteId(dependent.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dependent Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingDependent ? "Editar Dependente" : "Adicionar Novo Dependente"}
          </CardTitle>
          <CardDescription>
            Adicione as informações do dependente, incluindo o nível de suporte para receber dicas personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveDependent} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="support_level">Nível de Suporte *</Label>
              <Select
                value={formData.nivel_suporte_tea_id}
                onValueChange={(value) => setFormData({ ...formData, nivel_suporte_tea_id: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {niveisSuporte.map((nivel) => (
                    <SelectItem key={nivel.id} value={String(nivel.id)}>
                      {nivel.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {editingDependent ? (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Atualizar
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </>
                )}
              </Button>
              {editingDependent && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingDependent(null);
                    setFormData({ nome: "", nivel_suporte_tea_id: niveisSuporte[0]?.id.toString() || "" });
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este dependente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
