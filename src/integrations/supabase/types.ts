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
      cases: {
        Row: {
          actual_repayment: string | null
          adjuster: string | null
          batch_number: string
          borrower_number: string
          case_entry_time: string | null
          case_number: string
          client: string | null
          created_at: string
          customer_name: string
          delegation_expiry_time: string | null
          delegation_period: string | null
          distribution_time: string | null
          distributor: string | null
          first_delegation_time: string | null
          id: string
          id_number: string
          installment_amount: string | null
          installment_periods: string | null
          is_delegation_expired: string | null
          latest_edit_time: string | null
          latest_progress_time: string | null
          loan_amount: string | null
          mediation_status: string | null
          overdue_date: string | null
          overdue_days: string | null
          overdue_m_value: string | null
          phone: string | null
          preferential_policy: string | null
          product_line: string | null
          progress_status: string | null
          receiver: string | null
          reduction_amount: string | null
          remaining_amount: string | null
          remaining_periods: string | null
          repaid_amount: string | null
          result_time: string | null
          tenant_id: string
          total_periods: string | null
          updated_at: string
        }
        Insert: {
          actual_repayment?: string | null
          adjuster?: string | null
          batch_number: string
          borrower_number: string
          case_entry_time?: string | null
          case_number: string
          client?: string | null
          created_at?: string
          customer_name: string
          delegation_expiry_time?: string | null
          delegation_period?: string | null
          distribution_time?: string | null
          distributor?: string | null
          first_delegation_time?: string | null
          id?: string
          id_number: string
          installment_amount?: string | null
          installment_periods?: string | null
          is_delegation_expired?: string | null
          latest_edit_time?: string | null
          latest_progress_time?: string | null
          loan_amount?: string | null
          mediation_status?: string | null
          overdue_date?: string | null
          overdue_days?: string | null
          overdue_m_value?: string | null
          phone?: string | null
          preferential_policy?: string | null
          product_line?: string | null
          progress_status?: string | null
          receiver?: string | null
          reduction_amount?: string | null
          remaining_amount?: string | null
          remaining_periods?: string | null
          repaid_amount?: string | null
          result_time?: string | null
          tenant_id: string
          total_periods?: string | null
          updated_at?: string
        }
        Update: {
          actual_repayment?: string | null
          adjuster?: string | null
          batch_number?: string
          borrower_number?: string
          case_entry_time?: string | null
          case_number?: string
          client?: string | null
          created_at?: string
          customer_name?: string
          delegation_expiry_time?: string | null
          delegation_period?: string | null
          distribution_time?: string | null
          distributor?: string | null
          first_delegation_time?: string | null
          id?: string
          id_number?: string
          installment_amount?: string | null
          installment_periods?: string | null
          is_delegation_expired?: string | null
          latest_edit_time?: string | null
          latest_progress_time?: string | null
          loan_amount?: string | null
          mediation_status?: string | null
          overdue_date?: string | null
          overdue_days?: string | null
          overdue_m_value?: string | null
          phone?: string | null
          preferential_policy?: string | null
          product_line?: string | null
          progress_status?: string | null
          receiver?: string | null
          reduction_amount?: string | null
          remaining_amount?: string | null
          remaining_periods?: string | null
          repaid_amount?: string | null
          result_time?: string | null
          tenant_id?: string
          total_periods?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      department_quotas: {
        Row: {
          created_at: string | null
          created_by: string | null
          department_id: string
          end_date: string
          id: string
          quota_amount: number
          remaining_amount: number
          service_type: string | null
          start_date: string
          tenant_id: string
          time_unit: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          department_id: string
          end_date: string
          id?: string
          quota_amount?: number
          remaining_amount?: number
          service_type?: string | null
          start_date: string
          tenant_id: string
          time_unit: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          department_id?: string
          end_date?: string
          id?: string
          quota_amount?: number
          remaining_amount?: number
          service_type?: string | null
          start_date?: string
          tenant_id?: string
          time_unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "department_quotas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_quotas_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      quota_usage_logs: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          service_type: string
          staff_id: string | null
          staff_quota_id: string | null
          tenant_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          service_type: string
          staff_id?: string | null
          staff_quota_id?: string | null
          tenant_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          service_type?: string
          staff_id?: string | null
          staff_quota_id?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quota_usage_logs_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quota_usage_logs_staff_quota_id_fkey"
            columns: ["staff_quota_id"]
            isOneToOne: false
            referencedRelation: "staff_quotas"
            referencedColumns: ["id"]
          },
        ]
      }
      recharge_order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          quantity: number
          service_type: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          quantity: number
          service_type: string
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          quantity?: number
          service_type?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "recharge_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "recharge_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      recharge_orders: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          created_by: string | null
          id: string
          order_number: string
          reject_reason: string | null
          status: string
          tenant_id: string
          total_amount: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          order_number: string
          reject_reason?: string | null
          status?: string
          tenant_id: string
          total_amount: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          order_number?: string
          reject_reason?: string | null
          status?: string
          tenant_id?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "recharge_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recharge_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string | null
          role_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sms_records: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          delivery_code: string | null
          delivery_message: string | null
          delivery_status: string | null
          delivery_time: string | null
          fail_count: number | null
          frequency_fail_count: number | null
          id: string
          mid: string | null
          recipients: string[]
          send_code: string
          send_time: string | null
          sms_type: string
          status: string | null
          success_count: number | null
          template_name: string
          tenant_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          delivery_code?: string | null
          delivery_message?: string | null
          delivery_status?: string | null
          delivery_time?: string | null
          fail_count?: number | null
          frequency_fail_count?: number | null
          id?: string
          mid?: string | null
          recipients: string[]
          send_code: string
          send_time?: string | null
          sms_type: string
          status?: string | null
          success_count?: number | null
          template_name: string
          tenant_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          delivery_code?: string | null
          delivery_message?: string | null
          delivery_status?: string | null
          delivery_time?: string | null
          fail_count?: number | null
          frequency_fail_count?: number | null
          id?: string
          mid?: string | null
          recipients?: string[]
          send_code?: string
          send_time?: string | null
          sms_type?: string
          status?: string | null
          success_count?: number | null
          template_name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_quotas: {
        Row: {
          created_at: string | null
          created_by: string | null
          department_quota_id: string | null
          id: string
          quota_amount: number
          remaining_amount: number
          staff_id: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          department_quota_id?: string | null
          id?: string
          quota_amount?: number
          remaining_amount?: number
          staff_id?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          department_quota_id?: string | null
          id?: string
          quota_amount?: number
          remaining_amount?: number
          staff_id?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_quotas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_quotas_department_quota_id_fkey"
            columns: ["department_quota_id"]
            isOneToOne: false
            referencedRelation: "department_quotas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_quotas_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_registrations: {
        Row: {
          address: string | null
          business_email: string | null
          company_intro: string | null
          company_name: string
          contact_person: string
          created_at: string
          id: string
          phone: string
          remarks: string | null
          social_credit_code: string
          tenant_id: string
          username: string
        }
        Insert: {
          address?: string | null
          business_email?: string | null
          company_intro?: string | null
          company_name: string
          contact_person: string
          created_at?: string
          id?: string
          phone: string
          remarks?: string | null
          social_credit_code: string
          tenant_id: string
          username: string
        }
        Update: {
          address?: string | null
          business_email?: string | null
          company_intro?: string | null
          company_name?: string
          contact_person?: string
          created_at?: string
          id?: string
          phone?: string
          remarks?: string | null
          social_credit_code?: string
          tenant_id?: string
          username?: string
        }
        Relationships: []
      }
      user_departments: {
        Row: {
          created_at: string | null
          department_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_departments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_departments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          phone: string | null
          tenant_id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          phone?: string | null
          tenant_id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          tenant_id?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          service_type: string
          tenant_id: string
          type: string
          wallet_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          service_type: string
          tenant_id: string
          type: string
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          service_type?: string
          tenant_id?: string
          type?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_departments_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_user_department: {
        Args: {
          p_user_id: string
        }
        Returns: {
          user_id: string
          department_id: string
          department_name: string
        }[]
      }
      upsert_user_department: {
        Args: {
          p_user_id: string
          p_department_id: string
        }
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
