const amqplib = require('amqplib');
const amqpUrlCloud = '';
const amqpUrlDocker = 'amqp://localhost:5672/';

const receiveEmail = async () => {
  try {
    // 1. create connect
    const conn = await amqplib.connect(amqpUrlCloud);

    // 2. create channel
    const channel = await conn.createChannel();

    // 3. create exchange
    const nameExchange = 'send_mail';
    // fanout là một loại exchange phân phối tất cả các message nhận được đến tất cả các queue được kết nối với nó.
    await channel.assertExchange(nameExchange, 'topic', {
      durable: false
    });

    // 4. create queue
    // tên của queue không được chỉ định trong hàm assertQueue(), RabbitMQ sẽ tạo ra một tên queue duy nhất. Điều này có thể hữu íchtrong một số trường hợp khi cần tạo ra một queue ngẫu nhiên, nhưng không cần lưu trữ tên của queue đó. 
    // Thêm vào đó, queue mới được tạo bằng cách sử dụng { exclusive: true } sẽ được xóa khi consumer ngắt kết nối, điều này giúp quản lý queue trở nên dễ dàng hơn trong một số trường hợp sử dụng.
    const { queue } = await channel.assertQueue('', {
      exclusive: true // nếu consumer đó ngắt kết nối, queue sẽ bị xóa đi.
    });
    console.log('nameQueue::', queue);

    // 5. binding
    const args = process.argv.slice(2);
    if (!args.length) {
      process.exit(0);
    }
    console.log(`waiting queue ${queue}::: topic:: ${args}`);

    args.forEach(async key => {
      await channel.bindQueue(queue, nameExchange, key);
    });

    await channel.consume(queue, msg => {
      console.log(`Routing key:: ${msg.fields.routingKey} and msg::${msg.content.toString()}`);
    });

  } catch (error) {
    console.error('Error::', error.message);
  }
};

receiveEmail();