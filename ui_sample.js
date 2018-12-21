/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    function HTML(config) {
        var html = String.raw`
<div>
  <div ng-if="flag">True</div>
  <div ng-if="!flag">False</div>
</div>
`;
        return html;
    };

    var ui = undefined;
    function SampleNode(config) {
        try {
            var node = this;
            if(ui === undefined) {
                ui = RED.require("node-red-dashboard")(RED);
            }
            RED.nodes.createNode(this, config);
            var done = null;
            var html = HTML(config);
            done = ui.addWidget({
                node: node,
                width: config.width,
                height: config.height,
                format: html,
                templateScope: "local",
                group: config.group,
                emitOnlyNewValues: false,
                forwardInputMessages: false,
                storeFrontEndInputAsState: false,
                convertBack: function (value) {
                    return value;
                },
                beforeEmit: function(msg, value) {
                    return { msg: msg };
                },
                beforeSend: function (msg, orig) {
                    if (orig) {
                        return orig.msg;
                    }
                },
                initController: function($scope, events) {
                    $scope.flag = true;
                    $scope.$watch('msg', function(msg) {
                        $scope.flag = !$scope.flag;
                    });
                }
            });
        }
        catch (e) {
            console.log(e);
        }
        node.on("close", function() {
            if (done) {
                done();
            }
        });
    }
    RED.nodes.registerType('ui_sample', SampleNode);
};
