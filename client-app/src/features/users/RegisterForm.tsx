import { ErrorMessage, Form, Formik } from 'formik'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Button, Header} from 'semantic-ui-react'
import TextInput from '../../app/common/form/TextInput'
import { useStore } from '../../app/stores/store'
import * as Yup from 'yup';
import ValidationError from '../errors/ValidationError'

const RegsiterForm = () => {

  const {userStore} = useStore();

  return (
    <Formik
      initialValues={{displayName:'', username:'', email:'', password:'', error:null}}
      onSubmit={(values, {setErrors}) => userStore.register(values).catch(error => setErrors({error}))}

      validationSchema={Yup.object({
        displayName : Yup.string().required(),
        username : Yup.string().required(),
        email : Yup.string().required().email(),
        password : Yup.string().required(),

      })}


    >
      {({handleSubmit, isSubmitting, errors, isValid, dirty}) => (
        <Form  className='ui form error' onSubmit={handleSubmit} autoComplete='off' >
          <Header  as='h2' content='Sign Up to Reactivities' color='teal' textAlign='center' />
            <TextInput name='displayName' placeholder='DisplayName' />
            <TextInput name='username' placeholder='Username' />
            <TextInput name='email' placeholder='Email' />
            <TextInput name='password' placeholder='password' type='password' />
            <ErrorMessage 
              name='error' render={() => <ValidationError errors={errors.error} /> }
            />
            <Button 
              disabled={!isValid ||  !dirty || isSubmitting}
              positive content='Register' 
              type='submit' 
              fluid  
              loading={isSubmitting}
            />
        </Form>
      )}
    </Formik>
  )
}

export default observer(RegsiterForm) 
