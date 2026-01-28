import { FC } from 'react';

type LocationFlagProps = {
  flagIconUrl?: string;
  name: string;
};

export const LocationFlag: FC<LocationFlagProps> = ({ flagIconUrl, name }) => {
  if (!flagIconUrl) return null;

  return (
    <div className="text-center">
      <img 
        src={flagIconUrl} 
        alt={name} 
        className="icon-h-24"
      />
    </div>
  );
};
