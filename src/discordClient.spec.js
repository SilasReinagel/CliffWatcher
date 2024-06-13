// @ts-check
import { sendDirectMessage, sendMessageToChannel } from './discordClient';

describe('sendDirectMessage', () => {
  it.skip('should send a "Hello from CliffWatcher Katie" message to the specified user ID', async () => {
    const userId = '';
    const message = 'Hello from CliffWatcher Katie';

    await sendDirectMessage(userId, message);
  }, 20000);

  it.skip('should send a "Hello from CliffWatcher Katie" message to the specified channel ID', async () => {
    const channelId = '';
    const message = 'Hello from CliffWatcher Katie';

    await sendMessageToChannel(channelId, message);
  }, 20000);
});
