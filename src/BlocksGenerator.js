const BlocksGenerator = {
  groupByCategory: tools =>
    tools.reduce((accumulated, item) => {
      const result = accumulated;
      result[item.category] = result[item.category] || [];
      result[item.category].push(item.name);
      return result;
    }, {}),
  generateBlocksWithCategories: (newToolsXML, groupedTools) => {
    Object.keys(groupedTools).map(key => {
      const newCategory = newToolsXML.createElement("category");
      newCategory.setAttribute("name", key);

      groupedTools[key].map(blockType => {
        const newBlock = newToolsXML.createElement("block");
        newBlock.setAttribute("type", blockType);
        newCategory.appendChild(newBlock);
      });

      newToolsXML.getElementsByTagName("xml")[0].appendChild(newCategory);
    });

    return newToolsXML;
  },
  generateBlocks: (newToolsXML, tools) => {
    return tools.map(({ name }) => {
      const newBlock = newToolsXML.createElement("block", {});
      newBlock.setAttribute("type", name);
      newToolsXML.getElementsByTagName("xml")[0].appendChild(newBlock);
    });
  },
  generate: (newToolsXML, tools) => {
    if (tools[0].category) {
      const groupedByCategory = BlocksGenerator.groupByCategory(tools);
      BlocksGenerator.generateBlocksWithCategories(
        newToolsXML,
        groupedByCategory
      );
      return;
    }

    BlocksGenerator.generateBlocks(newToolsXML, tools);
    return;
  }
};

export default BlocksGenerator;
