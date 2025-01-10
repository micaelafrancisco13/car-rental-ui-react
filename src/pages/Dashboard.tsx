import BookerDashbaord from "../components/BookerDashboard";
import Wrapper from "../layouts/Wrapper";

const userRole = "admin"
const Dashboard = () => {
    return (
        <Wrapper currentTab="dashboard">
            {
                userRole === "admin" ? 
                <>
                </>
                
                :<div>
                    <BookerDashbaord />
                </div> 
            }
        </Wrapper>
    )
}

export default Dashboard;