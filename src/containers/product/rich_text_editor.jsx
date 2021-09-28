import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import './demo.less'


export default class RichTextEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(), //构建一个初始化状态的编辑器
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  getRichText = () => {
    const {editorState} = this.state;
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }

  setRichText = (data) => {
    const contentBlock = htmlToDraft(data);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState,
      });
    }
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper" //最外侧容器样式
          editorClassName="demo-editor" //编辑区域样式
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}