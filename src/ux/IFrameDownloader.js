/**
 * Created by JPeruggia on 04/18/2016.
 */
Ext.define('Ext.ux.IFrameDownloader', {
    extend: 'Ext.ux.IFrame',
    itemId: 'hiddenform-iframe',
    hidden: true,
    listeners: {
        load: {
            element: 'iframeEl',
            fn: function (iFrameComponent) {
                Ext.getBody().unmask();
                //Get the error out of the body of the iFrame in string format
                var error = iFrameComponent.target.contentDocument.getElementsByTagName('body')[0].innerHTML;
                // decode into json
                var errorJson = Ext.util.JSON.decode(error);
                // display the error in a msg box.
                Ext.Msg.show({
                    title: 'Error!',
                    msg: errorJson.Message + "<br\>" + errorJson.ExceptionMessage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING
                });
            }
        },
        readystatechange: {
            element: 'iframeEl',
            fn: function (iFrameComponent) {
                if (iFrameComponent.dom.readyState == 'loading') {
                    return;
                }
            }
        }
    }
});