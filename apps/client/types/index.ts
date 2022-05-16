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
    alternatives: any[];
    current_deadline?: any;
    currently_due: any[];
    disabled_reason?: any;
    errors: any[];
    eventually_due: any[];
    past_due: any[];
    pending_verification: any[];
  };
  login_links: {
    object: string;
    data: any[];
    has_more: boolean;
    total_count: number;
    url: string;
  };
  payouts_enabled: boolean;
  requirements: {
    alternatives: any[];
    current_deadline: number;
    currently_due: string[];
    disabled_reason?: any;
    errors: {
      code: string;
      reason: string;
      requirement: string;
    }[];
    eventually_due: string[];
    past_due: any[];
    pending_verification: any[];
  };
  settings: any;
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
