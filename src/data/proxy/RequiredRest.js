/**
 * Created by JPeruggia on 03/21/2016.
 */
Ext.define('Ext.data.proxy.RequiredRest', {
    alias: 'proxy.requiredRest',
    extend: 'Ext.data.proxy.Rest',
    defaultActionMethods:{
        create: 'POST',
        read: 'GET',
        update: 'PATCH',
        destroy: 'DELETE'
    },
    config:{
        actionMethods: this.defaultActionMethods
    },
    
    parentClassEndPoint: null,
    relationName: null,


    buildUrl: function(request) {

        var me        = this,
            operation = request.getOperation(),
            records   = operation.getRecords(),
            record    = records ? records[0] : null,
            format    = me.getFormat(),
            url       = me.getUrl(request),
            parent    = record ? record.getParent() : null,
            id, params;

        if (record){
            // if there is a record and proxy properties aren't set look @ the record.
            if (this.parentClassEndPoint == null)
                this.parentClassEndPoint = record.parentClassEndPoint;
            if(this.relationName == null)
                this.relationName = record.relationName;
        }

        if (record && !record.phantom) {
            id = record.getId();
        } else {
            id = operation.getId();
        }
        
        // if I am set to append ID's and I have a valid ID, lets being to build the url for the actions.
        if (this.parentClassEndPoint != null && this.relationName != null && parent != null && parent.phantom == false) {
            url = '/api/'+this.parentClassEndPoint + '/'+ parent.get('ID')+'/'+this.relationName;

            if (me.getAppendId() && me.isValidId(id)) {
                if (!url.match(me.slashRe)) {
                    url += '/';
                }
                params = request.getParams();
                if (params) {
                    delete params[me.getIdParam()];
                }
            }
        }else if (operation.getAction() !== "read" && operation.getAction() !== "destroy" ) {
            console.log("Cannot use the required class proxy for "+ this.getId() + " missing proxy definitions or a parent");
            return false;
        }

        if (format) {
            if (!url.match(me.periodRe)) {
                url += '.';
            }

            url += format;
        }

        request.setUrl(url);
        return me.callParent(arguments);
    }
});