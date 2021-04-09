import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';
import Icon from '../NavBar/iconHelper';
import UndecoratedLink from '../UndecoratedLink';

interface LinkCardProps {
  color?: string;
  icon?: string;
  to?: string;
}

const Root = styled(UndecoratedLink)<{ color: string }>`
  align-items: center;
  justify-content: center;
  min-height: 8rem;
  display: flex;
  background: ${(p) => p.color};
  border-radius: 5px;
`;

const LinkCard: React.FC<LinkCardProps> = ({ to, color, icon, children }) => {
  return (
    <Root to={to} color={color}>
      <Box display='flex' alignItems='center' flexDirection='column'>
        <Icon icon={icon} size='large' />
        <Typography variant='h3'>{children}</Typography>
      </Box>
    </Root>
  );
};

export default LinkCard;
