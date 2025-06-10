export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alert_settings: {
        Row: {
          admin_email: string
          created_at: string
          email_frequency: string | null
          follow_up_enabled: boolean | null
          high_risk_enabled: boolean | null
          id: string
          new_leads_enabled: boolean | null
          updated_at: string
        }
        Insert: {
          admin_email: string
          created_at?: string
          email_frequency?: string | null
          follow_up_enabled?: boolean | null
          high_risk_enabled?: boolean | null
          id?: string
          new_leads_enabled?: boolean | null
          updated_at?: string
        }
        Update: {
          admin_email?: string
          created_at?: string
          email_frequency?: string | null
          follow_up_enabled?: boolean | null
          high_risk_enabled?: boolean | null
          id?: string
          new_leads_enabled?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      diagnostics: {
        Row: {
          created_at: string
          id: string
          input_data: Json
          results: Json
          risk_level: string | null
          session_id: string | null
          tool_type: string
          user_id: string
          viability: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          input_data: Json
          results: Json
          risk_level?: string | null
          session_id?: string | null
          tool_type: string
          user_id: string
          viability?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          input_data?: Json
          results?: Json
          risk_level?: string | null
          session_id?: string | null
          tool_type?: string
          user_id?: string
          viability?: string | null
        }
        Relationships: []
      }
      lead_qualification: {
        Row: {
          assigned_to: string | null
          id: string
          notes: string | null
          priority: number | null
          status: string | null
          tags: string[] | null
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          id?: string
          notes?: string | null
          priority?: number | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          id?: string
          notes?: string | null
          priority?: number | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          expires_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          last_activity: string | null
          lead_status: string | null
          phone: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          last_activity?: string | null
          lead_status?: string | null
          phone?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          last_activity?: string | null
          lead_status?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      tool_usage: {
        Row: {
          completed: boolean | null
          created_at: string
          id: string
          session_id: string | null
          tool_type: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          id?: string
          session_id?: string | null
          tool_type: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          id?: string
          session_id?: string | null
          tool_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      detailed_metrics: {
        Row: {
          completion_rate: number | null
          date: string | null
          tool_type: string | null
          unique_users: number | null
          usage_count: number | null
        }
        Relationships: []
      }
      usage_trends: {
        Row: {
          daily_usage: number | null
          daily_users: number | null
          date: string | null
          usage_growth_percent: number | null
          users_growth_percent: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_notification: {
        Args: {
          p_type: string
          p_title: string
          p_message: string
          p_data?: Json
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
