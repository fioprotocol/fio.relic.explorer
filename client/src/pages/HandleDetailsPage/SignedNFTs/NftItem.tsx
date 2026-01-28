import { FC, useCallback, useEffect, useState } from 'react';

import NO_IMAGE_ICON_SRC from 'src/assets/no-photo.svg';
import MULTIPLE_SIGNATURE_ICON_SRC from 'src/assets/multiple-signature.svg';

import { Loader } from 'src/components/common/Loader';
import { NftImg } from './NftImg';

import { getNftMetadata, getUrlContent } from 'src/services/fio';

import { loadImage } from 'src/utils/image';

import {
  NETWORK_CHAIN_ID_MAP,
  INFURA_HOST_URL,
  INFURA_IFPS_LINK,
  REWRITE_INFURA_HOST_URL,
} from './constants';

import { NftItem as NftItemType } from './types';
import { HandleNFT } from '@shared/types/handles';

import styles from './SignedNFTs.module.scss';

const convertDescriptionToArray = (inputString: string): (string | string[])[] => {
  if (!inputString) return [];

  const result: (string | string[])[] = [];
  const segments = inputString.split(/\.(?=\s|[A-Z]|[^\w\s])/);

  for (const segment of segments) {
    if (segment.includes(':')) {
      const [key, values] = segment.split(':');
      const valueArray = values.split(',').map((item) => item.trim());
      const nestedArray = [key.trim(), ...valueArray];
      result.push(nestedArray);
    } else {
      const trimmedSegment = segment.trim();
      if (trimmedSegment) {
        result.push(trimmedSegment);
      }
    }
  }

  return result;
};

export const NftItem: FC<{ nft: HandleNFT; onClick: (nft: NftItemType) => void }> = ({
  nft,
  onClick,
}) => {
  const [nftItem, setNftItem] = useState<NftItemType | null>(null);

  const prepareNftItem = useCallback(async () => {
    if (!nft?.token_id) return;

    const nftItemObj: NftItemType = {
      contractAddress: nft?.contract_address,
      hasMultipleSignatures: nft?.token_id === '*',
      imageUrl: '',
      tokenId: nft?.token_id,
    };

    if (nft?.hash) {
      nftItemObj.hash = nft?.hash;
    }

    const creatorUrl = ((): string => {
      try {
        return JSON.parse(nft?.metadata || '').creator_url;
      } catch (err) {
        return '';
      }
    })();

    if (creatorUrl) {
      nftItemObj.creatorUrl = creatorUrl;
    }

    if (NETWORK_CHAIN_ID_MAP[nft?.chain_code] && !nftItemObj.hasMultipleSignatures) {
      try {
        const fioNftMetadata = await getNftMetadata({
          chainName: nft?.chain_code,
          tokenAddress: nft?.contract_address,
          tokenId: nft?.token_id,
        });

        if (fioNftMetadata) {
          const { normalized_metadata, metadata, token_uri: nftTokenUrl } = fioNftMetadata;

          let nftDescription = null,
            nftExternalUrl = null,
            nftImage = null,
            nftName = null;

          const {
            description: normalizedNftDescription,
            external_link: normalizedNftExternalUrl,
            image: normalizedNftImage,
            name: normalizedNftName,
          } = normalized_metadata || {};

          if (metadata && typeof metadata === 'string') {
            const metadataParsed = JSON.parse(metadata);
            const { description, external_link, image, name } = metadataParsed || {};
            nftDescription = description;
            nftExternalUrl = external_link;
            nftImage = image;
            nftName = name;
          }

          const description = normalizedNftDescription || nftDescription || '';
          const externalUrl = normalizedNftExternalUrl || nftExternalUrl || nftTokenUrl || '';
          const image = normalizedNftImage || nftImage || '';
          const name = normalizedNftName || nftName || '';

          nftItemObj.externalProviderMetadata = {
            description: description ? convertDescriptionToArray(description) : undefined,
            externalUrl,
            imageSrc: image
              .replace(INFURA_IFPS_LINK, `https://${REWRITE_INFURA_HOST_URL}/ipfs/`)
              .replace(INFURA_HOST_URL, REWRITE_INFURA_HOST_URL),
            name,
          };
        }
      } catch (error) {
        //
      }
    }

    let fetchedImageFileString = null;

    const fioImageUrl = await loadImage(nft?.url);
    const externalProviderImageUrl = await loadImage(nftItemObj.externalProviderMetadata?.imageSrc);
    const externalProviderLink = await loadImage(nftItemObj.externalProviderMetadata?.externalUrl);

    if (!fioImageUrl && !externalProviderImageUrl && !externalProviderLink) {
      try {
        const contentUrl =
          nft?.url ||
          nftItemObj.externalProviderMetadata?.imageSrc ||
          nftItemObj.externalProviderMetadata?.externalUrl ||
          null;
        if (contentUrl !== null) {
          const imageContentRes = await getUrlContent(contentUrl);
          const tempContainer = document.createElement('div');
          tempContainer.innerHTML = imageContentRes || '';

          const firstImageElement = tempContainer.querySelector('img');
          const firstSvgElement = tempContainer.querySelector('svg');

          if (firstSvgElement) {
            fetchedImageFileString = `data:image/svg+xml,${encodeURIComponent(
              firstSvgElement.outerHTML
            )}`;
          } else if (firstImageElement) {
            fetchedImageFileString = firstImageElement.getAttribute('src');
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    const viewNftLink = fioImageUrl || externalProviderImageUrl || externalProviderLink;

    if (viewNftLink) {
      nftItemObj.viewNftLink = viewNftLink;
    }

    nftItemObj.imageUrl = nftItemObj.hasMultipleSignatures
      ? MULTIPLE_SIGNATURE_ICON_SRC
      : fioImageUrl ||
        externalProviderImageUrl ||
        externalProviderLink ||
        fetchedImageFileString ||
        NO_IMAGE_ICON_SRC;

    nftItemObj.isImage =
      !!fioImageUrl ||
      !!externalProviderImageUrl ||
      !!externalProviderLink ||
      !!fetchedImageFileString;

    setNftItem(nftItemObj);
  }, [nft?.contract_address, nft?.chain_code, nft?.token_id, nft?.hash, nft?.metadata, nft?.url]);

  useEffect(() => {
    prepareNftItem();
  }, [prepareNftItem]);

  if (!nftItem) {
    return (
      <div className={`cursor-pointer opacity-75-hover w-100 ${styles.nftItem}`}>
        <Loader />
      </div>
    );
  }

  return (
    <div onClick={(): void => onClick(nftItem)} className={`cursor-pointer opacity-75-hover w-100 ${styles.nftItem}`}>
      <NftImg nftItem={nftItem} />
    </div>
  );
};
