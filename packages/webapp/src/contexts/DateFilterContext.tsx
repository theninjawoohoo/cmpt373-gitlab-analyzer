import React, { useContext, useState } from 'react';
import { DateTime } from 'luxon';

interface DateFilterContextState {
  startDate: string;
  endDate: string;
  elements: any;
  setStartDateContext: React.Dispatch<React.SetStateAction<string>>;
  setEndDateContext: React.Dispatch<React.SetStateAction<string>>;
  setArrayContext: React.Dispatch<React.SetStateAction<any>>;
}

const DateFilterContextDefault: DateFilterContextState = {
  startDate: DateTime.now().minus({ days: 7 }).toISO(),
  endDate: DateTime.now().toISO(),
  elements: [],
  setStartDateContext: () => null,
  setEndDateContext: () => null,
  setArrayContext: () => null,
};

const DateFilterContext = React.createContext<DateFilterContextState>(
  DateFilterContextDefault,
);

export function useDateFilterContext() {
  return useContext(DateFilterContext);
}

function useDateFilterState(): DateFilterContextState {
  const [startDate, setStartDateContext] = useState<string>(
    DateTime.now().minus({ days: 7 }).toISO(),
  );
  const [endDate, setEndDateContext] = useState<string>(DateTime.now().toISO());
  const [elements, setArrayContext] = useState<any>([]);
  return {
    startDate,
    endDate,
    elements,
    setStartDateContext,
    setEndDateContext,
    setArrayContext,
  };
}

export const DateFilterContextProvider: React.FC = ({ children }) => {
  const value = useDateFilterState();
  return (
    <DateFilterContext.Provider value={value}>
      {children}
    </DateFilterContext.Provider>
  );
};
