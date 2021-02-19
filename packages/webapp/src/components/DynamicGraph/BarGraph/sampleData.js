const createGraphData = (date, commit, mr) => {
  return { date, commit, mr };
};

export const data = [
  createGraphData(
    'Feb 14',
    [
      { commitName: 'Robin Scherbatsky', commitNum: 2 },
      { commitName: 'Ted Mosby', commitNum: 3 },
      { commitName: 'Tracy McConnell', commitNum: 1 },
    ],
    [
      { mrName: 'Robin Scherbatsky', mrNum: 1 },
      { mrName: 'Ted Mosby', mrNum: 0 },
      { mrName: 'Tracy McConnell', mrNum: 0 },
    ],
  ),
  createGraphData(
    'Feb 15',
    [
      { commitName: 'Robin Scherbatsky', commitNum: 0 },
      { commitName: 'Ted Mosby', commitNum: 0 },
      { commitName: 'Tracy McConnell', commitNum: 5 },
    ],
    [
      { mrName: 'Robin Scherbatsky', mrNum: 0 },
      { mrName: 'Ted Mosby', mrNum: 0 },
      { mrName: 'Tracy McConnell', mrNum: 2 },
    ],
  ),
  createGraphData(
    'Feb 16',
    [
      { commitName: 'Robin Scherbatsky', commitNum: 3 },
      { commitName: 'Ted Mosby', commitNum: 1 },
      { commitName: 'Tracy McConnell', commitNum: 0 },
    ],
    [
      { mrName: 'Robin Scherbatsky', mrNum: 2 },
      { mrName: 'Ted Mosby', mrNum: 1 },
      { mrName: 'Tracy McConnell', mrNum: 0 },
    ],
  ),
  createGraphData(
    'Feb 17',
    [
      { commitName: 'Robin Scherbatsky', commitNum: 1 },
      { commitName: 'Ted Mosby', commitNum: 4 },
      { commitName: 'Tracy McConnell', commitNum: 2 },
    ],
    [
      { mrName: 'Robin Scherbatsky', mrNum: 0 },
      { mrName: 'Ted Mosby', mrNum: 1 },
      { mrName: 'Tracy McConnell', mrNum: 2 },
    ],
  ),
  createGraphData(
    'Feb 18',
    [
      { commitName: 'Robin Scherbatsky', commitNum: 3 },
      { commitName: 'Ted Mosby', commitNum: 3 },
      { commitName: 'Tracy McConnell', commitNum: 4 },
    ],
    [
      { mrName: 'Robin Scherbatsky', mrNum: 2 },
      { mrName: 'Ted Mosby', mrNum: 2 },
      { mrName: 'Tracy McConnell', mrNum: 1 },
    ],
  ),
  createGraphData(
    'Feb 19',
    [
      { commitName: 'Robin Scherbatsky', commitNum: 0 },
      { commitName: 'Ted Mosby', commitNum: 0 },
      { commitName: 'Tracy McConnell', commitNum: 0 },
    ],
    [
      { mrName: 'Robin Scherbatsky', mrNum: 0 },
      { mrName: 'Ted Mosby', mrNum: 0 },
      { mrName: 'Tracy McConnell', mrNum: 0 },
    ],
  ),
  createGraphData(
    'Feb 20',
    [
      { commitName: 'Robin Scherbatsky', commitNum: 1 },
      { commitName: 'Ted Mosby', commitNum: 2 },
      { commitName: 'Tracy McConnell', commitNum: 4 },
    ],
    [
      { mrName: 'Robin Scherbatsky', mrNum: 0 },
      { mrName: 'Ted Mosby', mrNum: 1 },
      { mrName: 'Tracy McConnell', mrNum: 0 },
    ],
  ),
];
