export type LinkItem = {
  name: string;
  url: string;
  logo: string;
};

export type BlockProducerProps = {
  account: string;
  fioHandle: string;
  votes: string;
  links: LinkItem[];
  flagIconUrl: string;
  grade: string;
  name: string;
  logo: string;
  ranks: number;
};
