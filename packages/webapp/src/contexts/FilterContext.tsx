import React, { useContext, useEffect, useState } from 'react';
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

const START_DATE_LOCAL_STORAGE_KEY = 'start_date_context';
const END_DATE_LOCAL_STORAGE_KEY = 'end_date_context';
const AUTHOR_LOCAL_STORAGE_KEY = 'author_context';
const ELEMENTS_LOCAL_STORAGE_KEY = 'elements_context';

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
  const startDateValue = localStorage.getItem(START_DATE_LOCAL_STORAGE_KEY);
  if (!startDateValue) {
    localStorage.setItem(
      START_DATE_LOCAL_STORAGE_KEY,
      DateTime.now().minus({ days: 7 }).toISO(),
    );
  }
  const endDateValue = localStorage.getItem(END_DATE_LOCAL_STORAGE_KEY);
  if (!endDateValue) {
    localStorage.setItem(END_DATE_LOCAL_STORAGE_KEY, DateTime.now().toISO());
  }
  const authorValue = localStorage.getItem(AUTHOR_LOCAL_STORAGE_KEY);
  if (!authorValue) {
    localStorage.setItem(AUTHOR_LOCAL_STORAGE_KEY, 'all');
  }
  const elementsValue = localStorage.getItem(AUTHOR_LOCAL_STORAGE_KEY);
  if (!elementsValue) {
    localStorage.setItem(ELEMENTS_LOCAL_STORAGE_KEY, null);
  }
  const [startDate, setStartDateContext] = useState<string>(
    localStorage.getItem(START_DATE_LOCAL_STORAGE_KEY),
  );
  const [endDate, setEndDateContext] = useState<string>(
    localStorage.getItem(END_DATE_LOCAL_STORAGE_KEY),
  );
  const [author, setAuthorContext] = useState<string>(
    localStorage.getItem(AUTHOR_LOCAL_STORAGE_KEY),
  );
  const [elements, setArrayContext] = useState<any>(
    localStorage.getItem(ELEMENTS_LOCAL_STORAGE_KEY),
  );
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
  useEffect(() => {
    localStorage.setItem(START_DATE_LOCAL_STORAGE_KEY, value.startDate);
  }, [value.startDate]);
  useEffect(() => {
    localStorage.setItem(END_DATE_LOCAL_STORAGE_KEY, value.endDate);
  }, [value.endDate]);
  useEffect(() => {
    localStorage.setItem(AUTHOR_LOCAL_STORAGE_KEY, value.author);
  }, [value.author]);
  useEffect(() => {
    localStorage.setItem(ELEMENTS_LOCAL_STORAGE_KEY, value.elements);
  }, [value.elements]);
  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
