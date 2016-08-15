appUnipaper.service('authencationService', function($http, $q)
{
  return {
    //User Registration form submit service
    'saveSignupForm': function(formdata) {
      var defer = $q.defer();
      // Posting data to php file
      $http({
        method  : 'POST',
        url     : '/savesignupform',
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

    'signinForm': function(formdata) 
    {
      var defer = $q.defer();
      // Posting data to php file
      $http({
        method  : 'POST',
        url     : '/sigininAction',
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

     'signinSocialForm': function(userid,username) 
     {
      var defer = $q.defer();
      // Posting data to php file
      $http({
        method  : 'POST',
        url     : '/sigininSocialAction',
        data    : {username:username,userid:userid}, //forms user object
        headers : {'Content-Type': 'application/json'}
       })
       .success(function(resp)
       {
         defer.resolve(resp);
       })
       .error( function(err) {
         defer.reject(err);
       });
       return defer.promise;
    },

   
    
}});
