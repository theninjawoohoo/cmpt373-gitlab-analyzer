import { Commit, RepositoryMember } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useRepositoryAuthors } from '../../api/author';
import { ApiResource } from '../../api/base';
import { useRepositoryMembers } from '../../api/repo_members';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import Author from './components/Author';
import DefaultPageTitleFormat from '../../components/DefaultPageTitleFormat';

function findSelectedMember(
  author: ApiResource<Commit.Author>,
  members: ApiResource<RepositoryMember>[],
) {
  return members.find(
    (member) => member.meta.id === author.repository_member_id,
  );
}

const Members: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: members } = useRepositoryMembers(id);
  const { data: authors } = useRepositoryAuthors(id);
  return (
    <DefaultPageLayout>
      <Container>
        <DefaultPageTitleFormat>Members</DefaultPageTitleFormat>
        <Box my={4}>
          {members &&
            authors?.map((author) => {
              const member = findSelectedMember(author, members);
              return (
                <Author
                  key={author.meta.id}
                  author={author}
                  member={member}
                  allMembers={members}
                />
              );
            })}
        </Box>
      </Container>
    </DefaultPageLayout>
  );
};

export default Members;
