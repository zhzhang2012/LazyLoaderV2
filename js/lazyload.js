/**
 * Created with JetBrains WebStorm.
 * User: Tony_Zhang
 * Date: 13-7-18
 * Time: 下午2:57
 * To change this template use File | Settings | File Templates.
 */

//LazyLoader Service
(function(module){

    var LazyLoader = function($q,$timeout){

        var loaderTask,
            loaderUI,
            loaderSuccess,
            loaderError,
            showProcess = false,
            loaderEvent,
            showTransition = false,
            tansitionMain;


        //mutators
        var setTask = function(task){
            loaderTask = task;
        }

        var setLoaderUI = function(ui){
            loaderUI = ui;
        }

        var setSuccess = function(success){
            loaderSuccess = success;
        }

        var setError = function(error){
            loaderError = error;
        }

        var shouldShowProcess = function(showprocess, eventType){
            showProcess = showprocess;
            loaderEvent = eventType;
        }

        var shouldShowTransition = function(showtransition,tansitionmain){
            showTransition = showtransition;
            tansitionMain = tansitionmain;
        }

        //loading process
        var startLoading = function($scope){

            if(showTransition){
                PageTransitions.init(tansitionMain);
            }

            //doing task
            var taskPromise = loaderTask();

            var deferred = $q.defer();
            var promise = deferred.promise;

            //show the loading UI
            $timeout(function(){

                if(showProcess){
                    $scope.$on(loaderEvent,function(event,data){
                        loaderUI(data);
                        //console.log(data);
                    })

                }else{
                    loaderUI();
                }

            },0);

            //success callbacks and error handling
            $timeout(function(){

                //angularJS callbacks
                if(typeof taskPromise.success === "function"){

                    taskPromise.success(function(data, status, headers, config){
                        if(showTransition){
                            PageTransitions.nextPage(parseInt(Math.random() * 67 + 1));
                        }
                        loaderSuccess(data);

                    });
                    taskPromise.error(function(reason, status, headers, config){
                        if(showTransition){
                            PageTransitions.nextPage(parseInt(Math.random() * 67 + 1));
                        }
                        loaderError(reason);

                    });

                //jquery callbacks
                }else{

                    taskPromise.done(function(data, status, headers, config){
                        if(showTransition){
                            PageTransitions.nextPage(parseInt(Math.random() * 67 + 1));
                        }
                        loaderSuccess(data);

                    });
                    taskPromise.fail(function(reason, status, headers, config){
                        if(showTransition){
                            PageTransitions.nextPage(parseInt(Math.random() * 67 + 1));
                        }
                        loaderError(reason);

                    });
                }

                deferred.resolve();

            },2000);

            return promise;
        }

        return {
            setTask: setTask,
            setLoaderUI: setLoaderUI,
            setSuccess: setSuccess,
            setError: setError,
            showProcess: shouldShowProcess,
            showTransition: shouldShowTransition,
            startLoading: startLoading
        }

    }

    module.factory("LazyLoader",['$q', '$timeout', LazyLoader]);

})(angular.module("loaderApp",[]));


//testing
var loaderCtrl = function($scope, $http, $timeout, LazyLoader){
    LazyLoader.setTask(function(){
        //var promise = $http({method: 'GET', url: 'data.json'})
        var promise = $.ajax({method: 'GET', url: 'data.json'});

       /* $timeout(function(){
            $scope.$emit("progress",function(){
                promise.notify();
            })
        },10);*/

        return promise;
    })

    //LazyLoader.showProcess(true,"progress");

    LazyLoader.setLoaderUI(function(process){
        $scope.loadingMes = true;
        $scope.progress = process;

    })

    LazyLoader.setSuccess(function(data){
        $scope.loadingMes = false;
        $scope.result = data;
    })

    LazyLoader.setError(function(reason){
        $scope.alertBox = true;
        $scope.alert = reason;
    })

    //LazyLoader.showTransition(true,$('#loaderContainer'));
    LazyLoader.showTransition(true,$('#loaderContainer'));

    $scope.loading = function(){
        $scope.start = true;
        LazyLoader.startLoading($scope);
    }



}


