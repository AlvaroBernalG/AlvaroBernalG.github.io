(() => {
  const {log} = console;
  const {El, Render} = Redirt;
  log('starting');

  function NavLink(title, url) {
    return El('li', El('a', {
      href: url,
      children: title,
    }));
  }

  function Nav(props) {
    return El('nav', 
      El('ul', ...props.links.map(link => NavLink(link.title, link.url)))
    );
  };

  const Styles = (props) => El('style', 
     `
      :root {
        --nav-hegth: 50px;
        --nav-color: #eb1b65;
      }

      body, main {
        margin: 0px;
        width: 100vw;
        height: 100vh;
      }

      h1,h2,h3 {
        margin: 0px;
        padding: 0px;
      }

      body {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        background: white;
        font-family: 'IBM Plex Sans', serif;
      }

      main {
        max-width: 1600px;
      }

      nav {
        width: 100%;
        min-height: 50px;
        margin: 0px;
        padding: 0px;
        background: var(--nav-color);
        color: white;
      }

      nav ul {
        margin: 0px;
        padding: 0px;
        justify-content: space-around;
      }

      nav ul {
        display: flex;
      }

      nav li {
        display: flex;
        list-style-type: none;
        height: 100%;
        justify-content: center;
        height: 100%;
        width: 100%;
      }

      nav li a {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        width: 100%;
        text-decoration-line: none;
        color: white;
        font-size: 1.2em;
      }

      main > section {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      main > section > h1 {
        padding-top: 150px;
        font-size: 4em;
      }

    `
  );

  function App(state, r) {
    return El('main', 
      Styles(),
      Nav({ links: state.links }),
      El('section', El('h1', 'Labs')),
    );
  }
  
  
  const state = {
    links: [
      { 
        url: 'event-worker/example/withWebpack/dist/index.html', 
        title: 'Event Worker' 
      },

    ]
    
  };

  const render = Render(document.body, state);

  render(s => [App, s]);
  
})();

