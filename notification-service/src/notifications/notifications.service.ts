import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit() {
    const channel = this.rabbitMQService.getChannel();

    channel.prefetch(1); // Process one message at a time

    await channel.consume(
      'notification_queue',
      (message) => {
        if (!message) {
          return;
        }

        const secs = 10;
        const order = JSON.parse(message.content.toString());

        console.log('Received order:', order);

        setTimeout(function () {
          console.log(' [x] Done');
          channel.ack(message);
        }, secs * 1000);
      },
      {
        noAck: false, // Enable manual acknowledgment
      },
    );
  }
}
