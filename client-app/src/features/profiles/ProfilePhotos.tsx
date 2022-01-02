import { observer } from 'mobx-react-lite'
import React, { SyntheticEvent, useState } from 'react'
import { Card, Header, Tab, Image, Grid, Button } from 'semantic-ui-react'
import PhotoUploadWidget from '../../app/common/imageUpload/PhotoUploadWidget'
import { Photo, Profile } from '../../app/models/profile'
import { useStore } from '../../app/stores/store'

interface Props {
  profile: Profile
}

const ProfilePhotos = ({profile}: Props) => {
  const {profileStore:{
    isCurrentUser, 
    uploadPhoto, 
    uploading, 
    loading, 
    setMainPhoto,
    deletePhoto 
  }} = useStore();

  const [target, setTarget] = useState('');

  const [addPhotoMode, setAddPhotoMode] = useState(false);

  const handlePhotoUpload = (file: Blob) => {
      uploadPhoto(file).then(() => setAddPhotoMode(false));
  }

  const handleSetMainPhoto = (photo: Photo, e: SyntheticEvent<HTMLButtonElement>) =>{
      setTarget(e.currentTarget.name);
      setMainPhoto(photo);
  }

  const handleDeletePhoto = (photo: Photo, e: SyntheticEvent<HTMLButtonElement>) => {
      setTarget(e.currentTarget.name);
      deletePhoto(photo);
  }
 

  return (
    <Tab.Pane>
      <Grid>
          <Grid.Column width={16}>
             <Header icon='image' content='Photos' floated='left' />
             {isCurrentUser && (
               <Button 
                  basic 
                  floated='right'
                  content = {addPhotoMode ? 'Cancel': 'Add Photo'}
                  onClick={() => setAddPhotoMode(!addPhotoMode)}
               /> 
             )}
          </Grid.Column>
      </Grid>
      <Grid.Column  width={16}>
            {addPhotoMode ? (
              <PhotoUploadWidget  uploading={uploading} handlePhotoUpload={handlePhotoUpload}/>
            ): (
              <Card.Group itemsPerRow={5} >
                  {profile.photos?.map(photo => (
                    <Card key={photo.id}>
                        <Image src={ photo.url ||'/assets/user.png'} />
                        {isCurrentUser && (
                          <Button.Group fluid widths={2}>
                              <Button 
                                name={'main' + photo.id} 
                                basic 
                                color='green' 
                                content='Main'
                                disabled={photo.isMain}
                                loading={target ==='main' + photo.id && loading}
                                onClick={e => handleSetMainPhoto(photo, e)}
                              />
                              <Button  
                                basic 
                                color='red' 
                                icon='trash' 
                                loading={target === photo.id && loading}
                                onClick={e => handleDeletePhoto(photo, e)}
                                disabled={photo.isMain}
                              />
                          </Button.Group>
                        )}
                    </Card>
                  ))}
              </Card.Group>
            )}
      </Grid.Column>
      
      
    </Tab.Pane>
  )
}

export default observer(ProfilePhotos) 
