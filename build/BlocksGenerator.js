"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _xmlWriter = require("xml-writer");

var XMLWriter = _interopRequireWildcard(_xmlWriter);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var elements = Object.keys(groupedByCategory).map(function (key) {
  var blocks = groupedByCategory[key].map(function (type) {
    return React.createElement(Block, { type: type, key: type });
  });
  var categoryAppearance = appearance && appearance.categories && appearance.categories[key] || {};
  return React.createElement(
    Category,
    _extends({}, categoryAppearance, { key: key, name: key }),
    blocks
  );
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
      var _groupedByCategory = BlocksGenerator.groupByCategory(tools);
      var _xmls = BlocksGenerator.generateBlocksWithCategories(_groupedByCategory);
      return _xmls;
    }

    var xmls = BlocksGenerator.generateBlocks(tools);
    return xmls;
  }
};

exports.default = BlocksGenerator;