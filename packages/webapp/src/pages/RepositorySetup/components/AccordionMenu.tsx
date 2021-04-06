import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import styled from 'styled-components';

interface AccordionMenuProps {
  title: string;
  color?: string;
}

const Accordion = styled(MuiAccordion)`
  min-height: 6rem;
  border-radius: 5px;
`;

const AccordionSummary = styled(MuiAccordionSummary)<{ color: string }>`
  min-height: 6rem;
  background: ${(p) => p.color};
`;

const AccordionDetails = styled(MuiAccordionDetails)`
  min-height: 6rem;
`;

const AccordionMenu: React.FC<AccordionMenuProps> = ({
  title,
  color,
  children,
}) => {
  return (
    <Container>
      <Accordion>
        <AccordionSummary color={color}>
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default AccordionMenu;
