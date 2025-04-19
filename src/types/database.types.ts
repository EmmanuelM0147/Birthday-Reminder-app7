export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          name: string
          email: string
          date_of_birth: string
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          name: string
          email: string
          date_of_birth: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          name?: string
          email?: string
          date_of_birth?: string
          created_at?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          id: string
          user_id: string
          sent_at: string
          status: string
        }
        Insert: {
          id?: string
          user_id: string
          sent_at?: string
          status: string
        }
        Update: {
          id?: string
          user_id?: string
          sent_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}