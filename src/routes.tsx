import { createBrowserRouter, Navigate } from 'react-router'
import { AppLayout } from '@/layout'
import Local from '@/pages/local'
import LocalDetail from '@/pages/local/detail'
import Test from '@/pages/test'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="local" />
      },
      {
        path: 'local',
        element: <Local />
      },
      {
        path: 'local/:folderId',
        element: <LocalDetail />
      },
      {
        path: 'test',
        element: <Test />
      }
    ]
  }
])
