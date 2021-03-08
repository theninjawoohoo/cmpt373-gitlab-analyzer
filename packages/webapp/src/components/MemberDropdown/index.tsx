import { Commit } from '@ceres/types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React, { useEffect, useState } from 'react';
import { useRepositoryAuthors } from '../../api/author';
import { ApiResource } from '../../api/base';
import { useRepositoryMembers } from '../../api/repo_members';

function findEmailsForMember(
  memberId: string,
  authors: ApiResource<Commit.Author>[],
) {
  const filtered = (authors || []).filter(
    (author) => author.repository_member_id === memberId,
  );
  return filtered.map((author) => author.author_email);
}

interface MemberDropdownProps {
  repositoryId: string;
  onChange?: (emails: string[]) => void;
}

const MemberDropdown: React.FC<MemberDropdownProps> = ({
  repositoryId,
  onChange,
}) => {
  const [value, setValue] = useState('all');
  const { data: members } = useRepositoryMembers(repositoryId);
  const { data: authors } = useRepositoryAuthors(repositoryId);
  useEffect(() => {
    if (value !== 'all') {
      const emails = findEmailsForMember(value, authors);
      onChange(emails.length > 0 ? emails : ['doesnotexist@email.com']);
    } else {
      onChange([]);
    }
  }, [value]);

  return (
    <FormControl variant='filled'>
      <InputLabel>Show results for:</InputLabel>
      <Select
        style={{ minWidth: '15rem' }}
        value={value || 'None'}
        onChange={(e) => {
          e.preventDefault();
          setValue(e.target.value as string);
        }}
      >
        <MenuItem value='all'>All students</MenuItem>
        {(members || [])?.map((m) => (
          <MenuItem key={m.meta.id} value={m.meta.id}>
            {m.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MemberDropdown;
