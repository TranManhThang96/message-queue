const amqplib = require('amqplib');
const amqpUrlCloud = '';
const amqpUrlDocker = 'amqp://localhost:5672/';

const receiveNoti = async () => {
  try {
    // 1. create connect
    const conn = await amqplib.connect(amqpUrlCloud);

    // 2. create channel
    const channel = await conn.createChannel();

    // 3. create exchange
    const nameExchange = 'video';
    // fanout là một loại exchange phân phối tất cả các message nhận được đến tất cả các queue được kết nối với nó.
    await channel.assertExchange(nameExchange, 'fanout', {
      durable: false
    });

    // 4. create queue
    // tên của queue không được chỉ định trong hàm assertQueue(), RabbitMQ sẽ tạo ra một tên queue duy nhất. Điều này có thể hữu íchtrong một số trường hợp khi cần tạo ra một queue ngẫu nhiên, nhưng không cần lưu trữ tên của queue đó. 
    // Thêm vào đó, queue mới được tạo bằng cách sử dụng { exclusive: true } sẽ được xóa khi consumer ngắt kết nối, điều này giúp quản lý queue trở nên dễ dàng hơn trong một số trường hợp sử dụng.
    const { queue } = await channel.assertQueue('', {
      exclusive: true // nếu consumer đó ngắt kết nối, queue sẽ bị xóa đi.
    })
    console.log('nameQueue::', queue)

    // 5. binding
    // Sau khi tạo queue, chúng ta cần binding nó với exchange để RabbitMQ có thể gửi các message đến queue.
    await channel.bindQueue(queue, nameExchange, '')

    // 6. receive from queue
    await channel.consume(queue, msg => {
      console.log('msg::', msg.content.toString())
    }, {
      noAck: false // tham số noAck trong consume() để xác nhận rằng message đã được xử lý. Nếu false, RabbitMQ sẽ cho rằng message không được xử lý và sẽ gửi lại nó đến queue.
    })

  } catch (error) {
    console.error('Error::', error.message);
  }
};

receiveNoti();