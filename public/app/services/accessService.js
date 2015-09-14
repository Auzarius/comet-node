// From: http://stackoverflow.com/questions/20969835/angularjs-login-and-authentication-in-each-route-and-controller
// Posted by: sp00m // http://stackoverflow.com/users/1225328/sp00m
angular.module('accessService', [])

.factory("Access", ["$q", "UserProfile", function($q, UserProfile) {

  "use strict";

  var Access = {

    OK: 200,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,

    hasRole: function(role) {
      var deferred = $q.defer();
      UserProfile.then(function(userProfile) {
        if (userProfile.hasRole(role)) {
          deferred.resolve(Access.OK);
        } else if (userProfile.isAnonymous()) {
          deferred.reject(Access.UNAUTHORIZED);
        } else {
          deferred.reject(Access.FORBIDDEN);
        }
      });
      return deferred.promise;
    },

    hasAnyRole: function(roles) {
      var deferred = $q.defer();
      UserProfile.then(function(userProfile) {
        if (userProfile.hasAnyRole(roles)) {
          deferred.resolve(Access.OK);
        } else if (userProfile.isAnonymous()) {
          deferred.reject(Access.UNAUTHORIZED);
        } else {
          deferred.reject(Access.FORBIDDEN);
        }
      });
      return deferred.promise;
    },

    isAnonymous: function() {
      var deferred = $q.defer();
      UserProfile.then(function(userProfile) {
        if (userProfile.isAnonymous()) {
          deferred.resolve(Access.OK);
        } else {
          deferred.reject(Access.FORBIDDEN);
        }
      });
      return deferred.promise;
    },

    isAuthenticated: function() {
      var deferred = $q.defer();
      UserProfile.then(function(userProfile) {
        if (userProfile.isAuthenticated()) {
          deferred.resolve(Access.OK);
        } else {
          deferred.reject(Access.UNAUTHORIZED);
        }
      });
      return deferred.promise;
    }

  };

  return Access;

}])

.factory("UserProfile", ["$q", "getUser", function($q, getUser) {

  "use strict";

  var deferred = $q.defer();

  User.profile(function(userProfile) {
    deferred.resolve({

      hasRole: function(role) {
        return userProfile.roles.indexOf(role) >= 0;
      },

      hasAnyRole: function(roles) {
        return !!userProfile.roles.filter(function(role) {
          return roles.indexOf(role) >= 0;
        }).length;
      },

      isAnonymous: function() {
        return userProfile.anonymous;
      },

      isAuthenticated: function() {
        return !userProfile.anonymous;
      }

    });
  });

  return deferred.promise;

}])

.factory("getUser", ["$resource", function($resource) {

  "use strict";

  return $resource("api/me", { id: "@id" }, {

    profile: {
      method: "GET",
      params: { attr: "profile" }
    }

  });

}]);