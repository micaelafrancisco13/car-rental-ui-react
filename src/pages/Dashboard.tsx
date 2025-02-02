import AdminDashboard from "../components/AdminDashboard";
import ValidateLocation from "../components/ValidateLocation";
import Wrapper from "../layouts/Wrapper";

 
const Dashboard = () => {
    const userRole = localStorage.getItem("role") || ""

    return (
        <Wrapper currentTab="dashboard">
            {
                userRole === "booker" ? 
                <div>
                     <ValidateLocation />
                    {/* <BookerDashbaord /> */}
                </div> 
                
                :<>
                    <AdminDashboard />
                </>
            }
        </Wrapper>
    )
}

export default Dashboard;