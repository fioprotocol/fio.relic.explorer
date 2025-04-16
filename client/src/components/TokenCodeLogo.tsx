import { FC } from 'react';

import { ReactComponent as ADA_ADA } from 'src/assets/icons/token-codes/ADA-ADA.svg';
import { ReactComponent as BSC_BNB } from 'src/assets/icons/token-codes/BSC-BNB.svg';
import { ReactComponent as BSC_BUSD } from 'src/assets/icons/token-codes/BSC-BUSD.svg';
import { ReactComponent as BTC_BTC } from 'src/assets/icons/token-codes/BTC-BTC.svg';
import { ReactComponent as DOGE_DOGE } from 'src/assets/icons/token-codes/DOGE-DOGE.svg';
import { ReactComponent as DOT_DOT } from 'src/assets/icons/token-codes/DOT-DOT.svg';
import { ReactComponent as ETH_ETH } from 'src/assets/icons/token-codes/ETH-ETH.svg';
import { ReactComponent as ETH_USDC } from 'src/assets/icons/token-codes/ETH-USDC.svg';
import { ReactComponent as ETH_USDT } from 'src/assets/icons/token-codes/ETH-USDT.svg';
import { ReactComponent as FIO_FIO } from 'src/assets/icons/token-codes/FIO-FIO.svg';
import { ReactComponent as LTC_LTC } from 'src/assets/icons/token-codes/LTC-LTC.svg';
import { ReactComponent as MATIC_MATIC } from 'src/assets/icons/token-codes/MATIC-MATIC.svg';
import { ReactComponent as SOL_SOL } from 'src/assets/icons/token-codes/SOL-SOL.svg';
import { ReactComponent as TRX_TRX } from 'src/assets/icons/token-codes/TRX-TRX.svg';
import { ReactComponent as XRP_XRP } from 'src/assets/icons/token-codes/XRP-XRP.svg';

import { TOKEN_CODE_MAP } from 'src/constants/token-codes';

const TOKEN_CODE_LOGO_MAP = {
  [`${TOKEN_CODE_MAP.ADA_ADA.chain_code}_${TOKEN_CODE_MAP.ADA_ADA.token_code}`]: ADA_ADA,
  [`${TOKEN_CODE_MAP.BSC_BNB.chain_code}_${TOKEN_CODE_MAP.BSC_BNB.token_code}`]: BSC_BNB,
  [`${TOKEN_CODE_MAP.BSC_BUSD.chain_code}_${TOKEN_CODE_MAP.BSC_BUSD.token_code}`]: BSC_BUSD,
  [`${TOKEN_CODE_MAP.BTC_BTC.chain_code}_${TOKEN_CODE_MAP.BTC_BTC.token_code}`]: BTC_BTC,
  [`${TOKEN_CODE_MAP.DOGE_DOGE.chain_code}_${TOKEN_CODE_MAP.DOGE_DOGE.token_code}`]: DOGE_DOGE,
  [`${TOKEN_CODE_MAP.DOT_DOT.chain_code}_${TOKEN_CODE_MAP.DOT_DOT.token_code}`]: DOT_DOT,
  [`${TOKEN_CODE_MAP.ETH_ETH.chain_code}_${TOKEN_CODE_MAP.ETH_ETH.token_code}`]: ETH_ETH,
  [`${TOKEN_CODE_MAP.ETH_USDC.chain_code}_${TOKEN_CODE_MAP.ETH_USDC.token_code}`]: ETH_USDC,
  [`${TOKEN_CODE_MAP.ETH_USDT.chain_code}_${TOKEN_CODE_MAP.ETH_USDT.token_code}`]: ETH_USDT,
  [`${TOKEN_CODE_MAP.FIO_FIO.chain_code}_${TOKEN_CODE_MAP.FIO_FIO.token_code}`]: FIO_FIO,
  [`${TOKEN_CODE_MAP.LTC_LTC.chain_code}_${TOKEN_CODE_MAP.LTC_LTC.token_code}`]: LTC_LTC,
  [`${TOKEN_CODE_MAP.SOL_SOL.chain_code}_${TOKEN_CODE_MAP.SOL_SOL.token_code}`]: SOL_SOL,
  [`${TOKEN_CODE_MAP.TRX_TRX.chain_code}_${TOKEN_CODE_MAP.TRX_TRX.token_code}`]: TRX_TRX,
  [`${TOKEN_CODE_MAP.XRP_XRP.chain_code}_${TOKEN_CODE_MAP.XRP_XRP.token_code}`]: XRP_XRP,
  other: MATIC_MATIC,
};

export const TokenCodeLogo: FC<{ chainCode: string; tokenCode: string }> = ({
  chainCode,
  tokenCode,
}) => {
  const key = tokenCode === '*' ? `${chainCode}_${chainCode}` : `${chainCode}_${tokenCode}`;
  const Logo = TOKEN_CODE_LOGO_MAP[key] || TOKEN_CODE_LOGO_MAP.other;

  return <Logo width={34} height={34} />;
};
