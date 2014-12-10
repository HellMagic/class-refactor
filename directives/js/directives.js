/**
 * Created by HYFY on 14/11/10.
 */
angular.module('Class.directives', ['Class.services']).
    directive('createClassOrStudentDialog', [function(){
        return {
            restrict: 'E',
            replace: true,
            scope: {
                currentClass: '=room'
            },
            templateUrl: 'directives/template/createClassOrStudent.html',
            controller: ['$scope', 'CacheProvider', '$rootScope', function($scope, CacheProvider, $rootScope){
                $scope.initData = function(createProcess, classNumber){
                    $scope.temp = {};
                    $scope.temp.createProcess = createProcess;
                    $scope.temp.newClassNumber = classNumber || '';
                    $scope.temp.createStudentsWay = 'auto';
                    $scope.temp.createStudentsProcessing = false;
                    $('#ModelOfCreate').modal('show');
                };
                $scope.$on('createClass', function(){
                    CacheProvider.rooms.length < 5
                        ? $scope.initData('createClass')
                        : $rootScope.$broadcast('classExceeding');
                });
                $scope.$on('createStudents', function(){
                    $scope.initData('createStudents', $scope.currentClass.classNumber);
                });
                $scope.createClass = function(){
                    if($scope.temp.newClassName.length > 15){
                        $scope.temp.createClassTip = 'formatWrong';
                        return;
                    }
                    if(_.find(CacheProvider.rooms, function(room){ return room.name === $scope.temp.newClassName; })){
                        $scope.temp.createClassTip = 'alreadyHave';
                        return;
                    }
                    $scope.temp.newClassNumber = 'APEC';
                    CacheProvider.rooms.push({"name":$scope.temp.newClassName, "students":[], "classNumber":$scope.temp.newClassNumber});
                    $scope.currentClass = _.last(CacheProvider.rooms);
                    $scope.temp.createProcess = 'createdClass';
                };
                $scope.toCreateStudentsAccount = function(){
                    $scope.temp.createProcess = 'createStudents';
                };
                $scope.selectCreateStudentsWay = function(way){
                    $scope.temp.createStudentsWay = way;
                };
                $scope.generateStudents = function(){
                    switch ($scope.temp.createStudentsWay) {
                        case 'auto':
                            var count = parseInt($scope.temp.students_count);
                            if(parseInt($scope.temp.students_count).toString().length !== $scope.temp.students_count.length){
                                $scope.temp.inputErr = 'NaN';
                                return;
                            }
                            if(count > 100){
                                $scope.temp.inputErr = 'exceed';
                                return;
                            }
                            $scope.temp.createStudentsProcessing = true;
                            $scope.temp.students = [];
                            for(var i = 0; i < count; i++){
                                $scope.temp.students.push({"username":$scope.temp.newClassNumber+i, "name":i+'号'});
                            }
                            break;
                        case 'self':
                            var studentsArr = $scope.temp.names.split('\n');
                            if(studentsArr.length > 100){
                                $scope.temp.inputErr === 'exceed';
                                return;
                            }
                            $scope.temp.students = [];
                            for(var i = 0; i < studentsArr.length; i++){
                                $scope.temp.students.push({"username":$scope.temp.newClassNumber+i, "name":studentsArr[i]});
                            }
                            break;
                        default: return;
                    }
                    CacheProvider.rooms[CacheProvider.rooms.length-1].students = $scope.temp.students;
                    $scope.temp.createProcess = 'createdStudents';
                }
            }]
        }
    }]).
    directive('classExceedingDialog', [function(){
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'directives/template/classExceeding.html',
            controller: ['$scope', function($scope){
                $scope.$on('classExceeding', function(){
                    $('#classExceedingDialog').modal('show');
                });
            }]
        }
    }]).
    directive('removeStudentDialog', [function(){
        return {
            restrict: 'E',
            replace: true,
            scope: {
                currentStudent: '=student',
                currentClass: '=room'
            },
            templateUrl: 'directives/template/removeStudentTip.html',
            controller: ['$scope', function($scope){
                $scope.$on('removeStudent', function(){
                    $('#removeStudentDialog').modal('show');
                });
                $scope.removeStudent = function(){
                    for(var i = 0, j = $scope.currentClass.students.length; i < j; i++){
                        if($scope.currentClass.students[i].username === $scope.currentStudent.username){
                            $scope.currentClass.students.splice(i, 1);
                            break;
                        }
                    }
                }
            }]
        }
    }]).
    directive('disbandClassDialog', [function(){
        return {
            restrict: 'E',
            replace: true,
            scope: {
                currentClass: '=room'
            },
            templateUrl: 'directives/template/disbandClass.html',
            controller: ['$scope', 'CacheProvider', function($scope, CacheProvider){
                $scope.$on('disbandClass', function(){
                    $scope.temp = {};
                    $('#disbandClassDialog').modal('show');
                });
                $scope.disbandClass = function(){
                    if($scope.temp.disbandClassPassword !== 'teacher'){
                        $scope.temp.inputErr = 'wrong';
                        return;
                    }
                    for(var i = 0, j = CacheProvider.rooms.length; i < j; i++){
                        if(CacheProvider.rooms[i].name === $scope.currentClass.name){
                            CacheProvider.rooms.splice(i,1);
                            $scope.currentClass = CacheProvider.rooms[0];
                            break;
                        }
                    }
                    $('#disbandClassDialog').modal('hide');
                }
            }]
        }
    }]).
    directive('resetPasswordDialog', [function(){
        return {
            restrict: 'E',
            replace: true,
            scope: {
                currentStudent: '=student'
            },
            templateUrl: 'directives/template/resetPassword.html',
            controller: ['$scope', function($scope){
                $scope.$on('resetPassword', function(){
                    $scope.tempObj = {};
                    $scope.tempObj.resetPasswordProcess = 'begin';
                    $('#resetPasswordDialog').modal('show');
                });
                $scope.resetStudentPassword = function(){
                    $scope.tempObj.resetPasswordProcess = 'success';
                };
            }]
        }
    }]).
    directive('addStudentDialog', [function(){
        return {
            restrict: 'E',
            replace: true,
            scope: {
                currentClass: '=room'
            },
            templateUrl: 'directives/template/addStudentDialog.html',
            controller: ['$scope', '$element', '$attrs', 'CacheProvider', function($scope, $element, $attrs, CacheProvider){
                $scope.$on('addStudent', function(){
                    $('#addStudentDialog').modal('show');
                    $scope.newStudent = {};
                });
                $scope.joinStudent = function(form){
                    $scope.submitted = true;
                    if (form.$valid) {
                        for(var i = 0, j = CacheProvider.rooms.length; i < j; i++){
                            if(CacheProvider.rooms[i].name === $scope.currentClass.name){
                                CacheProvider.rooms[i].students.push($scope.newStudent);
                                break;
                            }
                        }
                        $scope.submitted = false;
                        $('#addStudentDialog').modal('hide');
                    }
                }
            }]
        }
    }]).
    directive('hoverShow', [function(){
        return {
            restrict: 'A',
            scope: true,
            controller: ['$scope', '$element', function($scope, $element){
                $element.on('mouseover', function(){
                    $element.tooltip('show');
                });
                $element.on('mouseleave', function(){
                    $element.tooltip('hide');
                });
            }]
        }
    }]).
    directive('editInteractive', [function() {
        return {
            restrict: 'A',
            scope: true,
            controller: ['$scope', '$element', '$timeout', function($scope, $element, $timeout){
                $timeout(function(){
                    $element.focus();
                    $element.select();
                }, 0);
                $element.on('blur', function(){
                    $scope.$apply(function(){
                        if($scope.homeC.selectedClass){
                            !$scope.homeC.selectedClass.name
                                ? $scope.homeC.selectedClass.name = $scope.homeC.EditedClassNameBackUp
                                : '';
                        }
                        if($scope.homeC.selectedStudent){
                            !$scope.homeC.selectedStudent.name
                                ? $scope.homeC.selectedStudent.name = $scope.homeC.EditedSrtudentNameBackUp
                                : '';
                        }
                        $scope.homeC.isEditClassName = false;
                        $scope.homeC.isEditStudentName = false
                    });
                })
            }]
        }
    }]).
    directive('newStudent', [function(){
        return {
            restrict: 'A',
            scope: true,
            controller: ['$scope', '$element', '$attrs', '$parse', function($scope, $element, $attrs, $parse){
                $scope.student = $parse($attrs['newStudent'])($scope);
                if(!$scope.homeC.selectedClass.newStudents || $scope.homeC.selectedClass.newStudents.length === 0){
                    return;
                }
                for(var i = 0, j = $scope.homeC.selectedClass.newStudents.length; i < j; i++){
                    if($scope.student.username === $scope.homeC.selectedClass.newStudents[i].username){
                        $element.append('<span class="label label-danger">新</span>');
                        return;
                    }
                }
            }]
        }
    }]).
    directive('copyInteractive', [function(){
        return {
            restrict: 'A',
            scope: true,
            controller: ['$scope', '$timeout', function($scope, $timeout){
                $scope.$on('copyDone', function(){
                    $scope.$apply(function(){
                        $scope.homeC.showCopySuccess = true;
                    });
                    $timeout(function(){
                        $scope.homeC.showCopySuccess = false;
                    }, 800);
                });
            }]
        }
    }]).
    directive('ghExistInRoom', [
        function() {
            return {
                require: 'ngModel',
                link: function(scope, ele, attrs, ctrl) {
                    ele.on('blur', function() {
                        for(var i = 0, j = scope.currentClass.students.length; i < j; i++){
                            if(scope.currentClass.students[i].username === scope.newStudent.username){
                                ctrl.$setValidity('exist', false);
                                return;
                            }
                        }
                        ctrl.$setValidity('exist', true);
                    });
                    ele.on('focus', function(){
                        ctrl.$setValidity('exist', true);
                    });
                }
            }
        }
    ]).
    directive('notHaveSchool', [function(){
        return {
            restrict: 'A',
            scope: true,
            controller: ['$scope', '$element', function($scope, $element){
                $scope.$on('noSchool', function(){
                    $('.animated').addClass('hinge');
                });
            }]
        }
    }])