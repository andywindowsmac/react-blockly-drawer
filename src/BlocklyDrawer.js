import React, { Component } from "react";
import PropTypes from "prop-types";
import Blockly from "node-blockly/browser";

import BlocksGenerator from "./BlocksGenerator";
import BlocklyToolbox from "./BlocklyToolbox";

let styles = null;

const isToolsAlreadyExist = tools => {
  tools.filter(tool => {
    return !Blockly.Blocks[tool.name] && !Blockly.JavaScript[tool.name];
  }).length === 0;
};

const initTools = tools => {
  tools.forEach(tool => {
    Blockly.Blocks[tool.name] = tool.block;
    Blockly.JavaScript[tool.name] = tool.generator;
  });
};

class BlocklyDrawer extends Component {
  constructor(props) {
    super(props);
    this.onResize = this.onResize.bind(this);
    this.wrapper = null;
    this.content = null;
  }

  componentWillMount() {
    initTools(this.props.tools);
  }

  componentDidMount() {
    if (this.wrapper) {
      window.addEventListener("resize", this.onResize, false);
      this.onResize();

      if (
        this.props.injectOptions &&
        this.props.tools &&
        this.props.tools.length !== 0 &&
        this.props.isCustomBehavior
      ) {
        const toolsXML = BlocksGenerator.generate(this.props.tools);
        const merger = new MergeXML({ updn: true });
        merger.AddSource(toolsXML);
        merger.AddSource(this.props.injectOptions.toolbox);
        const newInjectOptions = Object.assign({}, this.props.injectOptions, {
          toolbox: merger.Get(1)
        });
        this.workspacePlayground = Blockly.inject(
          this.content,
          Object.assign({ toolbox: this.toolbox }, newInjectOptions)
        );
      } else {
        this.workspacePlayground = Blockly.inject(
          this.content,
          Object.assign({ toolbox: this.toolbox }, this.props.injectOptions)
        );
      }

      if (this.props.workspaceXML) {
        Blockly.Xml.domToWorkspace(
          Blockly.Xml.textToDom(this.props.workspaceXML),
          this.workspacePlayground
        );
      }

      Blockly.svgResize(this.workspacePlayground);

      this.workspacePlayground.addChangeListener(() => {
        const code = this.props.language
          ? this.props.language.workspaceToCode(this.workspacePlayground)
          : null;
        const xml = Blockly.Xml.workspaceToDom(this.workspacePlayground);
        const xmlText = Blockly.Xml.domToText(xml);
        this.props.onChange(code, xmlText);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.isCustomBehavior &&
      nextProps.tools &&
      !isToolsAlreadyExist(nextProps.tools)
    ) {
      const newToolsXML = new DOMParser().parseFromString(
        nextProps.injectOptions.toolbox,
        "text/xml"
      );

      BlocksGenerator.generate(newToolsXML, nextProps.tools);
      var oSerializer = new XMLSerializer();
      const newToolsString = oSerializer.serializeToString(newToolsXML);
      this.toolbox = Object.assign({}, nextProps.injectOptions, {
        toolbox: newToolsString
      });

      initTools(nextProps.tools);

      Blockly.updateToolbox(newToolsString);
      // if (nextProps.workspaceXML) {
      //   const dom = Blockly.Xml.textToDom(nextProps.workspaceXML);
      //   Blockly.Xml.domToWorkspace(dom, this.workspacePlayground);
      // }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    this.workspacePlayground.clear();
  }

  onResize() {
    let element = this.wrapper;
    do {
      element = element.offsetParent;
    } while (element);
    this.content.style.width = `${this.wrapper.offsetWidth}px`;
    this.content.style.height = `${this.wrapper.offsetHeight}px`;
  }

  render() {
    const wrapperStyle = Object.assign({}, styles.wrapper, this.props.style);
    return (
      <div
        className={this.props.className}
        style={wrapperStyle}
        ref={wrapper => {
          this.wrapper = wrapper;
        }}
      >
        <div
          style={styles.content}
          ref={content => {
            this.content = content;
          }}
        />
        {!this.props.isCustomBehavior && (
          <BlocklyToolbox
            onRef={toolbox => {
              this.toolbox = toolbox;
            }}
            tools={this.props.tools}
            appearance={this.props.appearance}
            onUpdate={() => {
              if (this.workspacePlayground && this.toolbox) {
                this.workspacePlayground.updateToolbox(this.toolbox.outerHTML);
              }
            }}
          />
        )}
        {this.props.children}
      </div>
    );
  }
}

BlocklyDrawer.defaultProps = {
  onChange: () => {},
  tools: [],
  workspaceXML: "",
  injectOptions: {},
  language: Blockly.JavaScript,
  appearance: {},
  className: "",
  style: {}
};

BlocklyDrawer.propTypes = {
  tools: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      category: PropTypes.string,
      block: PropTypes.shape({ init: PropTypes.func }),
      generator: PropTypes.func
    })
  ).isRequired,
  onChange: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  workspaceXML: PropTypes.string,
  injectOptions: PropTypes.object,
  language: PropTypes.object,
  appearance: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object
};

styles = {
  wrapper: {
    minHeight: "400px",
    position: "relative"
  },
  content: {
    position: "absolute"
  }
};

export default BlocklyDrawer;
