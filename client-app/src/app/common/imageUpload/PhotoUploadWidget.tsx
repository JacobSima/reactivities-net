import React, { useEffect, useState } from 'react'
import { Button, Grid, Header } from 'semantic-ui-react';
import PhotoWidgetCropper from './PhotoWidgetCropper';
import PhotoWidgetDropZone from './PhotoWidgetDropZone';
import {Cropper} from 'react-cropper';

interface Props {
  handlePhotoUpload: (file: Blob) => void;
  uploading: boolean;
}


const PhotoUploadWidget = ({uploading, handlePhotoUpload}: Props) => {

  const [files, setFiles] = useState<any>([]);
  const [cropper, setCropper] = useState<Cropper>();

  const onCrop = () => {
    if(cropper){
      cropper?.getCroppedCanvas().toBlob(blob => handlePhotoUpload(blob!));
    }
  }

  // To dispose the file after cropping
  useEffect(() => {
    return () => {
      files.forEach((file:any )=> URL.revokeObjectURL(file.preview) )
    }
  },[files])
  
  return (
    <Grid>
      <Grid.Column width ={4}>
        <Header color='teal' content='Step 1 - Add Photo'  sub/>
        <PhotoWidgetDropZone  setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column  width={1} />
      <Grid.Column width ={4}>
        <Header color='teal' content='Step 2 - Resize Image'  sub/>
        {files &&  files.length > 0 && (
          <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
        )}
      </Grid.Column>
      <Grid.Column  width={1} />
      <Grid.Column width ={4}>
        <Header color='teal' content='Step 3 - Preview & Upload'  sub/>
        
        {files && files.length > 0 && (
          <>
            <div className='img-preview' style={{minHeight:200, overflow:'hidden'}} />
            <Button.Group  widths={2}>
                <Button  onClick={onCrop} positive icon='check' loading={uploading} />
                <Button  disabled={uploading}  onClick={() => setFiles([])} icon='close' />
            </Button.Group>
          </>
        )}
            
       
        
      </Grid.Column>
    </Grid>
  )
}

export default PhotoUploadWidget
