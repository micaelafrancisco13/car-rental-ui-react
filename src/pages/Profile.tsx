import Profile from "../components/Profile";
import Wrapper from "../layouts/Wrapper";

const ProfilePage = () => {
    return (
        <Wrapper currentTab="profile">
            <Profile />
        </Wrapper>
    )
}

export default ProfilePage;