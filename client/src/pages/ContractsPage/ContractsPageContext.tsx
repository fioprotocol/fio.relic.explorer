import { useState, useEffect, useCallback } from 'react';

import { useGetData } from 'src/hooks/useGetData';
import { getContractTables, getContractScopeInfo } from 'src/services/fio';

import { FIO_CONTRACTS_MAP } from '@shared/constants/fio';

import {
  ContractItemType,
  ContractScopeResponse,
  ContractTable,
  ContractTablesResponse,
} from '@shared/types/fio-api-server';

export type UseContractsPageContextType = {
  loading: boolean;
  scopeLoading: boolean;
  contracts: ContractItemType[];
  scopes: string[];
  activeContract: ContractItemType | null;
  setActiveContract: (contract: ContractItemType) => void;
  activeTable: ContractTable | null;
  setActiveTable: (table: ContractTable) => void;
  activeScope: string | null;
  setActiveScope: (scope: string) => void;
  reverse: boolean;
  onReverse: () => void;
  onRefresh: () => void;
};

const CONTRACTS_LIST = Object.values(FIO_CONTRACTS_MAP)
  .filter(
    (contract) =>
      ![
        FIO_CONTRACTS_MAP['fio.msig'],
        FIO_CONTRACTS_MAP['eosio.token'],
        FIO_CONTRACTS_MAP['fio.whitelst'],
      ].includes(contract)
  )
  .map((contract) => ({
    name: contract,
    tables: [],
  }));

export const useContractsPageContext = (): UseContractsPageContextType => {
  const [activeContract, setActiveContract] = useState<ContractItemType | null>(null);
  const [activeTable, setActiveTable] = useState<ContractTable | null>(null);
  const [activeScope, setActiveScope] = useState<string | null>(null);
  const [reverse, setReverse] = useState<boolean>(false);
  const [contracts, setContracts] = useState<ContractItemType[]>(CONTRACTS_LIST);

  const { response: tablesResponse, loading: tablesLoading } = useGetData<ContractTablesResponse>({
    action: getContractTables,
    params: { contractName: !activeContract?.tables.length ? activeContract?.name : null },
  });
  const { response: scopeResponse, loading: scopeLoading } = useGetData<ContractScopeResponse>({
    action: getContractScopeInfo,
    params: { contractName: activeContract?.name, tableName: activeTable?.name },
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
    setActiveScope(null);
  }, [activeContract?.name]);

  useEffect(() => {
    if (activeContract?.name) {
      setActiveScope(scopeResponse?.scopes[0] || activeContract?.name);
    }
  }, [scopeResponse?.scopes, activeContract?.name]);

  return {
    loading: tablesLoading,
    scopeLoading,
    contracts,
    activeContract,
    setActiveContract,
    scopes: scopeResponse?.scopes || [],
    activeTable,
    setActiveTable,
    activeScope,
    setActiveScope,
    reverse,
    onReverse,
    onRefresh,
  };
};
