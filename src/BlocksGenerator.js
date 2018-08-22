const XMLWriter = require("xml-writer");

const BlocksGenerator = {
  groupByCategory: tools =>
    tools.reduce((accumulated, item) => {
      const result = accumulated;
      result[item.category] = result[item.category] || [];
      result[item.category].push(item.name);
      return result;
    }, {}),
  generateBlocksWithCategories: groupedTools => {
    return Object.keys(groupedTools).map(key => {
      const categoryXML = new XMLWriter();
      categoryXML
        .startDocument()
        .startElement("category")
        .writeAttribute("name", key);
      groupedTools[key].map(blockType => {
        categoryXML.writeElement("block").writeAttribute("type", blockType);
      });
      categoryXML.endDocument();
      return categoryXML;
    });
  },
  generateBlocks: tools => {
    const blocks = new XMLWriter();
    blocks.startDocument();
    tools.map(({ name }) => {
      blocks.startElement("block").writeAttribute("type", name);
    });
    blocks.endDocument();
    return blocks;
  },
  generate: tools => {
    if (tools[0].category) {
      const groupedByCategory = BlocksGenerator.groupByCategory(tools);
      const xmls = BlocksGenerator.generateBlocksWithCategories(
        groupedByCategory
      );
      return xmls;
    }

    const xmls = BlocksGenerator.generateBlocks(tools);
    return xmls;
  }
};

export default BlocksGenerator;
