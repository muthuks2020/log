unipaperapp.service('writerService', function($http, $q)
{
  return {
    //User Registration form submit service
    'saveStory': function(formdata) {
      var defer = $q.defer();
      // Posting data to php file
      $http({
        method  : 'POST',
        url     : '/writerstory',
        data    : formdata, //forms user object
        headers : {'Content-Type': 'application/json'}
       })
       .success(function(resp){
         defer.resolve(resp);
       })
       .error( function(err) {
         defer.reject(err);
       });
       return defer.promise;
    },

    //User Registration form submit service
    'saveFile': function(fd) {
      var defer = $q.defer();
      var uploadUrl = "/saveProfilePicture"
      $http.post(uploadUrl, fd, {
      withCredentials: true,
      headers: {'Content-Type': undefined },
      transformRequest: angular.identity
      })
       .success(function(resp){
         defer.resolve(resp);
       })
       .error( function(err) {
         defer.reject(err);
       });
       return defer.promise;     
    },

     'getStoryList':function(formdata) {
      var defer = $q.defer();
      // Posting data to php file
      $http({
        method  : 'get',
        url     : '/getAllStories',
        headers : {'Content-Type': 'application/json'}
       })
       .success(function(resp){
         defer.resolve(resp);
       })
       .error( function(err) {
         defer.reject(err);
       });
       return defer.promise;
    },
    'submitArticletoContentful': function(formdata) {
      var defer = $q.defer();
      // Posting data to php file
      $http({
        method  : 'POST',
        url     : '/submitArticletoContentful',
        data    : formdata, //forms user object
        headers : {'Content-Type': 'application/json'}
       })
       .success(function(resp){
         defer.resolve(resp);
       })
       .error( function(err) {
         defer.reject(err);
       });
       return defer.promise;
    },
    'getProfileupdateStatus':function(formdata) {
      var defer = $q.defer();
      // Posting data to php file
      $http({
        method  : 'get',
        url     : '/getProfileupdateStatus',
        headers : {'Content-Type': 'application/json'}
       })
       .success(function(resp){
         defer.resolve(resp);
       })
       .error( function(err) {
         defer.reject(err);
       });
       return defer.promise;
    },

 'profileformSubmit': function(formdata) 
    {
      var defer = $q.defer();
      // Posting data to php file
      $http({
        method  : 'POST',
        url     : '/profileformSubmit',
        data    : formdata, //forms user object
        headers : {'Content-Type': 'application/json'}
       })
       .success(function(resp)
       {
         defer.resolve(resp);
       })
       .error( function(err) 
       {
         defer.reject(err);
       });
       return defer.promise;
    },
    'updateCategory': function(formdata) 
    {
      var defer = $q.defer();
      // Posting data to php file
      $http({
        method  : 'POST',
        url     : '/updateCategory',
        data    : {"category":formdata}, //forms user object
        headers : {'Content-Type': 'application/json'}
       })
       .success(function(resp)
       {
         defer.resolve(resp);
       })
       .error( function(err) 
       {
         defer.reject(err);
       });
       return defer.promise;
    },

}});
