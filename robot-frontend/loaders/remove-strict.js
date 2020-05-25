
function removeStrict(code) {
    return code.replace(/(\"|\')use strict(\"|\');/gi, '');
}
module.exports = function(source) {
    // source 为 compiler 传递给 Loader 的一个文件的原内容
    source = removeStrict(source);
    return source;
};
