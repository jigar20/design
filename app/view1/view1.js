/*** 
//- all business logic will be in service & not in controller 
//- put your logic & data in corresponding section only
//- all variables & function name must be in camelcase & should represent what it will do
//- add comment on every function about what it will do   
***/

(function() {
    'use strict';

    angular
        .module('myApp')
        .controller('aboutCtrl', aboutCtrl);

    function aboutCtrl($scope, $state, crudService, usersRoleModuleService, toastr, $uibModal, aboutService) {

        //- ********************************* default variables/tasks begin here *************************** //

        $scope.showSaveBtn = true;
        $scope.showEditBtn = false;


        $scope.saveText = "Save";
        $scope.updateText = "Update";

        $scope.bulkRecords = [];
        $scope.showRecordsArray = [10, 20, 50, 100, 200, 500]; //-limit records array
        $scope.allowFileExtensions = ['jpeg', 'jpg', 'png']; //- File Uploading directive allow extesions

        $scope.paginationObject = {
            keyword: "",
            searchBy: ["name"],
            recordLimit: 10,
            modelName: "About",
            page: 1,
            paginationData: []
        }; //- pagination object

        var validationObj = {
            firstName: {
                required: true,
                pattern: "/^[A-z]+$/",
                type: "string"
            },
            lastName: {
                required: true,
                pattern: "/^[A-z]+$/",
                type: "string"
            },
            email: {
                required: true,
                pattern: "/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/",
                type: "email"
            }, //- Email pattern : https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
            mobile: {
                required: true,
                pattern: "/^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/",
                type: "number"
            }
        };

        //- ********************************* default functions begin here  ******************************** //
        //- Get User create, read, update, delete role
        $scope.role = {};
        if (authentication == "true") {
            usersRoleModuleService.getUserCrudRole('About', '', function(role) {
                if (_.isUndefined(role)) {
                    $state.go("login");
                } else {
                    if (role.read == false) {
                        $state.go("login");
                    } else {
                        $scope.role = role;
                    }
                }
            });
        } else {
            usersRoleModuleService.getAllRoles(function(role) {
                $scope.role = role;
            });
        }

        //- ********************************* functions to be triggered form view begin here *************** // 

        $scope.addAboutModal = function() {
            $scope.showSaveBtn = true;
            $scope.showEditBtn = false;
            $scope.saveText = "Save";
            $scope.updateText = "Update";
            $scope.aboutObj = {};
            $scope.validationObj = {};

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/appModules/about/modal/addEditAboutModal.html',
                scope: $scope,
                size: 'lg'
            });
        }

        $scope.addAbout = function(record) {
            crudService.checkInputValidation(validationObj, record, function(validationObj) {
                if (validationObj.errorCount == 0) {
                    $scope.saveText = "";
                    $scope.updateText = "";
                    crudService.saveRecord('About', record, function(data) {
                        $scope.$broadcast('paginationEvent', data);
                        toastr.success('Created Sucessfully');
                    });
                    $scope.cancelModal();
                } else {
                    $scope.saveText = "Save";
                    $scope.updateText = "Update";
                    $scope.validationObj = validationObj;
                    toastr.error('Please Fill Form Properly');
                }
            });
        }

        $scope.updateAboutModal = function(recordToUpdate) {
            $scope.showSaveBtn = false;
            $scope.showEditBtn = true;
            $scope.saveText = "Save";
            $scope.updateText = "Update";
            crudService.findOneRecord('About', {
                _id: recordToUpdate._id
            }, function(data) {
                if (_.isEmpty(data)) {
                    $scope.cancelModal();
                    toastr.error("There was an error while finding record. Please try again!.");
                } else {

                    $scope.aboutObj = data.data;
                }
            });
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/appModules/about/modal/addEditAboutModal.html',
                scope: $scope,
                size: 'lg'
            });
        }

        $scope.updateAbout = function(recordToUpdate) {
            $scope.saveText = "";
            $scope.updateText = "";
            aboutService.checkAboutValidation(recordToUpdate, function(tempObj) {
                if (tempObj.errorCount == 0) {
                    var formData = {};
                    formData._id = recordToUpdate._id;
                    formData.updateData = recordToUpdate;
                    crudService.updateRecord('About', formData, function(data) {
                        $scope.$broadcast('paginationEvent', data);
                        toastr.success('Updated Sucessfully');
                    });
                    $scope.cancelModal();
                } else {
                    $scope.saveText = "Save";
                    $scope.updateText = "Update";
                    $scope.validationObj = tempObj;
                    toastr.error('Please Fill Form Properly');
                }
            });

        }

        $scope.selectRecord = function(checkboxStatus, id) {

            crudService.selectRecord(checkboxStatus, id, function(data) {
                $scope.bulkRecords = data;
            });

        }

        $scope.selectAllRecords = function(records, checkboxStatus) {

            crudService.selectAllRecords(records, checkboxStatus, function(data) {
                $scope.bulkRecords = data;
            });

        }

        $scope.deleteConfirmationModal = function(records) {

            $scope.recordsToDelete = records;
            $scope.functionToCall = "deleteAbouts";
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/appModules/deleteConfirmationModal.html',
                scope: $scope,
                size: 'md'
            });

        }

        $scope.deleteAbouts = function(records) {
            crudService.deleteRecords('About', records, function(data) {
                $scope.$broadcast('paginationEvent', data);
                toastr.success('Deleted Sucessfully');
                $scope.cancelModal();
                $scope.bulkRecords = [];
                $scope.selectedAll = false;
            });
        }

        //-cancel/dismiss modal
        $scope.cancelModal = function() {
            $scope.modalInstance.dismiss();
            $scope.$broadcast('paginationEvent');
        }

        //- ********************************* init all default functions begin here ************************ //
        //- Initilize the default function in this section only
        $scope.init = function() {
            console.log('inside');
        }
        $scope.init();

    }

})();