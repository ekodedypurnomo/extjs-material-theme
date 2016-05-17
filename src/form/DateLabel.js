/**
 * Created by JPeruggia on 03/22/2016.
 */
Ext.define('Ext.form.DateLabel', {
    extend: 'Ext.form.Label',
    xtype: 'datelabel',

    /**
     * @cfg {String} Date format
     */
    format: 'm/d/Y',
    appendText: '',

    setText:function(text){
        if (Ext.isDate(text)){
            text = Ext.util.Format.date(text,this.format);
        }else{
            text = '';
        }
        this.update('<b>'+this.appendText +'</b>'+ text);
        return text;
    }

});