import './newTopic.css';
import Sidebar from '../../components/sidebar/Sidebar';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


export default function NewTopic() {
    const {user} = useSelector(state => state.user);
    const entryRef = useRef("");
    const params = useParams().topicname;
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
          const res = await axios.post("/topics/create",{desc:params});
          try{
            await axios.post("/entries/"+res.data._id,{desc:entryRef.current.value, nickname:user.nickname});
          }catch(err){
            console.log(err)
          }
          entryRef.current.value = ""
          navigate("/topics/"+res.data._id);
        }catch(err){
          console.log(err);
        }
      };
  return (
    <div className='newTopic'>
        <Sidebar />
        <div className="newTopicWrapper">
            <div className="newTopicTitle">{params}</div>
            <div className="topicNotFound">topic not found.</div>
            {user?.access_token &&
            <div className="newEntryContainer">
            <textarea className='newEntry' placeholder={`maybe you want to create a topic about ${params}?`} ref={entryRef}/>
            <button className='submitEntry' onClick={handleSubmit}>send</button>
          </div>
            }
        </div>
    </div>
  )
}
