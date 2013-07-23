/**
 * Created with JetBrains WebStorm.
 * User: Tony_Zhang
 * Date: 13-7-18
 * Time: 下午2:57
 * To change this template use File | Settings | File Templates.
 */

//testing
var loaderCtrl = function ($scope, $http, $q, $timeout, LazyLoader) {
    LazyLoader.setTask(function () {
        //angularjs task
        //var promise = $http({method: 'GET', url: 'data.json'})

        //jquery task
        //var promise = $.ajax({method: 'GET', url: 'data.json'});
        //return promise;


        //XMLHttpRequest task
        var deferred = $q.defer();

        var xhr = new XMLHttpRequest();
        xhr.open('GET','bigdata.mov',true);

        xhr.onprogress = function(event){
            console.log(event.total);
            if(event.lengthComputable){
                var percentage = Math.round((event.loaded / event.total) * 100);
                $scope.$emit("progress",percentage);
            }

        };

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    $scope.$apply(deferred.resolve("Loading Complete"));
                }else{
                    $scope.$apply(deferred.reject("An error occured during loading!"));
                }
            }
        };

        xhr.send();

        return deferred.promise;
    })

    LazyLoader.showProcess(true,"progress");

    LazyLoader.setLoaderUI(function (opt_process) {
        $scope.loadingMes = true;
        $scope.progress = opt_process + "%";

    })

    LazyLoader.setSuccess(function (data) {
        $scope.loadingMes = false;
        $scope.result = data;
    })

    LazyLoader.setError(function (reason) {
        $scope.alertBox = true;
        $scope.alert = reason;
    })

    //loaderContainer is the div that contains several divs to transit
    LazyLoader.showTransition(true, $('#loaderContainer'));

    $scope.loading = function () {
        $scope.start = true;
        LazyLoader.startLoading($scope);
    }


}


