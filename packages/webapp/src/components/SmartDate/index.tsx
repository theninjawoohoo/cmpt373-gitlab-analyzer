import React from 'react';
import { DateTime } from 'luxon';

const currentYear = DateTime.now().year;

interface SmartDateProps {
  children: string;
}

const SmartDate: React.FC<SmartDateProps> = ({ children }) => {
  const date = DateTime.fromISO(children);
  let format = 'LLL dd, yyyy, h:mm a';
  if (date.year === currentYear) {
    format = 'LLL dd, h:mm a';
  }
  return <>{date.toFormat(format)}</>;
};

export default SmartDate;
