CREATE INDEX IF NOT EXISTS blocks_pk_block_number_btree ON blocks (pk_block_number);
CREATE INDEX IF NOT EXISTS transactions_block_number_idx ON transactions (fk_block_number);

-- Add indexes for frequently used timestamp columns
CREATE INDEX IF NOT EXISTS transactions_block_timestamp_idx ON transactions (block_timestamp DESC);

-- Indexes for accounts, domains, and handles tables
CREATE INDEX IF NOT EXISTS handles_handle_idx ON handles (handle);
CREATE INDEX IF NOT EXISTS domains_domain_name_idx ON domains (domain_name);
CREATE INDEX IF NOT EXISTS domains_domain_status_idx ON domains (domain_status);
CREATE INDEX IF NOT EXISTS handles_handle_status_idx ON handles (handle_status);

-- Foreign key relationship indexes
CREATE INDEX IF NOT EXISTS handles_fk_domain_id_idx ON handles (fk_domain_id);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS handles_domain_status_idx ON handles (fk_domain_id, handle_status);
CREATE INDEX IF NOT EXISTS domains_status_public_idx ON domains (domain_status, is_public);

-- Index for account activities
CREATE INDEX IF NOT EXISTS accountactivities_fk_account_id_idx ON accountactivities (fk_account_id);
CREATE INDEX IF NOT EXISTS handleactivities_fk_handle_id_idx ON handleactivities (fk_handle_id);
CREATE INDEX IF NOT EXISTS domainactivities_fk_domain_id_idx ON domainactivities (fk_domain_id);

-- Index for transactions.fk_account_id if not already existing
CREATE INDEX IF NOT EXISTS idx_transactions_fk_account_id ON transactions(fk_account_id);

-- Indexes for tokentransfers table to optimize token transfers lookups
CREATE INDEX IF NOT EXISTS idx_tokentransfers_fk_transaction_id ON tokentransfers(fk_transaction_id);
CREATE INDEX IF NOT EXISTS idx_tokentransfers_fk_payer_account_id ON tokentransfers(fk_payer_account_id);
CREATE INDEX IF NOT EXISTS idx_tokentransfers_fk_payee_account_id ON tokentransfers(fk_payee_account_id);

-- Composite index for optimizing the token transfer aggregation queries
CREATE INDEX IF NOT EXISTS idx_tokentransfers_txid_payer_composite ON tokentransfers(fk_transaction_id, fk_payer_account_id);
CREATE INDEX IF NOT EXISTS idx_tokentransfers_txid_payee_composite ON tokentransfers(fk_transaction_id, fk_payee_account_id);
-- optimises:  fk_payer_account_id = ?  + GROUP BY fk_transaction_id
CREATE INDEX IF NOT EXISTS idx_tokentransfers_payer_txid_composite
  ON tokentransfers(fk_payer_account_id, fk_transaction_id);

-- optimises:  fk_payee_account_id = ?  + JOIN … ON fk_transaction_id
CREATE INDEX IF NOT EXISTS idx_tokentransfers_payee_txid_composite
  ON tokentransfers(fk_payee_account_id, fk_transaction_id);

-- Basic indexes for common sort fields
CREATE INDEX IF NOT EXISTS idx_accounts_pk_account_id ON accounts(pk_account_id);
CREATE INDEX IF NOT EXISTS idx_accounts_block_timestamp ON accounts(block_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_accounts_fio_balance_suf ON accounts(fio_balance_suf DESC);
CREATE INDEX IF NOT EXISTS idx_accounts_balance_id ON accounts (fio_balance_suf ASC, pk_account_id ASC);

-- Indexes for handle and domain relationships to optimize count aggregations (consolidated)
CREATE INDEX IF NOT EXISTS idx_handles_fk_owner_account_id ON handles(fk_owner_account_id);
CREATE INDEX IF NOT EXISTS idx_domains_fk_owner_account_id ON domains(fk_owner_account_id);

-- Covering index for handle counts (includes pk_handle_id which is needed for COUNT DISTINCT)
CREATE INDEX IF NOT EXISTS idx_handles_owner_pk_covering ON handles(fk_owner_account_id) INCLUDE (pk_handle_id);

-- Index specifically for the COUNT operation on pk_handle_id
CREATE INDEX IF NOT EXISTS idx_handles_pk_handle_id ON handles(pk_handle_id);

-- Specialized index that might help with the GROUP BY operations
CREATE INDEX IF NOT EXISTS idx_handles_owner_groupby ON handles(fk_owner_account_id, pk_handle_id);

CREATE INDEX IF NOT EXISTS idx_domains_owner_pk_covering ON domains(fk_owner_account_id) INCLUDE (pk_domain_id);

-- Composite index for accounts table sorting and filtering (includes account_name)
CREATE INDEX IF NOT EXISTS idx_accounts_sorting_composite ON accounts(
  pk_account_id, 
  account_name, 
  fio_balance_suf, 
  block_timestamp
);

-- Indexes for optimizing transaction lookup by ID
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_id ON transactions(transaction_id);

-- Index for trace operations
CREATE INDEX IF NOT EXISTS idx_traces_fk_transaction_id ON traces(fk_transaction_id);
CREATE INDEX IF NOT EXISTS idx_traces_fk_action_account_id ON traces(fk_action_account_id);

-- Index for transaction action account lookups
CREATE INDEX IF NOT EXISTS idx_transactions_fk_action_account_id ON transactions(fk_action_account_id);

-- Additional indexes for account transactions optimization
CREATE INDEX IF NOT EXISTS idx_accountactivities_fk_transaction_id ON accountactivities(fk_transaction_id);

-- Composite index for transactions with pk_transaction_id DESC for efficient sorting
CREATE INDEX IF NOT EXISTS idx_transactions_fk_account_pk_desc ON transactions(fk_account_id, pk_transaction_id DESC);

-- Composite index for accountactivities to optimize the receiver query
CREATE INDEX IF NOT EXISTS idx_accountactivities_account_transaction ON accountactivities(fk_account_id, fk_transaction_id);
