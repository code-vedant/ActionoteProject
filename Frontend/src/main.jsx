import React, { StrictMode } from 'react'; // Import React
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Pages/Login.jsx';
import Signup from './Pages/Signup.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Homepage from './Pages/Homepage.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { Provider } from 'react-redux';
import store from './Store/Store.js';
import DrawingCanvas from './Components/DrawCanvas/DrawingCanvas.jsx';
import NotFound from './Pages/NotFound.jsx';
import PomodoroTimer from './Components/Promodo/PomodoroTimer.jsx';
import Calendar from './Components/Calendars/Calendar.jsx';
import NotesHome from './Components/Notes/NotesHome.jsx';
import DrawHome from './Components/DrawCanvas/DrawHome.jsx';
import DiaryHome from './Components/Diary/DiaryHome.jsx';
import NotesNew from './Components/Notes/NotePage.jsx';
import TodoPage from './Components/Todo/TodoHome.jsx';
import CalendarPage from './Components/Calendars/Calendar.jsx';
import DashboardHome from './Pages/DashboardHome.jsx';
import TagPage from './Components/tags/TagPage.jsx';
import NotePage from './Components/Notes/NotePage.jsx';
import ProfilePage from './Components/Profile/ProfilePage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <NotFound/>,
    children: [
        {
          path: '/',
          element: <Homepage/>
        }
    ]
  },
  {
    path: '/login',
    element:
      <Login/>
  },
  {
    path: '/register',
    element: 
      <Signup/>
  },
  {
    path: '/dashboard',
    element: <Dashboard/>,
    children:[
      {
        path: '/dashboard/',
        element: <DashboardHome/>
      },
      {
        path: '/dashboard/profile',
        element: <ProfilePage/>
      },
      {
        path: '/dashboard/draw',
        element: <DrawHome/>
      },
      {
        path: '/dashboard/draw/:id',
        element: <DrawingCanvas/>
      },
      {
        path: '/dashboard/pomodoro',
        element: <PomodoroTimer/>
      },
      {
        path: '/dashboard/todo',
        element: <TodoPage/>
      },
      {
        path: '/dashboard/calendar',
        element: <CalendarPage/>
      },
      {
        path: '/dashboard/notes',
        element: <NotesHome/>
      },
      {
        path: '/dashboard/notes/:id',
        element: <NotePage/>
      },
      {
        path: '/dashboard/diary',
        element: <DiaryHome/>
      },
      {
        path: '/dashboard/tags',
        element: <TagPage/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <RouterProvider router={router}/>
      </Provider>
    </ThemeProvider>
  </StrictMode>
);