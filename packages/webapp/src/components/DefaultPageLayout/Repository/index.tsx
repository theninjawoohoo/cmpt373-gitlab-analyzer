import React from 'react';
import { useStyles } from './style';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import StarIcon from '@material-ui/icons/Star';
import Button from '@material-ui/core/Button';
import { useRepository } from '../../../api/repository';

const Repository: React.FC = () => {
  const { data: repos } = useRepository();
  const styles = useStyles();
  const message =
    repos.length == 0 ? (
      <h3>You have no repositories on your profile</h3>
    ) : null;

  const handleClick = (event) => {
    console.log(event);
  };
  console.log(repos);
  return (
    <div className={styles.wrapper} id='projects'>
      <h2>Projects</h2>
      {message}
      <div className={styles.grid}>
        {repos?.map((repo) => (
          <div
            className={styles.item}
            key={repo.id.toString()}
            id={repo.id.toString()}
          >
            <Button
              onClick={handleClick}
              fullWidth
              style={{ textTransform: 'none' }}
            >
              <div className={styles.card}>
                <div className={styles.content}>
                  <h4>{repo.name}</h4>
                  <p>{repo.description}</p>
                </div>
                <div className={styles.titleWrap}>
                  <div className={styles.stats}>
                    <div>
                      <StarIcon color='primary' />
                      <span>{repo.star_count}</span>
                    </div>
                    <div>
                      <CallSplitIcon color='primary' />
                      <span>{repo.forks_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Repository;
