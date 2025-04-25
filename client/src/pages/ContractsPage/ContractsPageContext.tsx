import { useState, useEffect, useCallback } from 'react';

import { useGetData } from 'src/hooks/useGetData';
import { getContractTables } from 'src/services/fio';

import { FIO_CONTRACTS_MAP } from '@shared/constants/fio';

import {
  ContractItemType,
  ContractTable,
  ContractTablesResponse,
} from '@shared/types/fio-api-server';

export type UseContractsPageContextType = {
  loading: boolean;
  contracts: ContractItemType[];
  activeContract: ContractItemType | null;
  setActiveContract: (contract: ContractItemType) => void;
  activeTable: ContractTable | null;
  setActiveTable: (table: ContractTable) => void;
  reverse: boolean;
  onReverse: () => void;
  onRefresh: () => void;
};

const CONTRACTS_LIST = Object.values(FIO_CONTRACTS_MAP)
  .filter(
    (contract) =>
      ![FIO_CONTRACTS_MAP['fio.msig'], FIO_CONTRACTS_MAP['eosio.token']].includes(contract)
  )
  .map((contract) => ({
    name: contract,
    tables: [],
  }));

export const useContractsPageContext = (): UseContractsPageContextType => {
  const [activeContract, setActiveContract] = useState<ContractItemType | null>(null);
  const [activeTable, setActiveTable] = useState<ContractTable | null>(null);
  const [reverse, setReverse] = useState<boolean>(false);
  const [contracts, setContracts] = useState<ContractItemType[]>(CONTRACTS_LIST);

  const { response: tablesResponse, loading: tablesLoading } = useGetData<ContractTablesResponse>({
    action: getContractTables,
    params: { contractName: !activeContract?.tables.length ? activeContract?.name : null },
  });

  const onReverse = useCallback(() => {
    setReverse((prev) => !prev);
  }, []);

  const onRefresh = useCallback(() => {
    setActiveTable(null);
    setTimeout(() => {
      setActiveTable(activeTable);
    });
  }, [activeTable]);

  useEffect(() => {
    if (tablesResponse?.contractName) {
      setContracts((prevContracts) =>
        prevContracts.map((contract) => ({
          ...contract,
          tables:
            contract.name === tablesResponse.contractName ? tablesResponse.tables : contract.tables,
        }))
      );
      setActiveContract(
        (prevActiveContract) =>
          prevActiveContract && {
            ...prevActiveContract,
            tables: tablesResponse.tables,
          }
      );
    }
  }, [tablesResponse]);

  useEffect(() => {
    setActiveTable(null);
  }, [activeContract?.name]);

  return {
    loading: tablesLoading,
    contracts,
    activeContract,
    setActiveContract,
    activeTable,
    setActiveTable,
    reverse,
    onReverse,
    onRefresh,
  };
};
