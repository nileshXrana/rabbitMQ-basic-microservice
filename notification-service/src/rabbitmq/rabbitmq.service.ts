import { Injectable, OnModuleInit } from '@nestjs/common';
import amqp, { Channel, ChannelModel } from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection!: ChannelModel;
  private channel!: Channel;

  async onModuleInit() {
    this.connection = await amqp.connect('amqp://rabbitmq:5672');

    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue('notification_queue', {
      durable: true,
      arguments: {
        'x-queue-type': 'quorum',
      },
    });

    await this.channel.bindQueue(
      'notification_queue', // queue name
      'orders', // exchange name
      'order.created', // binding key
    );
  }

  getChannel(): Channel {
    return this.channel;
  }
}