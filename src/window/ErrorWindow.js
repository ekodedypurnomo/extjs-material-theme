Ext.define('Ext.window.ErrorWindow', {
    extend: 'Ext.window.Window',
    xtype: 'errorwindow',
    requires: [
        'Ext.layout.container.VBox',
        'Ext.Component',
        'Ext.tree.Panel',
        'Ext.data.TreeModel',
        'Ext.Ajax'//,
        //'Ext.tree.Column'
    ],
    height: 200,
    width: 400,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    title: 'Error',
    //icon: Ext.MessageBox.ERROR,
    exceptionMsg: {},
    responseText: {},
    items:[
        {
            xtype: 'box',
            itemId: 'displayMsg',
            flex: .25
        },
        {
            xtype: 'treepanel',
            title: 'Detailed Error Message',
            cls: 'noIcon',
            collapsible: true,
            collapsed: true,
            flex: 1,
            scrollable: true,
            itemId: 'detailedMsg',
            rootVisible: false,
            tools:[{
                    type:'gear',
                    tooltip: 'Send this error to support.',
                    callback: function(panel, tool, event) {
                        var window = panel.up('errorwindow'),
                            rawError = window.exceptionMsg,
                            errorObj = {
                            status: rawError.status,
                            statusText: rawError.statusText,
                            responseText: window.responseText
                        };
                        Ext.Ajax.request({
                            url: '/api/User/EmailError',
                            method: 'PUT',
                            jsonData: JSON.stringify(errorObj),
                            success: function(){
                                tool.disable();
                                
                            }
                        });
                    }
                }]
            /*,
            hideHeaders: true,
            columns: [{
                xtype: 'treecolumn',
                flex: 1,
                scrollable: true,
                dataIndex: 'text'

            }],
            plugins: {
                ptype: 'clipboard',
                memory:'cell'
            }*/
        }
    ],
    buttons: [
        {
            text: 'Ok',
            handler: function(btn) {
                btn.up('errorwindow').destroy();
            }
        }
    ],
    decodeMessage: function (strToDecode){
        if(typeof(strToDecode) === 'string') {
            if (strToDecode.length === 0) {
                return false;
            }
            try {
                return JSON.parse(strToDecode);
            }
            catch (e) {
                return false;
            }
        }
    },
    setMessages: function(response) {
        var me = this;
        me.exceptionMsg = response;
        me.setTitle(response.status + ' - ' + response.statusText);

        if (response.hasOwnProperty('responseText')) {
            var decoded = me.decodeMessage(response.responseText);
            me.responseText = decoded;
            if (decoded !== false) {
                me.getComponent('displayMsg').setHtml('&nbsp;&nbsp;' + decoded.Message);
                var rootNode = {
                    text: "Root node",
                    expanded: true,
                    leaf: false,
                    children: [
                        {
                            text: 'Exception Type',
                            expanded: false,
                            leaf: false,
                            children: [{
                                text: decoded.ExceptionType,
                                leaf: true
                            }]
                        },
                        {
                            text: 'Exception Message',
                            expanded: false,
                            leaf: false,
                            children: [{
                                text: decoded.ExceptionMessage,
                                leaf: true
                            }]
                        },
                        {
                            text: 'Stack Trace',
                            expanded: false,
                            leaf: false,
                            children: [{
                                text: decoded.StackTrace,
                                leaf: true
                            }]
                        }
                    ]
                };

                if (decoded.hasOwnProperty('InnerException')) {
                    rootNode.children.push(
                        {
                            text: 'Inner Exception',
                            expanded: false,
                            leaf: false,
                            children: [
                                {
                                    text: 'Exception Type',
                                    expanded: false,
                                    leaf: false,
                                    children: [{
                                        text: decoded.InnerException.ExceptionType,
                                        leaf: true
                                    }]
                                },
                                {
                                    text: 'Exception Message',
                                    expanded: false,
                                    leaf: false,
                                    children: [{
                                        text: decoded.InnerException.ExceptionMessage,
                                        leaf: true
                                    }]
                                },
                                {
                                    text: 'Stack Trace',
                                    expanded: false,
                                    leaf: false,
                                    children: [{
                                        text: decoded.InnerException.StackTrace,
                                        leaf: true
                                    }]
                                }
                            ]
                        });
                }
                me.getComponent('detailedMsg').setRootNode(rootNode);
            } else {
                me.getComponent('displayMsg').setHtml('&nbsp;&nbsp;' + response.responseText);
            }
        } else {
            me.getComponent('displayMsg').setHtml('&nbsp;&nbsp;An error has occurred.');
        }
    }
});