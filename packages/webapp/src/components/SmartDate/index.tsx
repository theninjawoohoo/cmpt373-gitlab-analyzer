import React from 'react';
import { DateTime } from 'luxon';

const currentYear = DateTime.now().year;

interface SmartDateProps {
  includeTime?: boolean;
  children: string;
}

const SmartDate: React.FC<SmartDateProps> = ({ children, includeTime }) => {
  const date = DateTime.fromISO(children);
  let format = 'LLL dd yyyy' + (includeTime ? ', hh:mm a' : '');
  if (date.year === currentYear) {
    format = 'LLL dd' + (includeTime ? ', hh:mm a' : '');
  }
  return <>{date.toFormat(format)}</>;
};

SmartDate.defaultProps = {
  includeTime: true,
};

export default SmartDate;
