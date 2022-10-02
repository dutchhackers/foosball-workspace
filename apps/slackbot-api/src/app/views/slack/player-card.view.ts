// import * as moment from 'moment';

import { Player } from '@foosball/api/common';

export function getPlayerCard(ctx: Player): any {
  return renderBlocks(ctx);
}

function renderBlocks(player: Player) {
  const hWin = player.highestWinStreak || 0;
  const hLose = player.highestLoseStreak || 0;
  const rank = Math.round(hWin / (hLose + 0.01));

  let fieldPlayerTitle = `*${player.name}*\n`;
  if (player.nickname) {
    fieldPlayerTitle = `*${player.name}* • _${player.nickname}_\n`;
  }

  let fieldTotalMatches = '';
  if (player.totalMatches > 0) {
    fieldTotalMatches = `*Matches*\t\t${player.totalMatches || 0}\n`;
  }

  let fieldCurrentStreak = '';
  if (player.winStreak + player.loseStreak > 1) {
    fieldCurrentStreak = `*Streak*\t\t\t${
      (player.winStreak || 0) > (player.loseStreak || 0) ? player.winStreak + ' wins' : player.loseStreak + ' defeats'
    }\n`;
  }

  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          fieldPlayerTitle +
          `${rank === 0 ? ':loser:' : emojiRange(rank, ':star:').join(' ')}` +
          `\n` +
          `\n` +
          fieldCurrentStreak +
          fieldTotalMatches +
          `*Last Match*\t${player.dateLastMatch}`,
      },
      accessory: {
        type: 'image',
        image_url: player.avatar || 'https://lorempixel.com/200/200/',
        alt_text: player.name,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Wins*\n${player.totalWins || 0}\t_(${Math.round(100 * ((player.totalWins || 0) / (player.totalMatches || 1)))}%)_`,
        },
        {
          type: 'mrkdwn',
          text: `*Defeats*\n${player.totalLosses || 0}\t_(${Math.round(100 * ((player.totalLosses || 0) / (player.totalMatches || 1)))}%)_`,
        },
        {
          type: 'mrkdwn',
          text: `*Highest Win Streak*\n${player.highestWinStreak || 0}`,
        },
        {
          type: 'mrkdwn',
          text: `*Highest Lose Streak*\n${player.highestLoseStreak || 0}`,
        },
        {
          type: 'mrkdwn',
          text: `*Knockouts*\n${player.totalKnockouts || 0}`,
        },
        {
          type: 'mrkdwn',
          text: `*Suckerpunches*\n${player.totalSuckerpunches || 0}`,
        },
        {
          type: 'mrkdwn',
          text: `*Kroep'n*\n${kroepnRange(player.totalHumiliations || 0, 'kroepn', ':no_entry_sign:').join(' ')}`,
        },
        {
          type: 'mrkdwn',
          text: `*Fatalities*\n${emojiRange(player.totalFlawlessVictories || 0, ':sports_medal:', ':no_entry_sign:').join('')}`,
        },
      ],
    },
    {
      type: 'divider',
    },
  ];
}

function emojiRange(size: number, emoji: string, whenEmpty = '-'): string[] {
  if (!size) {
    return [whenEmpty];
  }

  const arr = Array.from(Array(size).keys());
  return arr.map(p => emoji);
}

function kroepnRange(size: number, emoji: string, whenEmpty: string): string[] {
  if (!size) {
    return [whenEmpty];
  }
  const badges = [1, 5, 10, 25, 50].reverse(); // Start with highest number
  const arr: string[] = [];

  badges.forEach((badge, index) => {
    const n = Math.floor(size / badge);
    if (n) {
      for (let i = 0; i < n; i++) {
        let emojiBadge = `:${emoji}${badge}:`;
        if (index === badges.length - 1) emojiBadge = `:${emoji}:`;
        arr.push(`${emojiBadge}`);
      }
      size %= badge;
    }
  });

  return arr;
}
