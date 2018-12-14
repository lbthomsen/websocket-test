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

    app.factory("WsService", ["$log", "$websocket",
        function ($log, $webscoket) {
            $log.debug("WsService: starting");

            var protocol;
            if ($location.$$protocol === "https")
                protocol = "wss";
            else
                protocol = "ws";

            var ws = $websocket(protocol + "://" + $location.$$host + ":" + $location.$$port + "/echo");

            ws.onMessage(function (wsPayload) {
                $log.debug("MessageService: onMessage - received: %o", wsPayload);
                if (wsPayload.type === "message") {
                    $log.debug("MessageService: it's a message = %o", wsPayload.data);
                    var message = JSON.parse(wsPayload.data);
                    if (message && message.type) {
                        $log.debug("MessageService: sending event %o = %o", message.type, message);
                        $rootScope.$broadcast(message.type, message);
                    }
                }
            });

        }
    ]);

})();
/**
 * vim: ts=4 et nowrap autoindent
 */