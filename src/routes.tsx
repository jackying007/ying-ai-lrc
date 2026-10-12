import { createBrowserRouter, Navigate } from 'react-router'
import { AppLayout } from '@/layout'
import { Index } from '@/pages/index'
import { Test } from '@/pages/test'
import { FolderDetail } from '@/pages/folder/folder-detail'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="index" />
      },
      {
        path: 'index',
        element: <Index />
      },
      {
        path: 'test',
        element: <Test />
      },
      {
        path: 'folder/:folderId',
        element: <FolderDetail />
      }
    ]
  }
])
