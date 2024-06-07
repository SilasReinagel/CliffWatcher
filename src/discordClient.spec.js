// @ts-check
import { sendDirectMessage, sendMessageToChannel } from './discordClient';

describe('sendDirectMessage', () => {
  it.skip('should send a "Hello from CliffWatcher Katie" message to the specified user ID', async () => {
    const userId = '212763969876787201';
    const message = 'Hello from CliffWatcher Katie';

    await sendDirectMessage(userId, message);
  }, 20000);

  it.skip('should send a "Hello from CliffWatcher Katie" message to the specified channel ID', async () => {
    const channelId = '1248727310056558774';
    const message = 'Hello from CliffWatcher Katie';

    await sendMessageToChannel(channelId, message);
  }, 20000);
});
