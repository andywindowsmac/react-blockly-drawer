"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var XMLWriter = require("xml-writer");

var BlocksGenerator = {
  generateXMLStart: function generateXMLStart(writer) {
    writer.startPI("xml");
    writer.startAttribute("xmlns");
    writer.text("http://www.w3.org/1999/xhtml");
    writer.endAttribute();
    writer.startAttribute("id");
    writer.text("toolbox");
    writer.endAttribute();
    writer.startAttribute("style");
    writer.text("display: none;");
    writer.endAttribute();
    return writer;
  },
  groupByCategory: function groupByCategory(tools) {
    return tools.reduce(function (accumulated, item) {
      var result = accumulated;
      result[item.category] = result[item.category] || [];
      result[item.category].push(item.name);
      return result;
    }, {});
  },
  generateBlocksWithCategories: function generateBlocksWithCategories(groupedTools) {
    var categoryXML = BlocksGenerator.generateXMLStart(new XMLWriter());
    return Object.keys(groupedTools).map(function (key) {
      categoryXML.startElement("category").writeAttribute("name", key);
      groupedTools[key].map(function (blockType) {
        categoryXML.writeElement("block").writeAttribute("type", blockType);
      });
      categoryXML.endDocument();
      return categoryXML.toString();
    });
  },
  generateBlocks: function generateBlocks(tools) {
    var blocks = BlocksGenerator.generateXMLStart(new XMLWriter());
    tools.map(function (_ref) {
      var name = _ref.name;

      blocks.startElement("block").writeAttribute("type", name);
    });
    blocks.endDocument();
    return blocks.toString();
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