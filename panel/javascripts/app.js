console.log("app.js loaded");

var myApp = angular.module('videoAutomation', ['ngMaterial', 'ui.router', 'ngAnimate', 'ngDraggable'])

.run(
  ['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {

            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
    }
  ]
)

.config(
  ['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {

        ///Theme 
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey', {
                'default': '500',
                'hue-1': '300',
                'hue-2': '800',
                'hue-3': '50'
            })
            // If you specify less than all of the keys, it will inherit from the
            // default shades
            .accentPalette('deep-purple', {
                'default': '500',
                'hue-1': '300',
                'hue-2': '800',
                'hue-3': 'A100'
            });

        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
        $urlRouterProvider.otherwise('/manual');

        $stateProvider
            .state('manual', {
                abstract: true,
                url: '/manual',
                templateUrl: '/panel/pages/manual.html',
                controller: 'manualCtrl'
            })
            .state('manual.instructions', {
                url: '',
                templateUrl: '/panel/pages/manual.instructions.html'
            })
            .state('manual.imageDetails', {
                url: '/images/{id:[0-9]{1,4}}',
                templateUrl: '/panel/pages/manual.image_slide_details.html',
                controller: 'imageDetailsController'
            })
            .state('manual.transitionDetails', {
                url: '/transitions/{id:[0-9]{1,4}}',
                templateUrl: '/panel/pages/manual.transition_slide_details.html',
                controller: 'transitionDetailsController'
            })
            .state('videos', {
                url: '/videos',
                templateUrl: '/panel/pages/customerVideosManager.html',
                controller: 'customerVideosManagerCtrl'
            })
            .state('home', {
                url: '/dashboard',
                templateUrl: '/panel/pages/dashboard.html',
                controller: 'dashboardManagerCtrl'
            })
  }]);

myApp.controller('dashboardManagerCtrl', ['$scope', '$rootScope', '$state', '$mdSidenav', function ($scope, $rootScope, $state, $mdSidenav) {

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {
        'packages': ['corechart', 'gauge']
    });

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {

        // Create the data table.
        var PieChartData = new google.visualization.DataTable();
        PieChartData.addColumn('string', 'Source');
        PieChartData.addColumn('number', 'Videos');
        PieChartData.addRows([
          ['From URL', 378],
          ['Phrase', 144],
          ['Studio', 52]
        ]);

        // Set chart options
        var PieChartOptions = {
            'title': 'Videos Source'
                //            'width': 400,
                //            'height': 300
        };


        var LineChartData = google.visualization.arrayToDataTable([
          ['Month', 'URL', 'Phrase', 'Studio'],
            ['March', 1000, 400, 32],
          ['April', 1170, 460, 38],
          ['May', 660, 1120, 55],
          ['June', 1030, 540, 53]
        ]);

        var LineChartOptions = {
            title: 'Video Production',
            curveType: 'function',
            legend: {
                position: 'bottom'
            }
        };

        var LineChart = new google.visualization.LineChart(document.getElementById('curve_chart'));
        LineChart.draw(LineChartData, LineChartOptions);

        // Instantiate and draw our chart, passing in some options.
        var PieChart = new google.visualization.PieChart(document.getElementById('chart_div'));
        PieChart.draw(PieChartData, PieChartOptions);
    }

}]);

myApp.controller('sideNavCtrl', ['$scope', '$rootScope', '$state', '$mdSidenav', function ($scope, $rootScope, $state, $mdSidenav) {

    $scope.closeSideNav = function () {
        $mdSidenav('left').close();
    }

    $scope.goToTest = function () {
        $rootScope.$broadcast('hideTabs');
        $state.go('test');
    }
    $scope.goToMyVideos = function () {
        $rootScope.$broadcast('hideTabs');
        $state.go('videos');
    }
    $scope.goToAutomatic = function () {
        $rootScope.$broadcast('goToAutomatic');
    }
    $scope.goToStudio = function () {
        $rootScope.$broadcast('goToStudio');
    }
    $scope.goToHome = function () {
        $rootScope.$broadcast('goToHome');
    }

}]);

myApp.controller('toolBarCtrl', ['$rootScope', '$scope', '$mdSidenav', function ($rootScope, $scope, $mdSidenav) {

    $scope.goToHome = function () {
        $rootScope.$broadcast('goToHome');
    }
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
        return function () {
            $mdSidenav(componentId).toggle();
        };
    }

}]);


myApp.controller('customerVideosManagerCtrl', ['$scope', '$rootScope', '$state', '$mdDialog', 'videoService', function ($scope, $rootScope, $state, $mdDialog, videoService) {

    $scope.videoHistoryList = [];

    videoService.getVideoHistoryList()
        .then((res) => {
            $scope.videoHistoryList = res;
            $scope.$digest();
        });

    $scope.takeToStudio = function (index) {

        videoService.loadVideoDetailsToStudio(index);

        $rootScope.$broadcast('goToStudio');

    }

    $scope.playVideo = function (ev, index) {

        $mdDialog.index = index;
        $mdDialog.show({
            controller: playVideoDialogController,
            templateUrl: 'pages/play_video_dialog.html',
            //parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
    };

    /*
    Deprecated
    */
    $scope.showDetails = function (ev, index) {

        $mdDialog.index = index;
        $mdDialog.show({
            controller: detailsDialogController,
            templateUrl: 'pages/video_details_dialog.html',
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
    };

    $scope.getVideoStatus = function (index) {

            var statusMap = {
                '-1': 'Request approved',
                '0': 'Proccessing',
                '1': 'Ready',
                '2': 'Failed'
            };
            return statusMap[$scope.videoHistoryList[index].metadata.state];
        }
        /*
        Deprecated
        */
    function detailsDialogController($scope, $mdDialog) {
        $scope.video = videoService.getVideoByIndex($mdDialog.index);

        $scope.getVideoStatus = function () {
            var statusMap = {
                '-1': 'Request approved',
                '0': 'Proccessing',
                '1': 'Ready',
                '2': 'Failed'
            };
            return statusMap[$scope.video.metadata.state];
        }

        $scope.takeToStudio = function () {

            videoService.loadVideoDetailsToStudio($mdDialog.index);

            $rootScope.$broadcast('goToStudio');

            $mdDialog.hide();

        }

        $scope.closeDialog = function () {
            $mdDialog.hide();
        }
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    }

    function playVideoDialogController($scope, $mdDialog) {

        console.log(`playVideoDialogController:: $mdDialog.index = ${$mdDialog.index}`);

        $scope.video = videoService.getVideoByIndex($mdDialog.index);

        console.log(`playVideoDialogController:: $scope.video.metadata.link = ${$scope.video.metadata.link}`);

        $scope.closeDialog = function () {
            $mdDialog.hide();
        }
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    }

}]);

myApp.controller('imageDetailsController', ['$scope', '$state', '$stateParams', 'videoService', function ($scope, $state, $stateParams, videoService) {

    $scope.fontSizeList = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
    $scope.fontList = ['Arial', 'Calibri', 'Cambria', 'Comic Sans MS', 'Georgia', 'Open Sans', 'Times New Roman'];

    $scope.item = videoService.getSlide($stateParams.id);

}])

myApp.controller('transitionDetailsController', ['$scope', '$state', '$stateParams', 'videoService', function ($scope, $state, $stateParams, videoService) {

    $scope.item = videoService.getSlide($stateParams.id);

    $scope.id = $stateParams.id / 2 + 1 / 2;
}])


myApp.controller('manualCtrl', ['$scope', '$state', '$timeout', '$mdDialog', 'videoService', function ($scope, $state, $timeout, $mdDialog, videoService) {

    $scope.sentencesRepo = [];

    $scope.spy_enabled = false;

    //for the spy button
    $scope.myVar = "md-icon-button md-accent md-hue-3";

    var uploadClicks = 0;
    
    $scope.removeSentenceFromRepo = function(index) {
        $scope.sentencesRepo.splice(index, 1);
    }
    
    $scope.toggle_spy = function () {
            if (!$scope.spy_enabled) {
                browser.tabs.query({
                    currentWindow: false,
                    active: true
                }).then((tabs) => {
                    browser.tabs.sendMessage(
                        tabs[0].id, {
                            id: 0,
                            name: "start_spy"
                        }
                    ).then(() => {
                        $scope.spy_enabled = !$scope.spy_enabled;
                        $scope.myVar = "md-icon-button md-accent";
                    }).catch();
                })
            } else {
                browser.tabs.query({
                    currentWindow: false,
                    active: true
                }).then((tabs) => {
                    browser.tabs.sendMessage(
                        tabs[0].id, {
                            id: 1,
                            name: "stop_spy"
                        }
                    ).then(() => {
                        $scope.spy_enabled = !$scope.spy_enabled;
                        $scope.myVar = "md-icon-button md-accent md-hue-3";
                    }).catch();
                })
            }
        }

    $scope.selectedIndex = null;

    $scope.video = videoService.manualVideo;
    //$scope.slides = $scope.video.slides;

    $scope.slides = videoService.getSlides();

    $scope.onDropComplete = function (data, evt) {
        //$scope.sentencesRepo.splice($scope.sentencesRepo.indexOf(data), 1);
        $scope.slides[this.$index].caption.text = data;
    }

    $scope.$watch('selectedIndex', function (newValue, oldValue) {
        if (newValue != oldValue && newValue != null && oldValue == null) {
            //console.log('Ohh ohhhhh');
            $scope.goToSlideDetails(newValue, 0);
        }

    });

    $scope.goToSlideDetails = function (id, type) {
        $scope.selectedIndex = id;
        let state = type == 0 ? 'manual.imageDetails' : 'manual.transitionDetails';
        $state.go(state, {
            id: id
        });
    }

    $scope.clearList = function () {
        $scope.sentencesRepo = [];
        videoService.clearSlidesList();
        console.log($scope.slides);
        $scope.slides = [];
        $state.go('manual.instructions');
    }

    $scope.uploadFile = function (event) {
        uploadClicks++;
        //        if (uploadClicks == 1)
        //            $scope.selectedIndex = 0;
        if ($scope.slides.length == 0)
            $scope.selectedIndex = 0;
        videoService.uploadEvenet(event).then(() => {
            $scope.slides = videoService.getSlides();
            $scope.$digest();
        });

    }; //end of uploadFile 

    $scope.removeItem = function (index) {
        $timeout(() => {
            //Removing from end of the list
            if (index == $scope.slides.length - 1) {
                if ($scope.selectedIndex == index || $scope.selectedIndex == index - 1)
                    $scope.selectedIndex = index - 2;
                $scope.slides.splice(index - 1, 2);
                $scope.goToSlideDetails(index - 2, 0);
            }
            //Removing from middle or first
            else {
                $scope.slides.splice(index, 2);
                if ($scope.selectedIndex == index || $scope.selectedIndex == index + 1)
                    $scope.goToSlideDetails(index, 0);
            }
            //Removing last one
            if ($scope.slides.length == 0)
                $scope.selectedIndex = null;
        }, 300);

    }

    $scope.moveUpItem = function (index) {
        $timeout(() => {
            swipe(index, index - 2);
            if ($scope.selectedIndex == index) {
                $scope.selectedIndex = index - 2;
                $scope.goToSlideDetails(index - 2, 0);
            } else if ($scope.selectedIndex == index - 2) {
                $scope.selectedIndex += 2;
                $scope.goToSlideDetails(index, 0);
            }
        }, 500);

    }

    $scope.moveDownItem = function (index) {
        $timeout(() => {
            swipe(index, index + 2);
            if ($scope.selectedIndex == index) {
                $scope.selectedIndex = index + 2;
                $scope.goToSlideDetails(index + 2, 0);
            } else if ($scope.selectedIndex == index + 2) {
                $scope.selectedIndex -= 2;
                $scope.goToSlideDetails(index, 0);
            }
        }, 300);

    }

    var swipe = function (origin, dest) {
        var temp = $scope.slides[dest];
        $scope.slides[dest] = $scope.slides[origin];
        $scope.slides[origin] = temp;
    }

    $scope.showConfirmGenerateVideo = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Would you like to generate the video now?')
            .textContent('Please make sure you set all your preferences.')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Please do it!')
            .cancel('Let me check again');

        $mdDialog.show(confirm).then(function () {
            videoService.generateVideo();
        }, function () {
            //dismiss
        });
    };

    var handleMessage = function (request, sender, sendResponse) {
        switch (request.type) {
            case 0:
                if (request.option === 0) {
                    //add element
                    if (request.element.type === 1) {
                        //img
                        videoService.addSlideFromScannerImg(request.element);
                        $scope.slides = videoService.getSlides();
                        $scope.$digest();
                    } else {
                        $scope.$apply(function () {
                            $scope.sentencesRepo.push(request.element.innerHTML);
                        });
                    }
                } else {
                    //remove element
                    if (request.element.type === 1) {
                        //TODO

                    } else {
                        $scope.$apply(function () {
                            $scope.sentencesRepo.splice($scope.sentencesRepo.indexOf(request.element.innerHTML), 1);
                        });
                    }
                }
                break;
        } //end of switch
    }
    
    $scope.shuffle = function() {
        let counter = 0;
        $scope.sentencesRepo.forEach((sentence, index)=>{
            for (let i=0; i<$scope.slides.length/2; i++) {
                if ($scope.slides[i*2].caption.text === null) {
                    $scope.slides[i*2].caption.text = sentence;
                    counter++;
                    break;
                }
            }
        })
        //$scope.sentencesRepo.splice(0, counter);
        
    }

    browser.runtime.onMessage.addListener(handleMessage);

}]);


myApp.factory('videoService', ['$rootScope', '$state', function ($rootScope, $state) {

    var updateVideoIndex = 0;
    var socket = io.connect('http://localhost:3000');
    //var socket = io.connect('http://ec2-35-162-54-141.us-west-2.compute.amazonaws.com:3000');

    socket.on('connection approved', function (data) {
        //console.log('connection approved ' + data);
    });

    socket.on('update', function (video) {
        for (updateVideoIndex = 0; updateVideoIndex < historyList.length; updateVideoIndex++) {
            if (historyList[updateVideoIndex].videoName === video.videoName &&
                historyList[updateVideoIndex].clientName === video.clientName) {
                historyList[updateVideoIndex] = video;
                break;
            }
        }
        $rootScope.$digest();
    });


    var video = {
        files: [],
        name: null,
        slides: [] //slides includes transitions
    };

    /*
    Each object in this list should contain:
    videoName, date, link, inProgress (T/F)
    */
    var historyList = [];

    var loadVideoDetailsToStudio = function (index) {
        video.slides = historyList[index].info.slidesInfo;
        video.name = historyList[index].videoName;
    }

    var getVideoHistoryList = function () {

        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {

                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

                    historyList = JSON.parse(xhr.responseText);
                    $rootScope.$digest();
                    resolve(historyList);
                }

            };
            xhr.open("GET", `/res/videos/all`, true);
            xhr.send();
        });
    }

    var getLink = function (index) {
        return historyList[index].metadata.link;
    }

    var getVideoByIndex = function (index) {
        return historyList[index];
    }

    var clearSlidesList = function () {
        video.slides = [];
    }

    var addSlideFromScannerImg = function (imgElement) {
        $rootScope.$apply(() => {

            if (video.slides.length != 0)
                video.slides.push({
                    type: 1, // 1 for Blend
                    fileName: 'Transition',
                    thumbnail: 'images/transition.jpg',
                    duration: 2,
                    effect: {
                        //0 - blend, 1 - uncover
                        type: 0,
                        uncover: null //0-left, 1-right, 2-down
                    }
                });

            video.slides.push({
                type: 0, // 0 for image
                fileName: null,
                //                        file: files[index],
                caption: {
                    text: null,
                    font: "Calibri",
                    fontsize: 11,
                    bold: false,
                    italic: false,
                    effect: 0, // 0 - None, 1 - Sliding Right, 2 - FadeInOit
                    startTime: 0,
                    duration: 0
                },
                tts: {
                    enable: false
                },
                thumbnail: imgElement.src,
                zoom: {
                    enabled: true,
                    style: 1 // 0-zoom to center. 1-zoom to random place near center
                },
                duration: 10
            })
        })
    }

    var readAndPreview = function (file, index) {

        return new Promise((resolve, reject) => {
            // Make sure `file.name` matches our extensions criteria
            if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
                console.log('fileNmae is: ' + file.name);
                console.log('-------');
                var reader = new FileReader();

                reader.addEventListener("load", function () {
                    //push Image objects
                    video.slides.push({
                        type: 0, // 0 for image
                        fileName: file.name,
                        //                        file: files[index],
                        caption: {
                            text: null,
                            font: "Calibri",
                            fontsize: 11,
                            bold: false,
                            italic: false,
                            effect: 0, // 0 - None, 1 - Sliding Right, 2 - FadeInOit
                            startTime: 0,
                            duration: 0
                        },
                        tts: {
                            enable: false
                        },
                        thumbnail: this.result,
                        zoom: {
                            enabled: true,
                            style: 1 // 0-zoom to center. 1-zoom to random place near center
                        },
                        duration: 10
                    })
                    video.files.push(files[index]);
                    resolve();
                }, false);

                reader.readAsDataURL(file);

            } else reject('Not an image file');
        });

    };

    var saveAllFiles = function (files) {
        var ik = [];
        if (files) {
            for (let i = 0; i < files.length; i++) {
                ik.push(readAndPreview(files[i], i));
            }
            return Promise.all(ik);
        } else
            return Promise.reject('No Files');
    };

    var insertTransitionObjects = function () {
        for (let j = 0; j < video.slides.length - 1; j++) {
            if (video.slides[j].type == 0 && video.slides[j + 1].type == 0) {
                //Push (splice) Transition objects
                video.slides.splice(j + 1, 0, {
                    type: 1, // 1 for Blend
                    fileName: 'Transition',
                    thumbnail: 'images/transition.jpg',
                    duration: 2,
                    effect: {
                        //0 - blend, 1 - uncover
                        type: 0,
                        uncover: null //0-left, 1-right, 2-down
                    }
                });
            }
        }
        return Promise.resolve;
    };

    var uploadEvenet = function (event) {
        return new Promise((resolve, reject) => {

            files = event.target.files;

            saveAllFiles(files)
                .then(() => {
                    return insertTransitionObjects();
                })
                .then(() => {
                    resolve(0);
                });
        });

    };

    var getSlides = function () {
        return video.slides;
    };

    var getSlide = function (id) {
        return video.slides[id];
    }

    var formatDate = function (date) {
            var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
        ];

            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();

            return day + ' ' + monthNames[monthIndex] + ' ' + year;
        }
        /*
        Called from automatic
        */
    var generateAutomaticVideo = function (phrase) {
            console.log('videoService::generateAutomaticVideo:: phrase = ' + phrase);

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {

                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

                    var jsonResponse = JSON.parse(xhr.responseText);

                    historyList.push(jsonResponse);

                    $rootScope.$digest();

                    $rootScope.$broadcast('hideTabs');
                    $state.go('videos');
                } else {
                    //TODO - Prompt error
                }
            };
            xhr.open("GET", `/autogen/?q=${phrase}`, true);
            xhr.send();
        }
        /*
        Called from studio
        */
    var generateVideo = function () {

        var m_index = historyList.push({
            videoName: 'Unknown',
            date: formatDate(new Date()),
            link: '',
            inProgress: true
        }) - 1;

        var slidesClean = [];

        for (let i = 0; i < video.slides.length; i++) {
            if (i % 2 == 0)
                slidesClean.push(_.pick(video.slides[i], ['type', 'fileName', 'caption', 'zoom', 'duration', 'tts']));
            else
                slidesClean.push(_.pick(video.slides[i], ['type', 'effect', 'duration']));
        }

        //        var dataToBackEnd = {
        //            videoName: video.name,
        //            slidesInfo: slidesClean
        //        };
        var dataToBackEnd = {
            clientName: 'Sagi',
            videoName: video.name,
            metadata: {
                origin: 0, // 0 - manual(studio), 1 - phrase, 2 - URL
                phrase: null,
                determinedTopic: null, //the extracted topic from phrase or URL
                url: null,
                name: video.name,
                timeCreated: formatDate(new Date()), //The request
                ffmpegProcessDuration: null,
                link: null, //link to final video
                state: -1, // -1 - Init, 0 - InProgress, 1 - Ready, 2 - Failed
                inProgress: false
            },
            info: {
                tempFolder: null,
                audio: {
                    enable: true,
                    file_path: 'assets/bg_music_0.mp3'
                },
                slidesInfo: slidesClean
            }
        };

        var formData = new FormData();
        for (let i = 0; i < video.files.length; i++)
            formData.append('images', video.files[i], video.files[i].name);


        formData.append('info', JSON.stringify(dataToBackEnd));
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {

            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                historyList[m_index].link = xhr.responseText;
                historyList[m_index].inProgress = false;
                $rootScope.$digest();
                console.log("xhr.responseText is: " + xhr.responseText);

                console.log('------00000-----');
                $rootScope.$broadcast('hideTabs');
                $state.go('videos');
            } else {
                //TODO Prompt erroe
            }
        };

        xhr.open("POST", "/manualgen", true);
        xhr.send(formData);


    }

    return {
        uploadEvenet: uploadEvenet,
        getSlides: getSlides,
        getSlide: getSlide,
        manualVideo: video,
        clearSlidesList: clearSlidesList,
        generateVideo: generateVideo,
        generateAutomaticVideo: generateAutomaticVideo,
        getVideoHistoryList: getVideoHistoryList,
        getLink: getLink,
        getVideoByIndex: getVideoByIndex,
        loadVideoDetailsToStudio: loadVideoDetailsToStudio,
        addSlideFromScannerImg: addSlideFromScannerImg
    };
            }])


myApp.directive('customOnChange', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnChange);
            element.bind('change', onChangeHandler);
        }
    };
});

myApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
