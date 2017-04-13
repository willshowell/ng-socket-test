import { SocketsPage } from './app.po';

describe('sockets App', () => {
  let page: SocketsPage;

  beforeEach(() => {
    page = new SocketsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
