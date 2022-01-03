import { observer } from 'mobx-react-lite'
import React, { SyntheticEvent } from 'react'
import { Button, Reveal } from 'semantic-ui-react'
import { Profile } from '../../app/models/profile'
import { useStore } from '../../app/stores/store'


interface Props {
  profile: Profile;
}

const FollowButton = ({profile}: Props) => {

  const {profileStore, userStore} = useStore();
  const {updateFollowing, loading} = profileStore;

  // Avoid the owner of the profile to follow himself.
  if(userStore.user?.username === profile.username) return null;

  // Using the e,preventDefault, since this button is within a Card which is also a Link
  // This prevents the function to be called once card is pressed as Link to open.
  const handleFollow = (e: SyntheticEvent, username: string) => {
      e.preventDefault()
      // Check if we are following this profile
      profile.following ? updateFollowing(username, false): updateFollowing(username, true);
  }

  return (
    <Reveal animated='move'>
    <Reveal.Content visible style={{width: '100%'}}>
        <Button 
          fluid 
          color='teal' 
          content={profile.following ? 'Following' : 'Not Following'}
        />
    </Reveal.Content>
    <Reveal.Content hidden style={{width: '100%'}}>
        <Button 
          fluid 
          basic
          color={profile.following? 'red': 'green'} 
          content={profile.following? 'Unfollow' : 'Follow'}
          loading={loading}
          onClick={(e) => handleFollow(e, profile.username)}
        />
    </Reveal.Content>
  </Reveal>
  )
}

export default observer(FollowButton) 
