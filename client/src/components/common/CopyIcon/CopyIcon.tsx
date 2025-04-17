import { FC, useState } from 'react';
import { Button, ButtonProps, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Copy } from 'react-bootstrap-icons';

import { copyToClipboard } from 'src/utils/general';

import { AnyObject } from '@shared/types/general';

const ANIMATION_DURATION = 300;
interface CopyIconProps extends Omit<ButtonProps, 'onClick'> {
  data: AnyObject;
  feedbackDuration?: number;
  successText?: string;
  errorText?: string;
  defaultText?: string;
  tooltip?: boolean;
  children?: React.ReactNode;
}

export const CopyIcon: FC<CopyIconProps> = ({
  data,
  feedbackDuration = 2000,
  successText = 'Copied!',
  errorText = 'Failed to copy',
  ...buttonProps
}) => {
  const [feedback, setFeedback] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = async (): Promise<void> => {
    setDisabled(true);
    const success = await copyToClipboard(data);

    setShowTooltip(true);
    if (success) {
      setFeedback(successText);
    } else {
      setFeedback(errorText);
    }

    // Reset feedback after specified duration
    setTimeout(() => {
      setShowTooltip(false);
      setTimeout(() => {
        setDisabled(false);
        setFeedback('');
      }, ANIMATION_DURATION);
    }, feedbackDuration);
  };

  return (
    <OverlayTrigger show={showTooltip} placement="top" overlay={<Tooltip>{feedback}</Tooltip>}>
      <Button disabled={disabled} onClick={handleCopy} {...buttonProps}>
        <Copy size={14} />
      </Button>
    </OverlayTrigger>
  );
};
