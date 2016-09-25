const mock = require('mock-require');

mock('frix', {
  gui: {
    getAllPages: () => new Object({
      '/page1': {
        html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8"/>
            <title>Woody</title>
          </head>
          <body>
            <article>
              <header>
                <h1>Tree</h1>
                <h1>Baum</h1>
                <p>written by <a href="https://simple.wikipedia.org/wiki/Tree">Wikipedia</a></p>
              </header>
              <p>A tree is a tall plant with a trunk and branches made of wood.</p>
            </article>
          </body>
        </html>`,
        name: 'default'
      },
      '/page2': {
        html: '<h1>Page2</h1>',
        name: 'default'
      }
    }),
    getContentStructure: () => new Object({
      "title" : {
        type: "text",
        value: "Woody"
      },
      "article" : {
        "text": {
          type: "richtext",
          value: "A tree is a tall plant with a trunk and branches made of wood."
        },
        "header": {
          "heading-en": {
            type: "text",
            value: "Tree"
          },
          "heading-de": {
            type: "text",
            value: "Baum"
          },
          "author": {
            "name": {
              type: "text",
              value: "Wikipedia"
            },
            "link": {
              type: "url",
              value: "https://simple.wikipedia.org/wiki/Tree"
            }
          }
        }
      }
    })
  }
});
