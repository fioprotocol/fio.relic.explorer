import axios from 'axios';
import BigNumber from 'big.js';

const ROE_API_URL = 'https://ascendex.com/api/pro/v1';

type ROEResponse = {
  code: number;
  data: {
    m: string;
    symbol: string;
    data: {
      p: string;
      q: string;
      ts: number;
      bm: boolean;
      seqnum: number;
    }[];
  };
};

export const getROE = async (): Promise<string> => {
  try {
    const { data } = await axios.get<ROEResponse>(`${ROE_API_URL}/trades?symbol=FIO/USDT`);

    const trades = data?.data?.data || [];

    const sum = trades.reduce(
      (acc, tradeItem) => new BigNumber(acc).add(tradeItem.p),
      new BigNumber('0')
    );

    const avgPrice = sum.div(trades.length || 1).toFixed(4);

    return avgPrice;
  } catch (error) {
    console.error('Error fetching ROE data:', error);
    throw new Error('Failed to fetch ROE data');
  }
}; 
