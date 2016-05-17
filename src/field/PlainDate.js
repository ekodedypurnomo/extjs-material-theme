/**
 * Created by JPeruggia on 04/14/2016.
 */
Ext.define('Ext.field.PlainDate', {
    extend: 'Ext.data.field.Date',
    alias: 'data.field.plainDate',
    convert: function(v){
        if (!v) {
            return null;
        }

        // if this is an instance of date, convert it.
        if (v instanceof Date){
            return v
        }else{
            var d = v.substring(0, 10).split('-');
            return new Date(d[1] + '-' + d[2] + '-' + d[0]);
        }
    }
});