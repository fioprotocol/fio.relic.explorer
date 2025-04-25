import { FC } from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import {
  ArrowRepeat,
  ChevronDown,
  ExclamationCircleFill,
  SortUpAlt,
  SortDownAlt,
} from 'react-bootstrap-icons';

import Container from 'src/components/layout/Container';
import { CardComponent } from 'src/components/layout/CardComponent';
import { Loader } from 'src/components/common/Loader';
import { DropdownToggle, DropdownItem } from 'src/components/common/Dropdown';
import ContractsDataTable from './ContractsDataTable/ContractsDataTable';

import { useContractsPageContext } from './ContractsPageContext';

import styles from './ContractsPage.module.scss';

const ContractsPage: FC = () => {
  const {
    loading,
    contracts,
    activeContract,
    setActiveContract,
    activeTable,
    setActiveTable,
    reverse,
    onReverse,
    onRefresh,
  } = useContractsPageContext();

  return (
    <Container title="State Data">
      <CardComponent title="Contract and Contract Tables" className="mb-3 ">
        <div className="d-flex justify-content-between gap-3 mb-3 flex-wrap">
          <div className="d-flex justify-content-start gap-3 flex-grow-1 flex-wrap">
            <Dropdown align="end" className={`d-flex flex-grow-1 ${styles.dropdown}`}>
              <Dropdown.Toggle
                as={DropdownToggle}
                customClassName={`d-flex justify-content-between align-items-center text-dark rounded-2 gap-2 border w-100`}
              >
                <span className="f-size-sm">{activeContract?.name || 'Select Contract'}</span>
                <ChevronDown />
              </Dropdown.Toggle>

              <Dropdown.Menu
                className={`rounded-3 py-2 px-3 border box-shadow-default w-100 ${styles.dropdownList}`}
              >
                {contracts.map((contract) => (
                  <Dropdown.Item
                    key={contract.name}
                    as={DropdownItem}
                    active={contract.name === activeContract?.name}
                    disabled={contract.name === activeContract?.name}
                    onClick={(): void => setActiveContract(contract)}
                  >
                    <span className="f-size-sm text-nowrap">{contract.name}</span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown align="end" className={`d-flex flex-grow-1 ${styles.dropdown}`}>
              <Dropdown.Toggle
                as={DropdownToggle}
                disabled={!activeContract}
                customClassName={`d-flex justify-content-between align-items-center text-dark rounded-2 gap-2 border w-100`}
              >
                <span className="f-size-sm">{activeTable?.name || 'Select Contract Table'}</span>
                <ChevronDown />
              </Dropdown.Toggle>

              <Dropdown.Menu
                className={`rounded-3 py-2 px-3 border box-shadow-default w-100 ${styles.dropdownList}`}
              >
                {activeContract?.tables.map((table) => (
                  <Dropdown.Item
                    key={table.name}
                    as={DropdownItem}
                    active={table.name === activeTable?.name}
                    disabled={table.name === activeTable?.name}
                    onClick={(): void => setActiveTable(table)}
                  >
                    <span className="f-size-sm text-nowrap">{table.name}</span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="d-flex justify-content-end gap-3">
            <Button
              variant="outline-light text-dark border"
              onClick={onReverse}
              disabled={!activeTable}
            >
              {reverse ? (
                <SortUpAlt size={24} className="text-primary" />
              ) : (
                <SortDownAlt size={24} className="text-primary" />
              )}
              <span className="d-none d-md-inline-block ms-2 f-size-sm fw-semibold-inter">
                Reverse Order
              </span>
            </Button>
            <Button variant="primary" onClick={onRefresh} disabled={!activeTable}>
              <ArrowRepeat size={24} />
              <span className="d-none d-md-inline-block ms-2 f-size-sm fw-semibold-inter">
                Refresh
              </span>
            </Button>
          </div>
        </div>
        <div className="">
          {loading && (
            <div className="d-flex justify-content-center align-items-center w-100">
              <Loader absolute fullScreen />
            </div>
          )}
          {(!activeContract || !activeTable) && (
            <div className="d-flex justify-content-center align-items-center w-100">
              <div
                className={`bg-info d-flex flex-column justify-content-center align-items-center rounded-3 p-sm-5 p-3 text-white text-center my-5 ${styles.alert}`}
              >
                <ExclamationCircleFill size={44} className="mb-3" />
                <div className="f-size-sm lh-md fw-normal-proxima">
                  <b className="fw-extrabold-proxima">Select contract and contract table</b> - You
                  must select a contract and contract table to display the results.
                </div>
              </div>
            </div>
          )}

          {activeContract && activeTable && (
            <ContractsDataTable
              activeContract={activeContract}
              activeTable={activeTable}
              reverse={reverse}
            />
          )}
        </div>
      </CardComponent>
    </Container>
  );
};

export default ContractsPage;
