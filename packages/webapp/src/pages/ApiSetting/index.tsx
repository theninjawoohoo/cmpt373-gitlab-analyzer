import React from 'react';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import SettingsForm from '../../components/SettingsForm';

const ApiSettingPage: React.FC = () => {
  return (
    <div>
      <DefaultPageLayout>
        <SettingsForm />
      </DefaultPageLayout>
    </div>
  );
};

export default ApiSettingPage;
