import { useEffect, useState } from 'react';
import { IUsersDetails } from '../interfaces/shared';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {

    const [user, setUser] = useState<IUsersDetails>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        createdAt: "",
        id: "",
        role: "",
        updatedAt:"",
    });
    useEffect(() => {
        const decode:IUsersDetails = jwtDecode(localStorage.getItem("authToken") || "")
        setUser(decode)
    },[])

    const [editMode, setEditMode] = useState(false);
    const [changePasswordMode, setChangePasswordMode] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleEditProfile = () => {
        setEditMode(true);
    };

    const handleSaveProfile = () => {
        setEditMode(false);
        // Save logic here
    };

    const handleChangePassword = () => {
        setChangePasswordMode(true);
    };

    const handleSavePassword = () => {
        if (newPassword === confirmPassword) {
            setChangePasswordMode(false);
        } else {
            alert('Passwords do not match');
        }
    };

    return (
        <div className="p-3 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6">My Profile</h1>

                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold font-mono uppercase text-gray-700">Profile Details</h2>
                        <button
                            onClick={handleEditProfile}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Edit Profile
                        </button>
                    </div>

                    {editMode ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    value={user.firstName}
                                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    value={user.lastName}
                                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    value={user.phoneNumber}
                                    onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md text-gray-700 shadow-sm p-2"
                                />
                            </div>
                            <button
                                onClick={handleSaveProfile}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className='flex space-x-2 items-center h-auto'>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <p className="text-gray-500">{`${user.firstName} ${user.lastName}`}</p>
                            </div>
                            <div className='flex space-x-2 items-center h-auto'>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <p className="text-gray-500">{user.email}</p>
                            </div>
                            <div className='flex space-x-2 items-center h-auto'>
                                <label className="block text-sm font-medium text-gray-700">Phone Number:</label>
                                <p className="text-gray-500">{user.phoneNumber}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold font-mono uppercase text-gray-700">Password & Security</h2>
                        <button
                            onClick={handleChangePassword}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Change Password
                        </button>
                    </div>

                    {changePasswordMode && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                                />
                            </div>
                            <button
                                onClick={handleSavePassword}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Save Password
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;