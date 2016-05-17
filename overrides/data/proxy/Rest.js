/**
 * Created by JPeruggia on 03/21/2016.
 */
Ext.define('Ext.overrides.data.proxy.Rest', {
    override: 'Ext.data.proxy.Rest',
    defaultActionMethods:{
        create: 'POST',
        read: 'GET',
        update: 'PATCH',
        destroy: 'DELETE'
    },
    config:{
        actionMethods: this.defaultActionMethods
    },
    writer:{
        dateFormat: 'm/d/Y',
        writeRecordId: false
    }

});