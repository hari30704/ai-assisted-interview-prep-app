import React ,{useState} from 'react'
import {LuPlus} from 'react-icons/lu';
//import {CARD_BG} from '../../utils/data';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { data } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModel, setOpenCreateModel] = useState(false);
  const [sessions, setSessions] = useState([]);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });
  
  return (
    <DashboardLayout>dashboard</DashboardLayout>
  )
}

export default Dashboard