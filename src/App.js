import { ElementaryFunc, Extend, Elementary, StyleSheet, div, p, a, input } from '../elementary/elementary.js';
import { Heading, Button, FlexContainer, FlexItem, FlexContainerItem } from '../elementary/cake.js';

import { API_BASE_URL } from './constants.js';

const theme = {
  colors: {
    primary: '#353535',
    secondary: '#c6c6c6',
    background: 'white',
    accent: '#2bc66e',
  },
  fontFamily: 'sans-serif',
  spacing: '1rem',
};

const styleSheet = {
  /* NOTE: order of these @media rules is important:
   *       rules appearing later override earlier rules
   */
  '@media (min-width: 700px)': {
    '.bufferColumn': {
      flex: '1 0 0'
    }
  },
  '@media (min-width: 0px)': {
    '.bufferColumn': {
      flex: '0 0 0'
    }
  },
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
      StyleSheet(this.props.id, styleSheet),
      div(
        { 
          id: this.props.id,
          theme: theme,
          style: {
            width: '100%',
            fontFamily: 'sans-serif',
          }
        },
        Navbar(),
        FlexContainer({ flexDirection: 'row', style: { justifyContent: 'center' } },
          FlexItem(
            { noInline: true, class: 'bufferColumn' }
          ),
          FlexContainerItem(
            { flex: '3 0 0',
              flexDirection: 'column',
              alignItems: 'center',
            },
            FlexContainerItem({
              justifyContent: 'center',
              alignItems: 'center',
              style: {
                width: '100%',
                padding: theme.spacing
              }},
              FlexItem(
                { flex: '1 0 0' },
                input({
                  id: 'feed-url-input',
                  style: {
                    width: '95%',
                    height: '1rem',
                  }
                })
              ),
              FlexItem(
                { flex: '.5 0 0' },
                Button({
                  id: 'get',
                  label: 'Get episodes',
                  onClick: this.handleClickGet,
                  color: theme.colors.accent,
                  style: {
                    borderRadius: '.25rem',
                    fontSize: '1rem',
                    width: '100%',
                    height: '100%',
                  }
                }),
              ),
            ),
            FlexItem(
              { flex: '1 0 0' },
              this.state.isError ? p(this.state.error) : EpisodeList({ episodes: this.state.episodes }),
            )
          ),
          FlexItem(
            { noInline: true, class: 'bufferColumn' }
          ),
        ),
      )
    );
  }
}, props);

function breakWidth(breakpoints) {
  let bps = Object.keys(breakpoints).sort().reverse();
  
  for (let bp of bps) {
    if (window.matchMedia(`(min-width: ${bp}px`).matches) {
      return breakpoints[bp];
    }
  }

  console.warn('breakWidth: no breakpoint matched.');
  return null;
}

const Navbar = ElementaryFunc((props) => (
  FlexContainer(
    { flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'stretch',
      style: { width: '100%', backgroundColor: props.theme.colors.primary }
    },
    FlexItem(
      { flex: '2 0 auto' }
    ),
    FlexItem(
      { flex: '2 0 auto' },
      Heading(
        { size: 1,
          style: {
            color: props.theme.colors.background,
            textAlign: 'center',
          }
        },
        'Podcasts'
      ),
    ),
    FlexItem({ flex: '1 0 auto' }),
    FlexItem(
      { flex: '1 0 auto' },
      Button({
        id: 'help-button',
        label: '?',
        color: props.theme.colors.primary,
        style: {
          height: '100%',
          width: '100%',
          color: props.theme.colors.background,
          fontSize: '1rem'
        }
      })
    )
  )
));

const EpisodeList = ElementaryFunc((props) => (
  FlexContainer(
    { flexDirection: 'column',
      alignItems: 'stretch',
      style: { width: '100%' }
    },
    props.episodes.map(ep => (
      FlexItem({
        style: {
          margin: props.theme.spacing,
          padding: props.theme.spacing,
          borderStyle: 'solid',
          borderRadius: '.25rem',
          borderColor: props.theme.colors.secondary,
        }},
        Heading({
          size: 4,
          style: {
            margin: 0
          }},
          ep.title),
        p(ep.duration),
        a('Go to episode', { href: ep.link }),
      )
    ))
  )
));

export default App;
