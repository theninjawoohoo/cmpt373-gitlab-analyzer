import React, { useEffect, useState } from "react";
import { useStyles } from "./style";
import { data } from "./sampleData";
import StarIcon from "@material-ui/icons/Star";
import CallSplitIcon from "@material-ui/icons/CallSplit";

export const Repository = () => {
  const [repos, setRepos] = useState([]);
  useEffect(() => {
    // Call to API GET /projects
    setRepos(data);
  });
  const styles = useStyles();
  return (
    <div className={styles.wrapper} id="projects">
      <h2>Projects</h2>
      <div className={styles.grid}>
        {repos.map(({ node }) => (
          <div
            className={styles.item}
            key={node.id}
            as="a"
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            theme={theme}
          >
            <div className={styles.card} theme={theme}>
              <div className={styles.content}>
                <h4>{node.name}</h4>
                <p>{node.description}</p>
              </div>
              <div className={styles.titleWrap}>
                <div className={styles.stats} theme={theme}>
                  <div>
                    <StarIcon color="#000" />
                    <span>{node.starcount}</span>
                  </div>
                  <div>
                    <CallSplitIcon color="#000" />
                    <span>{node.forkcount}</span>
                  </div>
                </div>
                <div className={styles.stats} theme={theme}>
                  <div className={styles.languages}>
                    {node.languages.nodes.map(({ id, name }) => (
                      <span key={id}>{name}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
