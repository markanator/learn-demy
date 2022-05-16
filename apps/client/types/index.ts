export interface StripeSeller {
  id: string;
  object: string;
  business_profile: {
    mcc: string;
    name?: string;
    support_address?: string;
    support_email?: string;
    support_phone?: string;
    support_url?: string;
    url: string;
  };
  capabilities: {
    card_payments: string;
    transfers: string;
  };
  charges_enabled: boolean;
  country: string;
  created: number;
  default_currency: string;
  details_submitted: boolean;
  email?: string;
  external_accounts: {
    object: string;
    data: Datum[];
    has_more: boolean;
    total_count: number;
    url: string;
  };
  future_requirements: {
    alternatives: unknown[];
    current_deadline?: unknown;
    currently_due: unknown[];
    disabled_reason?: unknown;
    errors: unknown[];
    eventually_due: unknown[];
    past_due: unknown[];
    pending_verification: unknown[];
  };
  login_links: {
    object: string;
    data: unknown[];
    has_more: boolean;
    total_count: number;
    url: string;
  };
  payouts_enabled: boolean;
  requirements: {
    alternatives: unknown[];
    current_deadline: number;
    currently_due: string[];
    disabled_reason?: unknown;
    errors: {
      code: string;
      reason: string;
      requirement: string;
    }[];
    eventually_due: string[];
    past_due: unknown[];
    pending_verification: unknown[];
  };
  settings: unknown;
  tos_acceptance: {
    date?: number;
  };
  type: string;
}

export interface Datum {
  id: string;
  object: string;
  account: string;
  account_holder_name?: string;
  account_holder_type?: string;
  account_type?: string;
  available_payout_methods: string[];
  bank_name: string;
  country: string;
  currency: string;
  default_for_currency: boolean;
  fingerprint: string;
  last4: string;
  routing_number: string;
  status: string;
}

export type UserRole = 'Subscriber' | 'Instructor' | 'Admin';
