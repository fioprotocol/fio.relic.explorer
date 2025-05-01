import { AnyObject } from '@shared/types/general';
import { truncateLongText } from 'src/utils/general';
import { formatFioAmount } from 'src/utils/fio';

export interface ActionInfo {
  description: string;
  details?: string;
  formatDetails?: (data: AnyObject) => string;
}

export interface FeeRatio {
  end_point: string;
  value: number;
}

export const ACTION_NAMES: Record<string, ActionInfo> = {
  regproducer: {
    description: 'Register Block Producer',
    details: 'fio_address',
  },
  unregprod: {
    description: 'Unregister Block Producer',
    details: 'fio_address',
  },
  setfeevote: {
    description: 'Submit Fee Ratios',
  },
  setfeemult: {
    description: 'Submit Fee Multiplier',
    details: 'multiplier',
  },
  computefees: {
    description: 'Compute Fees',
  },
  bundlevote: {
    description: 'Submit Bundled Count',
  },
  bpclaim: {
    description: 'Claim BP Reward',
    details: 'fio_address',
  },
  tpidclaim: {
    description: 'Pay TPID Rewards',
  },
  burnexpired: {
    description: 'Burn Expired Domains',
  },
  burnnfts: {
    description: 'Burn NFT Signatures',
  },
  voteproducer: {
    description: 'Vote on Block Producers',
    details: 'fio_address',
  },
  voteproxy: {
    description: 'Proxy Vote',
    details: 'proxy',
  },
  regproxy: {
    description: 'Register Proxy',
    details: 'fio_address',
  },
  unregproxy: {
    description: 'Unregister Proxy',
    details: 'fio_address',
  },
  newfioacc: {
    description: 'New FIO Chain Account',
    details: 'fio_public_key',
    formatDetails: (data: AnyObject): string => truncateLongText(data?.fio_public_key || ''),
  },
  addperm: {
    description: 'Add Permission',
  },
  remperm: {
    description: 'Remove Permission',
  },
  recordobt: {
    description: 'Record FIO Data',
    formatDetails: (data: AnyObject): string =>
      `From ${data?.payer_fio_address || ''} to ${data?.payee_fio_address || ''}`,
  },
  addaddress: {
    description: 'Map Public Address',
    details: 'fio_address',
  },
  remaddress: {
    description: 'Unmap Public Address',
    details: 'fio_address',
  },
  remalladdr: {
    description: 'Unmap All Public Addresses',
    details: 'fio_address',
  },
  regaddress: {
    description: 'Register FIO Handle',
    details: 'fio_address',
  },
  regdomadd: {
    description: 'Register FIO Handle & Domain',
    details: 'fio_address',
  },
  addbundles: {
    description: 'Add Bundled Transactions',
    details: 'fio_address',
  },
  xferaddress: {
    description: 'Transfer FIO Handle',
    details: 'fio_address',
  },
  renewaddress: {
    description: 'Renew FIO Handle',
    details: 'fio_address',
  },
  burnaddress: {
    description: 'Burn FIO Handle',
    details: 'fio_address',
  },
  regdomain: {
    description: 'Register FIO Domain',
    details: 'fio_domain',
  },
  renewdomain: {
    description: 'Renew FIO Domain',
    details: 'fio_domain',
  },
  xferdomain: {
    description: 'Transfer FIO Domain',
    details: 'fio_domain',
  },
  setdomainpub: {
    description: 'Change Domain Setting',
    formatDetails: (data: AnyObject): string =>
      `${data?.fio_domain} ${data?.is_public ? 'public' : 'private'}`,
  },
  wrapdomain: {
    description: 'Wrap FIO Domain',
    details: 'fio_domain',
  },
  unwrapdomain: {
    description: 'Unwrap FIO Domain',
    details: 'fio_domain',
  },
  newfundsreq: {
    description: 'New FIO Request',
    formatDetails: (data: AnyObject): string =>
      `From ${data?.payee_fio_address || ''} to ${data?.payer_fio_address || ''}`,
  },
  cancelfndreq: {
    description: 'Cancel FIO Request',
  },
  updcryptkey: {
    description: 'Update Encryption Key',
    details: 'fio_address',
  },
  trnsfiopubky: {
    description: 'Transfer FIO Tokens',
    formatDetails: (data: AnyObject): string => `${formatFioAmount({ amount: data?.amount })} to ${truncateLongText(data?.payee_public_key || '')}`,
  },
  trnsloctoks: {
    description: 'Transfer and lock FIO Tokens',
    formatDetails: (data: AnyObject): string =>
      `${formatFioAmount({ amount: data?.amount })} to ${truncateLongText(data?.payee_public_key || '')}`,
  },
  stakefio: {
    description: 'Stake FIO Tokens',
    formatDetails: (data: AnyObject): string => `${formatFioAmount({ amount: data?.amount })}`,
  },
  unstakefio: {
    description: 'Unstake FIO Tokens',
    formatDetails: (data: AnyObject): string => `${formatFioAmount({ amount: data?.amount })}`,
  },
  wraptokens: {
    description: 'Wrap FIO Tokens',
    formatDetails: (data: AnyObject): string => `${formatFioAmount({ amount: data?.amount })} to ${data?.chain_code || ''}`,
  },
  retire: {
    description: 'Burn FIO Tokens',
    formatDetails: (data: AnyObject): string => `${formatFioAmount({ amount: data?.quantity })}`,
  },
  addnft: {
    description: 'Sign NFTs',
    details: 'fio_address',
  },
  remnft: {
    description: 'Remove NFT Signatures',
    details: 'fio_address',
  },
  remallnfts: {
    description: 'Remove All NFT Signatures',
    details: 'fio_address',
  },
};
