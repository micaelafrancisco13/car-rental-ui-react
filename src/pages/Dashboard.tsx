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
                
                :<></>
            }
        </Wrapper>
    )
}

export default Dashboard;