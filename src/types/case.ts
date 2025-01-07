export interface Case {
  id: string;
  case_number: string;
  batch_number: string;
  borrower_number: string;
  id_number: string;
  customer_name: string;
  phone: string | null;
  product_line: string | null;
  loan_amount: string | null;
  repaid_amount: string | null;
  remaining_amount: string | null;
  total_periods: string | null;
  remaining_periods: string | null;
  overdue_date: string | null;
  overdue_days: string | null;
  overdue_m_value: string | null;
  progress_status: string | null;
  client: string | null;
  delegation_period: string | null;
  is_delegation_expired: string | null;
  delegation_expiry_time: string | null;
  first_delegation_time: string | null;
  latest_progress_time: string | null;
  latest_edit_time: string | null;
  distribution_time: string | null;
  case_entry_time: string | null;
  result_time: string | null;
  preferential_policy: string | null;
  actual_repayment: string | null;
  reduction_amount: string | null;
  installment_amount: string | null;
  installment_periods: string | null;
  mediation_status: string | null;
  receiver: string | null;
  adjuster: string | null;
  distributor: string | null;
}

export interface CaseTableProps {
  data: Case[];
  isLoading: boolean;
}