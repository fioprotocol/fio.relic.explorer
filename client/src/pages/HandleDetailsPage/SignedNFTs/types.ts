export type NftItem = {
  contractAddress: string;
  creatorUrl?: string;
  hasMultipleSignatures: boolean;
  hash?: string;
  imageUrl: string;
  externalProviderMetadata?: {
    description?: (string | string[])[];
    externalUrl?: string;
    imageSrc?: string;
    name?: string;
  };
  isAlteredImage?: boolean;
  isImage?: boolean;
  tokenId: string;
  viewNftLink?: string;
};
