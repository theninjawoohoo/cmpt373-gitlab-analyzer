import Chip, { ChipProps } from '@material-ui/core/Chip';
import React from 'react';
import styled from 'styled-components';

interface ScoringChipProps {
  children: ChipProps['label'];
  hasOverride?: boolean;
  size?: ChipProps['size'];
}

const StyledChip = styled(Chip)<{ hasOverride?: boolean }>`
  background: ${(p) => (p.hasOverride ? 'orange' : 'transparent')};
`;

const ScoringChip: React.FC<ScoringChipProps> = ({
  size,
  children,
  hasOverride,
}) => {
  return <StyledChip size={size} label={children} hasOverride={hasOverride} />;
};

ScoringChip.defaultProps = {
  size: 'medium',
};

export default ScoringChip;
