import { WebSocketAuthGuard } from './web-socket-auth.guard';

describe('WebSocketAuthGuard', () => {
  it('should be defined', () => {
    expect(new WebSocketAuthGuard()).toBeDefined();
  });
});
