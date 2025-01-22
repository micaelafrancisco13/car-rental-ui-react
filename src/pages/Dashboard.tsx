import AdminDashboard from "../components/AdminDashboard";
import BookerDashbaord from "../components/BookerDashboard";
import Wrapper from "../layouts/Wrapper";

 
const Dashboard = () => {
    const userRole = localStorage.getItem("role") || ""
    return (
        <Wrapper currentTab="dashboard">
            {
                userRole === "booker" ? 
                <div>
                    <BookerDashbaord />
                </div> 
                
                :<>
                    <AdminDashboard />
                </>
            }
        </Wrapper>
    )
}

export default Dashboard;