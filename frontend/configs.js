const backendUrls = {
  prod: {
    serverside: '',
    clientside: '',
  },
  dev: {
    serverside: 'http://backend:4000/api',
    clientside: 'http://localhost:4000/api',
  },
}

export const getBackendUrl = () => {
  return backendUrls[process.env.NODE_ENV === 'development' ? 'dev' : 'prod'][
    process.browser ? 'clientside' : 'serverside'
  ]
}
