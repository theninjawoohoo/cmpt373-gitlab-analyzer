import React from 'react';
import Form from './components/Form';
import GroupLayout from './components/GroupLayout';
import { useHistory, useLocation } from 'react-router-dom';
import { parse } from 'querystring';
import { GroupConfig } from '@ceres/types';
import {
  useCreateGroupConfig,
  useGetGroupConfig,
  useUpdateGroupConfig,
} from '../../api/groupConfig';

interface PreloadedFormProps {
  id: string;
}

const PreloadedForm: React.FC<PreloadedFormProps> = ({ id }) => {
  const { data, invalidate } = useGetGroupConfig(id);
  const { mutate: updateGroupConfig } = useUpdateGroupConfig(id);
  const { push } = useHistory();

  const onSubmit = (values: GroupConfig) => {
    updateGroupConfig(values, {
      onSuccess: () => {
        void invalidate();
        push('/settings/calendar');
      },
    });
  };
  if (data) {
    return <Form onSubmit={onSubmit} defaultValues={data} />;
  }
  return <div>Loading...</div>;
};

const EditGroupConfigPage: React.FC = () => {
  const { mutate: createScoringConfig } = useCreateGroupConfig();
  const { push } = useHistory();
  const location = useLocation();
  const query = parse(location.search.replace(/^\?/, ''));

  const onSubmit = (values: GroupConfig) => {
    createScoringConfig(values, {
      onSuccess: () => {
        push('/group');
      },
    });
  };

  return (
    <GroupLayout>
      {query.id ? (
        <PreloadedForm id={query.id as string} />
      ) : (
        <Form onSubmit={onSubmit} />
      )}
    </GroupLayout>
  );
};

export default EditGroupConfigPage;
