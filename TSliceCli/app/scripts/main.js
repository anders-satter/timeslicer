/*
 * require js file
 */
require.config({
  // alias libraries paths
  paths: {
    'angular': '../bower_components/angular'
  },
  // angular does not support AMD out of the box, put it in a shim
  shim: {
    'angular': {
      exports: 'angular'
    }
  }
  // kick start application
  //deps: ['./bootstrap
  //this is exaclty what we need to kickstart our application
});