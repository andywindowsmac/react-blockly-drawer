"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var XMLWriter = require("xml-writer");

var BlocksGenerator = {
  groupByCategory: function groupByCategory(tools) {
    return tools.reduce(function (accumulated, item) {
      var result = accumulated;
      result[item.category] = result[item.category] || [];
      result[item.category].push(item.name);
      return result;
    }, {});
  },
  generateBlocksWithCategories: function generateBlocksWithCategories(groupedTools) {
    return Object.keys(groupedTools).map(function (key) {
      var categoryXML = new XMLWriter();
      categoryXML.startDocument().startElement("category").writeAttribute("name", key);
      groupedTools[key].map(function (blockType) {
        categoryXML.writeElement("block").writeAttribute("type", blockType);
      });
      categoryXML.endDocument();
      return categoryXML;
    });
  },
  generateBlocks: function generateBlocks(tools) {
    var blocks = new XMLWriter();
    blocks.startDocument();
    tools.map(function (_ref) {
      var name = _ref.name;

      blocks.startElement("block").writeAttribute("type", name);
    });
    blocks.endDocument();
    return blocks;
  },
  generate: function generate(tools) {
    if (tools[0].category) {
      var groupedByCategory = BlocksGenerator.groupByCategory(tools);
      var _xmls = BlocksGenerator.generateBlocksWithCategories(groupedByCategory);
      return _xmls;
    }

    var xmls = BlocksGenerator.generateBlocks(tools);
    return xmls;
  }
};

exports.default = BlocksGenerator;