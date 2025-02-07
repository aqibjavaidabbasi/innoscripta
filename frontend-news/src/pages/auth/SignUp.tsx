import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, saveAuthToken, saveUserData } from "../../services/authService"; 

interface SignUpFormValues {
   name: string;
   email: string;
   password: string;
   confirmPassword: string;
}


const SignUp: React.FC = () => {
   const navigate = useNavigate();

   const initialValues: SignUpFormValues = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
   };

   const validationSchema = Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
      confirmPassword: Yup.string().required("Required")
         .oneOf([Yup.ref('password')], 'Passwords do not match'),
   });

   const onSubmit = async (values: SignUpFormValues) => {
      try {
         const userData = await registerUser({
            name: values.name,
            email: values.email,
            password: values.password,
            password_confirmation: values.confirmPassword,
         });
         saveUserData({ id: userData.user.id, name: userData.user.name, email: userData.user.email });
         saveAuthToken(userData.access_token);
         navigate('/news-page');
      } catch (error) {
         console.error('Registration error:', error);
      }
   };

   return (
      <div className="flex items-center justify-center h-[70vh] ">
         <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
         >
            <Form className="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow-md">
               <h2 className="mb-4 text-2xl font-bold">Sign Up</h2>

               <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                     Name
                  </label>
                  <Field
                     type="text"
                     name="name"
                     id="name"
                     className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="name" component="div" className="text-sm text-red-500" />
               </div>
               <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                     Email
                  </label>
                  <Field
                     type="email"
                     name="email"
                     id="email"
                     className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
               </div>

               <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                     Password
                  </label>
                  <Field
                     type="password"
                     name="password"
                     id="password"
                     className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
               </div>

               <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                     Confirm Password
                  </label>
                  <Field
                     type="password"
                     name="confirmPassword"
                     id="confirmPassword"
                     className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-500" />
               </div>

               <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
               >
                  Register
               </button>

               <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                     Already have an account?{' '}
                     <Link to="/login" className="text-blue-500 hover:text-blue-700">Login</Link>
                  </p>
               </div>
            </Form>
         </Formik>
      </div>
   );
};

export default SignUp;
