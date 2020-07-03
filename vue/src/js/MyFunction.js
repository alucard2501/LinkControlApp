export default {
    //全局变量
    golbal:null,

    /**字节转十六进制字符 */
    bytes2hex:function(bytes){
        var result="";
        for(var i=0;i<bytes.length;i++){
            result=result + Buffer.from([bytes[i]]).toString('hex')+ " ";
        }
        return result;
    }
}
