const XMLWriter = require("xml-writer");

const BlocksGenerator = {
  generateXMLStart: writer => {
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
  groupByCategory: tools =>
    tools.reduce((accumulated, item) => {
      const result = accumulated;
      result[item.category] = result[item.category] || [];
      result[item.category].push(item.name);
      return result;
    }, {}),
  generateBlocksWithCategories: groupedTools => {
    const categoryXML = BlocksGenerator.generateXMLStart(new XMLWriter());
    return Object.keys(groupedTools).map(key => {
      categoryXML.startElement("category").writeAttribute("name", key);
      groupedTools[key].map(blockType => {
        categoryXML.writeElement("block").writeAttribute("type", blockType);
      });
      categoryXML.endDocument();
      return categoryXML.toString();
    });
  },
  generateBlocks: tools => {
    const blocks = BlocksGenerator.generateXMLStart(new XMLWriter());
    tools.map(({ name }) => {
      blocks.startElement("block").writeAttribute("type", name);
    });
    blocks.endDocument();
    return blocks.toString();
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
