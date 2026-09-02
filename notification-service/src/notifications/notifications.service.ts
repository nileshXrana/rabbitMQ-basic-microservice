import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit() {
    const channel = this.rabbitMQService.getChannel();

    await channel.consume(
      'notification_queue',
      (message) => {
        if (!message) {
          return;
        }

        const order = JSON.parse(message.content.toString());

        console.log('Received order:', order);

        channel.ack(message);
      },
      {
        noAck: false, // Enable manual acknowledgment
      },
    );
  }
}