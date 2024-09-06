export function addViewedBySnippetToBlock(blocks: any[], slackUserId: string): any[] {
  if (!slackUserId) {
    return blocks;
  }
  const response = [
    ...blocks,
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Requested by <@${slackUserId}>`,
        },
      ],
    },
  ];
  console.log('addViewedBySnippetToBlock', response);
  return response;
}
