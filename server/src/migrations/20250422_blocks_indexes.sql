CREATE INDEX blocks_pk_block_number_btree ON blocks (pk_block_number);
CREATE INDEX transactions_block_number_idx ON transactions (fk_block_number);
