import React from 'react';
import CalendarFilter from '../../components/CalendarFilter';
import DefaultPageLayout from '../../components/DefaultPageLayout';

const Test: React.FC = () => {
  const startDate = new Date();
  const endDate = new Date();

  return (
    <DefaultPageLayout>
      <div>
        <CalendarFilter
          startDateIso={startDate.toISOString()}
          endDateIso={endDate.toISOString()}
        />
      </div>
    </DefaultPageLayout>
  );
};

export default Test;
