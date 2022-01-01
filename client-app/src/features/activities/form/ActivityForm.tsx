import { observer } from 'mobx-react-lite'
import React, {useEffect, useState } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { Button,Header, Segment } from 'semantic-ui-react'
import Loading from '../../../app/layout/Loading'
import { useStore } from '../../../app/stores/store'
import {v4 as uuid} from 'uuid';
import { Formik, Form} from 'formik'
import * as Yup from 'yup';
import TextInput from '../../../app/common/form/TextInput'
import TextArea from '../../../app/common/form/TextArea'
import { categoryOptions } from '../../../app/common/options/categoryOption'
import SelectInput from '../../../app/common/form/SelectInput'
import DateInput from '../../../app/common/form/DateInput'
import { ActivityFormValues } from '../../../app/models/activity'


const ActivityForm = () => {

  const {activityStore} = useStore()
  const {loadingInitial, createActivity, updateActivity, loadActivity} =  activityStore;
  const {id} = useParams<{id:string}>();
  const location =  useLocation();
  const history = useHistory();

  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

  const validationSchema =  Yup.object({
    title: Yup.string().required('The activity title is required'),
    description: Yup.string().required('The activity description is required'),
    category: Yup.string().required(),
    date: Yup.string().required().nullable(),
    venue: Yup.string().required(),
    city: Yup.string().required(),

  })

  useEffect(() => {
    if(id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)));
  },[id, loadActivity])
  

  const handleFormSubmit = (activity: ActivityFormValues) => {
    if(!activity.id){
      let newActivity = {...activity, id:uuid()};
      createActivity(newActivity)
        .then(() => history.push(`/activities/${newActivity.id}`));
    }else{
      updateActivity(activity)
        .then(() => history.push(`/activities/${activity.id}`));
    }

  }

  // const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement >) => {
  //   const {name, value} = e.target;
  //   setActivity({...activity, [name]:value})
  // }

  // Remove Loading component at refresh during creation of Activity
  if(location.pathname !== "/createActivity" && loadingInitial)
    return <Loading  content='Loading activity...'/>;


  return (
    <Segment clearing>
      <Header content='Activity Details' sub color='teal'  />
      <Formik 
        validationSchema={validationSchema}
        enableReinitialize 
        initialValues={activity} 
        onSubmit={values => handleFormSubmit(values)}
        >
          {({handleSubmit, isValid, isSubmitting, dirty}) =>(
              <Form className='ui form'  onSubmit={handleSubmit} autoComplete='off' >
                <TextInput name='title' placeholder='Title' />
                <TextArea placeholder='Description' name='description' rows={3}/>
                <SelectInput placeholder='Category' name='category' options={categoryOptions}  />
                <DateInput 
                    placeholderText='Date'
                    name='date'
                    showTimeSelect
                    timeCaption='time'
                    dateFormat='MMMM d, yyyy h:mm aa'
                    
                />

                <Header content='Location Details' sub color='teal'  />
                <TextInput placeholder='City' name='city'/>
                <TextInput placeholder='Venue' name='venue'/>
                <Button 
                    floated='right' 
                    positive type='submit' 
                    content='Submit' 
                    loading={isSubmitting} 
                    disabled = {isSubmitting || !dirty || !isValid }
                />
                <Button floated='right' type='button' content='Cancel' as={Link} to='/activities' />
              </Form>
            )}
      </Formik>

      
    </Segment>
  )
}

export default observer (ActivityForm)
