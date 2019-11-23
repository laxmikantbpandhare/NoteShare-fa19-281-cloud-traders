// Configurations for Frontend
const NODE_ENV = (process.env.NODE_ENV === 'production') ? 'production' : 'development'

let config = {
  url: {}
}

if (NODE_ENV === 'production') {
  // config.url.api = 'https://api.node-express-react-redux-zwitter.demo.atulmy.com/' // Change this URL according to your live server
// config.url.api = 'http://localhost:8080/'
config.url.api = 'https://3w92mz6b4m.execute-api.us-east-1.amazonaws.com/teststage/'
} else {
 // config.url.api = '/'
  config.url.api = 'https://3w92mz6b4m.execute-api.us-east-1.amazonaws.com/teststage/'
}

export default config
