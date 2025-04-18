import { FIO_ADDRESS_DELIMITER } from '@shared/constants/fio';

export const isDomain = (fioName: string): boolean => fioName.indexOf(FIO_ADDRESS_DELIMITER) < 0;

export const validateHandleRegex =
  '^(?=.{3,64}$)[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?@[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?$';
