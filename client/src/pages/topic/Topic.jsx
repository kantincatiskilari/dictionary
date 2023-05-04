import React from 'react'
import Posts from '../../components/posts/Posts'
import Sidebar from '../../components/sidebar/Sidebar';

export default function Topic() {
  return (
    <div className='home'>
    <Sidebar />
    <div className="topicWrapper">
        <Posts />         
    </div>
</div>
  )
}
