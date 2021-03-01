import React from 'react';
import CalendarFilter from '../../components/CalendarFilter';
import DefaultPageLayout from '../../components/DefaultPageLayout';

const Test: React.FC = () => {
  return (
    <DefaultPageLayout>
      <div>
        <CalendarFilter />
      </div>
    </DefaultPageLayout>
  );
};

export default Test;
