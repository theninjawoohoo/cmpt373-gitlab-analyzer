import Container from '@material-ui/core/Container';
import React from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';
import Form from './components/Form';

const ScoringConfigPage: React.FC = () => {
  return (
    <DefaultPageLayout>
      <Container>
        <DefaultPageTitleFormat>Scoring Config</DefaultPageTitleFormat>
        <Form />
      </Container>
    </DefaultPageLayout>
  );
};

export default ScoringConfigPage;
