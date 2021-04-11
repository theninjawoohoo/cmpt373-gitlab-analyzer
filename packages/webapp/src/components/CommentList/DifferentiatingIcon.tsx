import React from 'react';
import FilterVintageIcon from '@material-ui/icons/FilterVintage';
import EmojiNatureIcon from '@material-ui/icons/EmojiNature';

interface DifferentiatingIconProps {
  isMine: boolean;
}

const DifferentiatingIcon: React.FC<DifferentiatingIconProps> = (
  DifferentiatingIconProps,
) => {
  if (DifferentiatingIconProps.isMine) {
    return (
      <FilterVintageIcon
        style={{
          color: '#f3bfb3',
        }}
      />
    );
  } else {
    return (
      <EmojiNatureIcon
        style={{
          color: '#57838d',
        }}
      />
    );
  }
};

export default DifferentiatingIcon;
