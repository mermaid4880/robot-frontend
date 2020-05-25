class RemoveStrictPlugin {
  constructor() {}
  removeStrict(content) {
    if (content && content.replace) {
      const re = /(\"|\')use strict(\"|\');?/gi;
      return content.replace(re, () => {
        return "";
      });
    }
    return content;
  }
  apply(compiler) {
    const self = this;
    compiler.plugin("compilation", function(compilation) {
      compilation.plugin("optimize-chunk-assets", function(chunks, callback) {
        let files = [];
        chunks.forEach(function(chunk) {
          return files.push.apply(files, chunk.files);
        });
        files.forEach(file => {
          let chunkSource = compilation.assets[file];
          let source = chunkSource._source;
          let children = source.children;
          source.children = children.map(item => {
            if (typeof item === "string") {
              return self.removeStrict(item);
            } else if (typeof item === "object" && item._source) {
              item._source.value = self.removeStrict(item._source.value);
              return item;
            } else {
              return item;
            }
          });
        });
        callback();
      });
    });
  }
}

module.exports = RemoveStrictPlugin;
