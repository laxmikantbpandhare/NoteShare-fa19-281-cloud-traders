// Configurations for Frontend
const NODE_ENV = (process.env.NODE_ENV === 'production') ? 'production' : 'development'

let config = {
  url: {}
}

if (NODE_ENV === 'production') {
  // config.url.api = 'https://api.node-express-react-redux-zwitter.demo.atulmy.com/' // Change this URL according to your live server
 config.url.api = 'http://localhost:8080/'
} else {
 // config.url.api = '/'
  config.url.api = 'http://localhost:8080/'
}

export default config
