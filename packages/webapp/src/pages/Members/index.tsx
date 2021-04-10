import { Commit, RepositoryMember } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import React from 'react';
import { useRepositoryAuthors } from '../../api/author';
import { ApiResource } from '../../api/base';
import { useRepositoryMembers } from '../../api/repo_members';
import Author from './components/Author';

interface MembersProps {
  id: string;
}

function findSelectedMember(
  author: ApiResource<Commit.Author>,
  members: ApiResource<RepositoryMember>[],
) {
  return members.find(
    (member) => member.meta.id === author.repository_member_id,
  );
}

// Sort level 1: Authors without an associated repository member come first
// Sort level 2: Sort by author name
function compareCommitAuthors(a: Commit.Author, b: Commit.Author) {
  if (a.repository_member_id && !b.repository_member_id) {
    return 1;
  } else if (!a.repository_member_id && b.repository_member_id) {
    return -1;
  }
  return a.author_name.localeCompare(b.author_name);
}

const Members: React.FC<MembersProps> = ({ id }) => {
  const { data: members } = useRepositoryMembers(id);
  const { data: authors } = useRepositoryAuthors(id);
  console.log(members);
  console.log(authors);

  return (
    <Container maxWidth='sm'>
      <Box>
        {members &&
          authors?.sort(compareCommitAuthors)?.map((author) => {
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
  );
};

export default Members;
