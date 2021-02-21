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
  return (
    <DefaultPageLayout>
      <Container>
        {data?.results.map((diff) => (
          <DiffView
            key={diff.meta.id}
            fileName={diff.new_path}
            hunks={diff.hunks}
          />
        ))}
      </Container>
    </DefaultPageLayout>
  );
};

export default Diff;