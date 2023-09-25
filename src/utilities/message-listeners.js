const { getChannel } = require('./rabbit-mq');

async function initializeListeners() {
    const channel = getChannel();

  // Declare exchange
  await channel.assertExchange('user_events', 'topic', { durable: false });

  // Declare a queue
  const q = await channel.assertQueue('', { exclusive: true });

  // Binding keys could come from config or be hardcoded
  const bindingKeys = ['user.created', 'user.deleted']; 

  for (const key of bindingKeys) {
    await channel.bindQueue(q.queue, 'user_events', key);
  }

  channel.consume(q.queue, async (msg) => {
    const content = JSON.parse(msg.content.toString());
    await routeMessage(msg.fields.routingKey, content);
  }, { noAck: true });
}

async function routeMessage(routingKey, content) {
    switch (routingKey) {
        case 'user.created':
            await require('../controllers/users-controller').createUser(content.userId);
            break;
        case 'user.deleted':
            await require('../controllers/users-controller').deleteUser(content.userId);
            break;
    }
}

module.exports = initializeListeners;