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

const supportLevelLabels = {
  nivel_1: "Nível 1 - Requer apoio",
  nivel_2: "Nível 2 - Requer apoio substancial",
  nivel_3: "Nível 3 - Requer apoio muito substancial",
};

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [dependents, setDependents] = useState<any[]>([]);
  const [editingDependent, setEditingDependent] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    support_level: "nivel_1",
    notes: "",
  });

  useEffect(() => {
    loadProfile();
    loadDependents();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

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
    } catch (error: any) {
      console.error("Erro ao carregar dependentes:", error);
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
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : null,
        support_level: formData.support_level as "nivel_1" | "nivel_2" | "nivel_3",
        notes: formData.notes,
        user_id: user.id,
      };

      if (editingDependent) {
        const { error } = await supabase
          .from("dependents")
          .update(dependentData)
          .eq("id", editingDependent.id);

        if (error) throw error;
        toast({ title: "Dependente atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from("dependents")
          .insert(dependentData);

        if (error) throw error;
        toast({ title: "Dependente adicionado com sucesso!" });
      }

      setFormData({ name: "", age: "", support_level: "nivel_1", notes: "" });
      setEditingDependent(null);
      loadDependents();
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

  const handleEdit = (dependent: any) => {
    setEditingDependent(dependent);
    setFormData({
      name: dependent.name,
      age: dependent.age?.toString() || "",
      support_level: dependent.support_level,
      notes: dependent.notes || "",
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase
        .from("dependents")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;
      
      toast({ title: "Dependente removido com sucesso!" });
      loadDependents();
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
            <p className="text-lg font-medium">{profile?.full_name}</p>
          </div>
          <div>
            <Label>Email</Label>
            <p className="text-lg font-medium">{profile?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Dependents List */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Dependentes Cadastrados</h3>
        {dependents.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum dependente cadastrado ainda. Adicione um abaixo.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {dependents.map((dependent) => (
              <Card key={dependent.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{dependent.name}</CardTitle>
                      <CardDescription>
                        {dependent.age && `${dependent.age} anos • `}
                        {supportLevelLabels[dependent.support_level as keyof typeof supportLevelLabels]}
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
                {dependent.notes && (
                  <CardContent>
                    <p className="text-muted-foreground">{dependent.notes}</p>
                  </CardContent>
                )}
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                type="number"
                min="0"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="support_level">Nível de Suporte *</Label>
              <Select
                value={formData.support_level}
                onValueChange={(value) => setFormData({ ...formData, support_level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(supportLevelLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
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
                    setFormData({ name: "", age: "", support_level: "nivel_1", notes: "" });
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
