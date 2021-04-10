import React from 'react';
import CommentList from '../../components/CommentList';
import DefaultPageLayout from '../../components/DefaultPageLayout';

const CommentPage: React.FC = () => {
  return (
    <DefaultPageLayout>
      <div>
        <CommentList />
      </div>
    </DefaultPageLayout>
  );
};

export default CommentPage;
