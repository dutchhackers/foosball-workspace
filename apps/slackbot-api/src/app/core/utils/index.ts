import { IFinalScore } from '../models';

export const totoResult = (score: IFinalScore) => {
  if (score[0] > score[1]) {
    return 1;
  } else if (score[0] < score[1]) {
    return 2;
  } else {
    return 0; // it's a tie
  }
};

export function checkFlawlessVictory(score: IFinalScore): boolean {
  // meaning: kroep'n
  if (Math.min(...score) === 0 && Math.max(...score) >= 10) {
    return true;
  }
  return false;
}

export function checkSuckerPunch(score: IFinalScore): boolean {
  // meaning: score > 10 (klinker end)
  if (Math.max(...score) === 11) {
    return true;
  }
  return false;
}

// Uses when retrieving Kroepn leaderboard
export function formatKroepnLeaderboardRow(item: {
  score: number;
  rank: number;
  title: number;
  wins: number;
  losses: number;
  streakText: string;
}) {
  const metrics = [];
  const countWins = item.wins || 0;
  const countLosses = item.losses || 0;
  const countMatches = countWins + countLosses;
  const TEMPLATE = 1;

  if (TEMPLATE === 1) {
    if (countMatches) {
      metrics.push(`${Math.round((100 * countWins) / countMatches)}% wins`);
    }

    // if (item.streakText) {
    //   metrics.push(`*${item.streakText}* streak`);
    // }
  } else if (TEMPLATE === 2) {
    if (countWins) metrics.push(`${countWins} wins`);
    if (countLosses) metrics.push(`${countLosses} losses`);
    if (countMatches) metrics.push(`${Math.round((100 * countWins) / countMatches)}% win ratio`);
  }

  let text = `${item.rank}) ${item.title} with *${item.score} Points*`;
  // let text = `${item.rank}) ${item.title} with ${ countMatches } games and *${item.score} humiliations*`;
  if (metrics.length) {
    text += ` (${metrics.join(', ')})`;
  }
  return text;
}

export function parseSlackUser(input: string): { id: string; username: string } {
  // const regex = /<@(?<id>.+)[|](?<username>.+)>/
  const regex = /<@(.+?)[|](.+?)>/;
  const data = regex.exec(input);
  if (data !== null) {
    return {
      id: data[1], // First group
      username: data[2], // Second group
    };
  }
  return {
    id: '',
    username: '',
  };
}

// TODO: maybe interesting case for unit testing
export function checkIfDuplicateExists(arr: string[]) {
  return new Set(arr).size !== arr.length;
}
