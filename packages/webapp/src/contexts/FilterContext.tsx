import React, { useContext, useEffect, useState } from 'react';
import { DateTime } from 'luxon';

interface FilterContextState {
  startDate: string;
  endDate: string;
  author: string;
  emails: string[];
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  setAuthor: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string[]>>;
}

const START_DATE_LOCAL_STORAGE_KEY = 'start_date_context';
const END_DATE_LOCAL_STORAGE_KEY = 'end_date_context';
const AUTHOR_LOCAL_STORAGE_KEY = 'author_context';
const EMAIL_LOCAL_STORAGE_KEY = 'emails_context';

const FilterContextDefault: FilterContextState = {
  startDate: DateTime.now().minus({ days: 7 }).toISO(),
  endDate: DateTime.now().toISO(),
  author: '',
  emails: [''],
  setStartDate: () => null,
  setEndDate: () => null,
  setEmail: () => null,
  setAuthor: () => null,
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
  const [startDate, setStartDate] = useState<string>(
    localStorage.getItem(START_DATE_LOCAL_STORAGE_KEY),
  );
  const [endDate, setEndDate] = useState<string>(
    localStorage.getItem(END_DATE_LOCAL_STORAGE_KEY),
  );
  const [author, setAuthor] = useState<string>(
    localStorage.getItem(AUTHOR_LOCAL_STORAGE_KEY),
  );
  const [emails, setEmail] = useState<string[]>(
    JSON.parse(localStorage.getItem(EMAIL_LOCAL_STORAGE_KEY)),
  );
  return {
    startDate,
    endDate,
    author,
    emails,
    setStartDate,
    setEndDate,
    setAuthor,
    setEmail,
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
    localStorage.setItem(EMAIL_LOCAL_STORAGE_KEY, JSON.stringify(value.emails));
  }, [value.emails]);
  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export function resetFilterStorage() {
  localStorage.setItem(
    START_DATE_LOCAL_STORAGE_KEY,
    DateTime.now().minus({ days: 7 }).toISO(),
  );
  localStorage.setItem(END_DATE_LOCAL_STORAGE_KEY, DateTime.now().toISO());
  localStorage.setItem(AUTHOR_LOCAL_STORAGE_KEY, 'all');
}
