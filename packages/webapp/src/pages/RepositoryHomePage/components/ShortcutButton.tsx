import { Button } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import React from 'react';

interface ShortcutButtonProps {
  link?: string;
}

const ShortcutButton: React.FC<ShortcutButtonProps> = ({ link, children }) => {
  return (
    <Button
      variant='text'
      color='inherit'
      endIcon={<ArrowForwardIosIcon />}
      href={link}
    >
      {children}
    </Button>
  );
};

export default ShortcutButton;
