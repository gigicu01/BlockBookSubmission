import React from 'react'
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { SignUpPage } from './pages/signUpPage';
import SignInPage from './pages/signInPage';
import { supabaseClient } from './api/supabaseClient';
import { SignOutPage } from './pages/signOutPage';
import { NavBar } from './components/navBar';
import Footer from './components/footer';
import { Container } from '@material-ui/core';
import { AuthProvider } from './contexts/authContext';
import EditProfilePage from './pages/editProfilePage';
import { ErrorPage } from './pages/errorPage';
import { ConfirmEmailPage } from './pages/confirmEmailPage';
import { ViewProfilePage } from './pages/viewProfilePage';
import { TweetPage } from './pages/tweetPage'
import { QueryClient, QueryClientProvider } from 'react-query'

//This controls the website, it displays all of the components to the screen 
//The nav bar and footer will always appear and the pages inside of the <Router> tag will switch depending on
//what was clicked in the navbar
const queryClient = new QueryClient()
function App() {
  return (
    // AuthProvider is used so that the session info can be accessed in all pages. So info can be changed on those pages based on the session.
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
      <Router>
        <NavBar /> 
        <Container maxWidth="sm">
          <Switch>
            <Route path="/signup">
              <SignUpPage />
            </Route>
            <Route path="/signin">
              <SignInPage />
            </Route>
            <Route path="/signout">
              <SignOutPage />
            </Route>
            <Route path="/confirm-signup">
              <ConfirmEmailPage />
            </Route>
            <Route path="/profile/edit">
              <EditProfilePage />
            </Route>
            <Route path="/profile">
              <ViewProfilePage />
            </Route>
            <Route path="/error">
              <ErrorPage />
            </Route>
            <Route path="/">
              <TweetPage />
            </Route>
          </Switch>
        </Container>
        <Footer/>
      </Router>
      </QueryClientProvider>
    </AuthProvider>
  )
}

const HomePage = () => {
  const session = supabaseClient.auth.session()
  return <div>{session && `you are logged in as ${session.user?.email}`}</div>
}

export default App
