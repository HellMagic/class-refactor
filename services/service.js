angular.module('Class.services', [])
    .factory('CacheProvider', [
        function () {
            var me, rooms, currentRoom, currentSchool;
            return {
                me: me,
                rooms: rooms,
                currentRoom: currentRoom,
                currentSchool: currentSchool
            }
        }
    ])

    .factory('UserProvider', [
        '$http',
        function ($http) {
            var getMe = function getMe() {
                return $http.get('/me');
            };

            return {
                getMe: getMe
            }
        }

    ])

    .factory('SchoolProvider', [
        '$http',
        function ($http) {
            var getCurrentSchool = function getCurrentSchool(me) {
                /*===================================================
                 =            Chcekout The Special School            =
                 ===================================================*/
                return $http.get('/webapp/class-refactor/school.json');
            }

            return {
                getCurrentSchool: getCurrentSchool
            }
        }
    ])

    .factory('RoomProvider', [
        '$http',
        '$q',
        function ($http, $q) {
            var getMyRooms = function getMyRooms(me) {
                /**
                 each class from classes array, get the calss reference;   the students array of the current class is objects
                 TODO:
                 - Get the rooms belongs to the teacher -- room.students
                 **/
                //return get httpPromise
                return $http.get('/webapp/class-refactor/rooms.json');
            };

            return {
                getMyRooms: getMyRooms
            }
        }
    ])

    .factory('ResourceManager', [
        '$http',
        '$q',
        'CacheProvider',
        'UserProvider',
        'SchoolProvider',
        'RoomProvider',
        function ($http, $q, CacheProvider, UserProvider, SchoolProvider, RoomProvider) {
            var initAll = function initAll() {
                var deferred = $q.defer();
                var initAllPromise = deferred.promise;
                UserProvider.getMe()
                    .then(function (response) {
                        var me = response.data;
                        CacheProvider.me = me;
                        var promises = [SchoolProvider.getCurrentSchool(me), RoomProvider.getMyRooms(me)];
                        return $q.all(promises);
                    }, function (err) {
                        console.error('Get Me Error: ' + angular.toJson(err));
                        deferred.reject(null);
                        window.location = '/webapp/login';
                    })
                    .then(function (datas) {
                        CacheProvider.currentSchool = datas[0].data;
                        CacheProvider.rooms = datas[1].data;
                        return CacheProvider.rooms;
                    }, function (err) {
                        console.error('Get School Error: ' + angular.toJson(err));
                        deferred.reject(null);
                    })
                    .then(function (rooms) {
                        if (rooms && rooms.length > 0) {
                            CacheProvider.currentRoom = rooms[0];
                            deferred.resolve('Success');
                            return;
                        }
                        deferred.resolve('no rooms')
                    }, function (err) {
                        console.error('Init The First Room Error: ' + angular.toJson(err));
                        deferred.reject(null);
                    })

                return initAllPromise;
            };

            return {
                initAll: initAll
            }
        }
    ])