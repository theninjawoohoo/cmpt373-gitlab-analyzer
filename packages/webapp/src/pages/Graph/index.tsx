import React from 'react';

import DynamicGraph from '../../components/DynamicGraph';
import DefaultPageLayout from '../../components/DefaultPageLayout';

const Graph: React.FC = () => {
  return (
    <div>
      <DefaultPageLayout>
        <DynamicGraph />
      </DefaultPageLayout>
    </div>
  );
};

export default Graph;
