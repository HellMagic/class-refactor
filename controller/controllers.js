/**
 * Created by HYFY on 14/11/11.
 */
angular.module('Class.controllers', []).
    controller('HomeController', [
        '$scope',
        'CacheProvider',
        '$rootScope',
        '$timeout',
        function ($scope, CacheProvider, $rootScope, $timeout) {
            $scope.initData = function () {
                $scope.homeC = {};
                $scope.homeC.me = CacheProvider.me;
                $scope.homeC.rooms = CacheProvider.rooms;
                $scope.homeC.selectedClass = CacheProvider.rooms[0];
                if($scope.homeC.me.is_tepm){
                    $rootScope.$broadcast('loadingAnimateRemove');
                    return;
                }
                if(!CacheProvider.currentSchool){
                    $timeout(function(){
                        $rootScope.$broadcast('noSchool');
                        alert('没有school');
                    }, 800);
                    $rootScope.$broadcast('loadingAnimateRemove');
                    return;
                }
                if(!$scope.homeC.rooms || $scope.homeC.rooms.length === 0){
                    $timeout(function(){
                        $rootScope.$broadcast('createClass');
                    }, 800);
                    $rootScope.$broadcast('loadingAnimateRemove');
                    return;
                }
                $scope.homeC.selectedClassIndex = 0;
                $rootScope.$broadcast('loadingAnimateRemove');
            };
            
            $scope.selectOneClass = function(room){
                $scope.homeC.selectedClass = room;
            };

            $scope.selectOneStudent = function(index){
                $scope.homeC.selectedStudentIndex = index;
                $scope.homeC.selectedStudent = $scope.homeC.selectedClass.students[index];
            };

            $scope.editClassName = function(){$scope.homeC.isEditClassName = true;
                $scope.homeC.EditedClassNameBackUp = $scope.homeC.selectedClass.name;
            };

            $scope.editStudentName = function(index){
                $scope.selectOneStudent(index);
                $scope.homeC.isEditStudentName = true;
                $scope.homeC.EditedSrtudentNameBackUp = $scope.homeC.selectedStudent.name;
            };

            $scope.copyClassNumber = function() {
                //Track.teacher.copyClassNumber(angular.toJson($scope.homeC.selectedClass));
                $rootScope.$broadcast('copyDone');
                return $scope.homeC.selectedClass.classNumber;
            };

            $scope.broadcastEvent = function(event){
                $rootScope.$broadcast(event);
            };

            $scope.initData();
        }]);