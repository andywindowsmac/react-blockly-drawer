"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var BlocksGenerator = {
  groupByCategory: function groupByCategory(tools) {
    return tools.reduce(function (accumulated, item) {
      var result = accumulated;
      result[item.category] = result[item.category] || [];
      result[item.category].push(item.name);
      return result;
    }, {});
  },
  generateBlocksWithCategories: function generateBlocksWithCategories(newToolsXML, groupedTools) {
    Object.keys(groupedTools).map(function (key) {
      var newCategory = newToolsXML.createElement("category");
      newCategory.setAttribute("name", key);

      groupedTools[key].map(function (blockType) {
        var newBlock = newToolsXML.createElement("block");
        newBlock.setAttribute("type", blockType);
        newCategory.appendChild(newBlock);
      });

      newToolsXML.getElementsByTagName("xml")[0].appendChild(newCategory);
    });

    categoryXML.endDocument();
    return categoryXML;
  },
  generateBlocks: function generateBlocks(newToolsXML, tools) {
    return tools.map(function (_ref) {
      var name = _ref.name;

      var newBlock = newToolsXML.createElement("block");
      newBlock.setAttribute("type", name);
      newToolsXML.getElementsByTagName("xml")[0].appendChild(newBlock);
    });
  },
  generate: function generate(newToolsXML, tools) {
    if (tools[0].category) {
      var groupedByCategory = BlocksGenerator.groupByCategory(tools);
      BlocksGenerator.generateBlocksWithCategories(newToolsXML, groupedByCategory);
      return;
    }

    BlocksGenerator.generateBlocks(newToolsXML, tools);
    return;
  }
};

exports.default = BlocksGenerator;