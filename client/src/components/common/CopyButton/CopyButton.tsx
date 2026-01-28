import { FC, useState } from 'react';
import { Button, ButtonProps } from 'react-bootstrap';
import { Copy } from 'react-bootstrap-icons';

import { copyToClipboard } from 'src/utils/general';

import { AnyObject } from '@shared/types/general';


interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  data: AnyObject;
  feedbackDuration?: number;
  successText?: string;
  errorText?: string;
  defaultText?: string;
  showCopyIcon?: boolean;
}

export const CopyButton: FC<CopyButtonProps> = ({
  data,
  feedbackDuration = 2000,
  successText = 'Copied!',
  errorText = 'Failed to copy',
  defaultText = 'Copy to Clipboard',
  showCopyIcon,
  ...buttonProps
}) => {
  const [feedback, setFeedback] = useState('');

  const handleCopy = async (): Promise<void> => {
    const success = await copyToClipboard(data);

    if (success) {
      setFeedback(successText);
    } else {
      setFeedback(errorText);
    }

    // Reset feedback after specified duration
    setTimeout(() => setFeedback(''), feedbackDuration);
  };

  return (
    <Button onClick={handleCopy} {...buttonProps}>
      {showCopyIcon ? <Copy size={16} /> : feedback || defaultText}
    </Button>
  );
};
