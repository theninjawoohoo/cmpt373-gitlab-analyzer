import React from 'react';
import data from './mock-data.json';
import DiffView from './index';

const AllDiffs: React.FC = () => {
  return (
    <>
      {data.map(({ new_path, hunks }) => (
        <DiffView key={new_path} fileName={new_path} hunks={hunks} />
      ))}
    </>
  );
};

export default AllDiffs;
