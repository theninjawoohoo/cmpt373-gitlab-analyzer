import { makeStyles, createStyles } from '@material-ui/core';

export const useStyles = makeStyles(() =>
  createStyles({
    card: {
      padding: '1rem',
      background: '#FFF',
      height: '100%',
      width: '100%',
    },
    titleWrap: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    wrapper: {
      padding: '2rem 0',
    },
    grid: {
      display: 'grid',
      alignItems: 'center',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: '8fr',
      gap: '1.2rem 1.2rem',

      '@media (max-width: 960px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',
      },

      '@media (max-width: 680px)': {
        gridTemplateColumns: '1fr',
      },
    },
    item: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      boxShadow: '0 1px 6px 0 rgba(0, 0, 0, 0.11)',

      h4: {
        color: '#212121',
      },

      p: {
        color: '#707070',
      },
    },
    content: {
      padding: '1rem 0',
      minHeight: '160px',
    },
    stats: {
      display: 'flex',
      alignItems: 'center',

      div: {
        display: 'flex',

        img: {
          margin: '0',
        },

        svgpath: {
          fill: '#000',
        },

        span: {
          color: '#000',
          marginLeft: '0.5rem',
        },
      },
    },
    languages: {
      opacity: '0.5',
      fontSize: '14px',
    },
  }),
);
