import React, { useContext, useState } from 'react';
import { DateTime } from 'luxon';

interface FilterContextState {
  startDate: string;
  endDate: string;
  elements: any;
  author: string;
  setStartDateContext: React.Dispatch<React.SetStateAction<string>>;
  setEndDateContext: React.Dispatch<React.SetStateAction<string>>;
  setArrayContext: React.Dispatch<React.SetStateAction<any>>;
  setAuthorContext: React.Dispatch<React.SetStateAction<string>>;
}

const FilterContextDefault: FilterContextState = {
  startDate: DateTime.now().minus({ days: 7 }).toISO(),
  endDate: DateTime.now().toISO(),
  author: '',
  elements: [],
  setStartDateContext: () => null,
  setEndDateContext: () => null,
  setArrayContext: () => null,
  setAuthorContext: () => null,
};

const FilterContext = React.createContext<FilterContextState>(
  FilterContextDefault,
);

export function useFilterContext() {
  return useContext(FilterContext);
}

function useFilterState(): FilterContextState {
  const [startDate, setStartDateContext] = useState<string>(
    DateTime.now().minus({ days: 7 }).toISO(),
  );
  const [endDate, setEndDateContext] = useState<string>(DateTime.now().toISO());
  const [author, setAuthorContext] = useState<string>('all');
  const [elements, setArrayContext] = useState<any>([]);
  return {
    startDate,
    endDate,
    author,
    elements,
    setStartDateContext,
    setEndDateContext,
    setAuthorContext,
    setArrayContext,
  };
}

export const FilterContextProvider: React.FC = ({ children }) => {
  const value = useFilterState();
  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
