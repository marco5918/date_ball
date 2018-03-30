import { ImagePicker } from 'antd-mobile';
import React from 'react';


class ImagePickerModal extends React.Component {

    constructor(props){
		super(props);
		this.state = {
			files: [{id:1,url:props.src},],
		};
    };
    
    onChange = (files, type, index) => {
        //console.log(files, type, index);
        this.setState({
        files,
        });
        if(files.length > 0){
            this.props.onChange(files[0].url);
        }else{
            this.props.onChange('');
        }
       
    };

    onImageClick = (index, fs) => {
        this.setState({
            files: [],
        });
        this.props.onChange('');
    };

    render() {
        const { files } = this.state;
        return (
        <div>
            <ImagePicker
            files={files}
            onChange={this.onChange}
            onImageClick={(index, fs) => this.onImageClick(index, fs)}
            selectable={files.length < 1}
            />
        </div>
        );
    }
}

export default ImagePickerModal;