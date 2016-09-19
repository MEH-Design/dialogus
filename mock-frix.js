const mock = require('mock-require');

mock('frix', {
  gui: {
    getAllPages: () => new Object({
      '/page1': {
        html: '<h1>Page1</h1>',
        name: 'default'
      },
      '/page2': {
        html: '<h1>Page2</h1>',
        name: 'default'
      }
    })
  }
});
