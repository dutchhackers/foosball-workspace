const slackConfig: any = {}; // TODO: refactor later
export const SLACK_OAUTH_ACCESS_TOKEN = slackConfig ? slackConfig.access_token : process.env['SLACK_OAUTH_ACCESS_TOKEN'];
export const SLACK_DEDICATED_CHANNEL = slackConfig ? slackConfig.dedicated_channel : process.env['SLACK_DEDICATED_CHANNEL'];
