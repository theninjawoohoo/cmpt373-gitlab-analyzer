import React, { useState } from 'react';
import { useStyles } from './style';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import StarIcon from '@material-ui/icons/Star';
import Button from '@material-ui/core/Button';

import { data } from './sampleData';

const Repository: React.FC = () => {
  const [repos] = useState(data);
  const styles = useStyles();
  return (
    <div className={styles.wrapper} id='projects'>
      <h2>Projects</h2>
      <div className={styles.grid}>
        {repos.map((repo) => (
          <div
            className={styles.item}
            key={repo.id.toString()}
            id={repo.id.toString()}
          >
            <Button fullWidth style={{ textTransform: 'none' }}>
              <div className={styles.card}>
                <div className={styles.content}>
                  <h4>{repo.name}</h4>
                  <p>{repo.description}</p>
                </div>
                <div className={styles.titleWrap}>
                  <div className={styles.stats}>
                    <div>
                      <StarIcon color='#000' />
                      <span>{repo.star_count}</span>
                    </div>
                    <div>
                      <CallSplitIcon color='#000' />
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
