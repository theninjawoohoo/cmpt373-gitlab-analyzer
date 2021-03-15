import { Container } from '@material-ui/core';
import { parse } from 'querystring';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useGetDiffs } from '../../api/diff';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import DiffView from '../../components/DiffView';

const Diff: React.FC = () => {
  const location = useLocation();
  const query = parse(location.search.replace(/^\?/, ''));
  const { data } = useGetDiffs(
    {
      commit: query.commit as string,
      merge_request: query.merge_request as string,
    },
    0,
    50,
  );
  const expandAllAccordions = () => {
    // get all accordions, set defaultExpanded to true
  };
  return (
    <DefaultPageLayout>
      <Container>
        <h1>Commit Diffs</h1>
        <button onClick={expandAllAccordions}>Toggle All</button>
        {data?.results.map((diff) => (
          <DiffView
            key={diff.meta.id}
            fileName={diff.new_path}
            lines={diff.lines}
          />
        ))}
      </Container>
    </DefaultPageLayout>
  );
};

export default Diff;
