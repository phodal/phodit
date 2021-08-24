exports.config = {
  namespace: 'phodit-header',
  outputTargets:[
    {
      type: 'dist'
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'www',
      serviceWorker: false
    }
  ]
};
