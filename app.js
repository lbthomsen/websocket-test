/**
 * Websocket Test
 */
(function () {

    var appName = "websocket-test";

    var app = angular.module(appName, [
        "ngWebSocket"
    ]);

    app.run(["$log",
        function ($log) {
            $log.debug(appName + " starting");
        }
    ]);

    app.factory("WsService", ["$log", "$rootScope", "$location", "$websocket",
        function ($log, $rootScope, $location, $websocket) {
            $log.debug("WsService: starting");

            var protocol;
            if ($location.$$protocol === "https")
                protocol = "wss";
            else
                protocol = "ws";

                var ws = $websocket(protocol + "://" + $location.$$host + ":" + $location.$$port + "/echo");

            var me = {
                send: function(msg) {
                    ws.send(msg);
                }
            };

            ws.onMessage(function (wsPayload) {
                $log.debug("MessageService: onMessage - received: %o", wsPayload);
                $rootScope.$broadcast("WsMessage", wsPayload);
            });

            return me;

        }
    ]);

    app.controller("WsTestController", ["$log", "$scope", "$interval", "WsService", 
        function($log, $scope, $interval, wsService) {
            $log.debug("WsTestController: starting");

            var that = this;
            that.messages = [];

            that.expire = function() {
                while (that.messages.length > 20) that.messages.pop(); // Reduce length
            }

            $scope.$on("WsMessage", function(type, message) {
                $log.debug("WsTestController: got message: %o", message.data);
                that.messages.unshift({
                    type: "Receive", 
                    timestamp: new Date(), 
                    message: message.data
                });
                that.expire();
            })

            $interval(function() {
                var msg = "Hello server - time is: " + new Date().getTime();
                that.messages.unshift({
                    type: "Send", 
                    timestamp: new Date(), 
                    message: msg
                });
                that.expire();
                wsService.send(msg);
            }, 1000);
        }
    ]);

    app.directive("wsTest", [
        function() {
            return {
                restrict: "E", 
                replace: true, 
                templateUrl: "ws-test.directive.html", 
                controller: "WsTestController", 
                controllerAs: "wsTestCtrl"
            }
        }
    ]);

})();
/**
 * vim: ts=4 et nowrap autoindent
 */