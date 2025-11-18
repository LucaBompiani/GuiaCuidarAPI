export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ArtigoInformativo: {
        Row: {
          autor: string | null
          corpo: string
          data_atualizacao: string | null
          data_criacao: string | null
          id: number
          titulo: string
        }
        Insert: {
          autor?: string | null
          corpo: string
          data_atualizacao?: string | null
          data_criacao?: string | null
          id?: number
          titulo: string
        }
        Update: {
          autor?: string | null
          corpo?: string
          data_atualizacao?: string | null
          data_criacao?: string | null
          id?: number
          titulo?: string
        }
        Relationships: []
      }
      CategoriaMaterial: {
        Row: {
          data_criacao: string | null
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          data_criacao?: string | null
          descricao?: string | null
          id?: number
          nome: string
        }
        Update: {
          data_criacao?: string | null
          descricao?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      DadosEstatisticosTEA: {
        Row: {
          conteudo: string
          data_criacao: string | null
          descricao: string | null
          fonte: string | null
          id: number
          nome: string
        }
        Insert: {
          conteudo: string
          data_criacao?: string | null
          descricao?: string | null
          fonte?: string | null
          id?: number
          nome: string
        }
        Update: {
          conteudo?: string
          data_criacao?: string | null
          descricao?: string | null
          fonte?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      Dependente: {
        Row: {
          data_atualizacao: string | null
          data_criacao: string | null
          id: number
          nivel_suporte_tea_id: number | null
          nome: string
          responsavel_id: string
        }
        Insert: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          id?: number
          nivel_suporte_tea_id?: number | null
          nome: string
          responsavel_id: string
        }
        Update: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          id?: number
          nivel_suporte_tea_id?: number | null
          nome?: string
          responsavel_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Dependente_nivel_suporte_tea_id_fkey"
            columns: ["nivel_suporte_tea_id"]
            isOneToOne: false
            referencedRelation: "NivelSuporteTEA"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Dependente_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "Responsavel"
            referencedColumns: ["id"]
          },
        ]
      }
      DepoimentoResponsavel: {
        Row: {
          aprovado: boolean | null
          categoria_id: number | null
          data_criacao: string | null
          id: number
          responsavel_id: string
          texto: string
        }
        Insert: {
          aprovado?: boolean | null
          categoria_id?: number | null
          data_criacao?: string | null
          id?: number
          responsavel_id: string
          texto: string
        }
        Update: {
          aprovado?: boolean | null
          categoria_id?: number | null
          data_criacao?: string | null
          id?: number
          responsavel_id?: string
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "DepoimentoResponsavel_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "CategoriaMaterial"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "DepoimentoResponsavel_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "Responsavel"
            referencedColumns: ["id"]
          },
        ]
      }
      MaterialDeApoio: {
        Row: {
          categoria_id: number | null
          corpo: string | null
          data_atualizacao: string | null
          data_criacao: string | null
          id: number
          nivel_suporte_tea_id: number | null
          titulo: string
        }
        Insert: {
          categoria_id?: number | null
          corpo?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          id?: number
          nivel_suporte_tea_id?: number | null
          titulo: string
        }
        Update: {
          categoria_id?: number | null
          corpo?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          id?: number
          nivel_suporte_tea_id?: number | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "MaterialDeApoio_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "CategoriaMaterial"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MaterialDeApoio_nivel_suporte_tea_id_fkey"
            columns: ["nivel_suporte_tea_id"]
            isOneToOne: false
            referencedRelation: "NivelSuporteTEA"
            referencedColumns: ["id"]
          },
        ]
      }
      MaterialFavorito: {
        Row: {
          data_favoritado: string | null
          dependente_id: number
          material_id: number
          responsavel_id: string
        }
        Insert: {
          data_favoritado?: string | null
          dependente_id: number
          material_id: number
          responsavel_id: string
        }
        Update: {
          data_favoritado?: string | null
          dependente_id?: number
          material_id?: number
          responsavel_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "MaterialFavorito_dependente_id_fkey"
            columns: ["dependente_id"]
            isOneToOne: false
            referencedRelation: "Dependente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MaterialFavorito_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "MaterialDeApoio"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MaterialFavorito_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "Responsavel"
            referencedColumns: ["id"]
          },
        ]
      }
      NivelSuporteTEA: {
        Row: {
          data_criacao: string | null
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          data_criacao?: string | null
          descricao?: string | null
          id?: number
          nome: string
        }
        Update: {
          data_criacao?: string | null
          descricao?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      Responsavel: {
        Row: {
          data_atualizacao: string | null
          data_criacao: string | null
          email: string
          id: string
          nome: string
          senha_hash: string | null
        }
        Insert: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          email: string
          id: string
          nome: string
          senha_hash?: string | null
        }
        Update: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          email?: string
          id?: string
          nome?: string
          senha_hash?: string | null
        }
        Relationships: []
      }
      ServicoLocal: {
        Row: {
          data_atualizacao: string | null
          data_criacao: string | null
          endereco: string | null
          id: number
          name: string
          tipo_servico_id: number | null
          url_servico: string | null
        }
        Insert: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          endereco?: string | null
          id?: number
          name: string
          tipo_servico_id?: number | null
        }
        Update: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          endereco?: string | null
          id?: number
          name?: string
          tipo_servico_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ServicoLocal_tipo_servico_id_fkey"
            columns: ["tipo_servico_id"]
            isOneToOne: false
            referencedRelation: "TipoServico"
            referencedColumns: ["id"]
          },
        ]
      }
      TipoServico: {
        Row: {
          data_criacao: string | null
          descricao: string | null
          id: number
          name: string
        }
        Insert: {
          data_criacao?: string | null
          descricao?: string | null
          id?: number
          name: string
        }
        Update: {
          data_criacao?: string | null
          descricao?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
