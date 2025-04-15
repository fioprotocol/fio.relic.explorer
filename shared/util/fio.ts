import { FIO_ADDRESS_DELIMITER } from '@shared/constants/fio';

export const isDomain = (fioName: string): boolean => fioName.indexOf(FIO_ADDRESS_DELIMITER) < 0;
