import React from 'react';
import CommentList from '../../components/CommentList';
import ScrollToTop from '../../components/Common/ScrollToTop';
import DefaultPageLayout from '../../components/DefaultPageLayout';

const CommentPage: React.FC = () => {
  return (
    <DefaultPageLayout>
      <div>
        <ScrollToTop />
        <CommentList />
      </div>
    </DefaultPageLayout>
  );
};

export default CommentPage;
