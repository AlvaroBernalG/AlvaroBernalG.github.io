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
      --body-background: #eb1b65;
      --color: white;
      --nav-height: 60px;
      --nav-background: #eb1b65;
      --nav-color-hover: #d01a5b;
    }

    body, main {
      margin: 0px;
      width: 100vw;
      height: 100vh;
      color: var(--color);
    }

    body {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      background: radial-gradient(#c60a4d, var(--body-background));
      font-family: 'IBM Plex Sans', serif;
    }

    h1,h2,h3 {
      margin: 0px;
      padding: 0px;
    }

    main {
      max-width: 1600px;
    }

    nav {
      width: 100%;
      min-height: var(--nav-height);
      margin: 0px;
      padding: 0px;
      background: var(--nav-background);
      color: white;
    }

    nav li:hover {
      background-color: var(--nav-color-hover);
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
      justify-content: center;
      height: 100%;
      width: 100%;
    }

    nav li a {
      display: flex;
      justify-content: center;
      align-items: center;
      height: var(--nav-height);
      width: 100%;
      text-decoration-line: none;
      color: white;
      font-size: 1.2em;
    }

    main > section {
      display: flex;
      justify-content: center;
    }

    main > section > h1 {
      padding-top: 125px;
      font-size: 5em;
      text-align: center;
    }
  `
);

const Footer = () => El('footer', El('h1', 'hi'));

function App(state, r) {
  const onSubmit = (value) => log(value)

  const onChange = value => {
    log('changing', value);
    r(s => [App, {...s, inputValue: value}]);
  }

  return El('main', 
    Styles(),
    Nav({ links: state.links }),
    El('section', El('h1', `Welcome to ${state.title}`)),
    El('section', function() {
      const input = El('input', {
        keyup: (e) => onChange(input.value),
        autofocus: '',
        value: state.inputValue,
        id: 'test'
      });

      const button = El('button', {
        click: e => onSubmit(input.value),
        children: 'enter'
      });

      const container = El('div');

      return container;
    }
  ));
}

const state = {
  inputValue: '',
  title: ' Web lab',
  links: [{ 
    url: 'event-worker/example/withWebpack/dist/index.html', 
    title: 'Event Worker' 
  }, {
    url: 'alvarobg.com/app', 
    title: 'Landing page' 
  }]
};

const render = Render(document.body, state);


const array = (() => {
  const _ = {};

  _.last = input => input[input.length -1];
  
})(); 


function reduceWord (pos, word) {
  return word.slice(word[pos], word.length);
}


/**
const words = ['Web Lab', 'Danger Zone'];
let acc = 'res';
let pos = 1;
function updateTitle(title) {
  if (acc === 'res') {
    return title.slice(0, title.length - 1);
  }
  const word = title.slice(0, pos);
  pos += 1;
  if (words.some(e => title)) {
    acc = 'res';
  }
  return word;
}

function chooseTitle(title) { 
  log('choose title', title);
  if (title === '') {
    pos = pos === words.length -1 ? 0 : pos + 1;
    return words[pos];
  }
  return title;
}

(function interval() {
  setTimeout(() => {
    render(s => [App, { ...s, title: updateTitle(chooseTitle(s.title))} ]);
    interval();
  }, 200);
})();

*/
//crender(s => [App, { ...s, title: updateTitle(chooseTitle(s.title)));

render(s => [App, s]);

