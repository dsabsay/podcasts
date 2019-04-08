import { ElementaryFunc, Extend, Elementary, div, p, a, input } from '../elementary/elementary.js';
import { Heading, Button, FlexContainer, FlexItem } from '../elementary/cake.js';

import { API_BASE_URL } from './constants.js';

const theme = {
  colors: {
    primary: '#353535',
    secondary: '#c6c6c6',
    background: 'white',
    accent: '#92cff3',
  },
  fontFamily: 'sans-serif',
  spacing: '1rem',
};

const App = (props) => Extend(Elementary, {
  initState: function() {
    this.state = {
      episodes: []
    }
  },

  handleClickGet: function() {
    const feedUrl = document.getElementById('feed-url-input').value;
    const url = API_BASE_URL + 'podcast?feed=' + feedUrl;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: {response.status} {response.statusText}`);
        }

        return response;
      })
      .then(response => {
        return response.json();
      })
      .then(result => {
        this.changeState({ episodes: result });
      })
      .catch(error => {
        this.changeState({
          error: error.message,
          isError: true,
        });
      });
  },

  render: function() {
    return (
      div(
        { 
          theme: theme,
          style: { width: '100%', fontFamily: 'sans-serif' },
        },
        FlexContainer({ flexDirection: 'column', style: { alignItems: 'center' } },
          FlexItem(
            Heading('Podcasts')
          ),
          FlexItem(
            input('test', { id: 'feed-url-input' }),
            Button({
              id: 'get',
              label: 'Get episodes',
              onClick: this.handleClickGet,
            }),
          ),
          this.state.isError ? FlexItem(p(this.state.error)) : EpisodeList({ episodes: this.state.episodes }),
        ),
      )
    );
  }
}, props);

const EpisodeList = ElementaryFunc((props) => (
  FlexContainer(
    { flexDirection: 'column',
      style: { width: '50%' }
    },
    props.episodes.map(ep => (
      FlexItem(
        Heading({ size: 4 }, ep.title),
        p(ep.duration),
        a('Go to episode', { href: ep.link }),
      )
    ))
  )
));

export default App;
