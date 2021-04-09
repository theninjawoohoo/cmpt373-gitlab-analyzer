import Typography from '@material-ui/core/Typography';
import React from 'react';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import styled from 'styled-components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface AccordionMenuProps {
  title: string;
  color: string;
}

const Accordion = styled(MuiAccordion)<{ color: string }>`
  min-height: 4rem;
  border: 3px solid;
  border-color: ${(p) => p.color};
  border-radius: 5px;
`;

const AccordionSummary = styled(MuiAccordionSummary)<{ color: string }>`
  min-height: 4rem;
  background: ${(p) => p.color};
`;

const AccordionDetails = styled(MuiAccordionDetails)`
  min-height: 5rem;
`;

const AccordionMenu: React.FC<AccordionMenuProps> = ({
  title,
  color,
  children,
}) => {
  return (
    <div>
      <Accordion color={color}>
        <AccordionSummary color={color} expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h3'>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
};

export default AccordionMenu;
