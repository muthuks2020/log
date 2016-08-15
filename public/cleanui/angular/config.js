(function (window) {
  'use strict';

  var applicationModuleName = 'cleanUI';

  var service = {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: ['ui.router', 'ngCookies'],
    registerModule: registerModule,
    config: {
      oauth : 'LBntk8TZAhSwyEFcqSeX0UtUVg8',
      contentfulManagementAccessToken: '11be9dfd82b44b3711c26bb448612610eb8afb90ce5a53b1404979aea178b744',
      contentfulSpaceID: '17u05p4x0l0r'
    }
  };

  window.ApplicationConfiguration = service;

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }
}(window));