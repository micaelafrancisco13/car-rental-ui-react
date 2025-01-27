import { useEffect, useState } from 'react';
import { IUsersDetails } from '../interfaces/shared';
import LoadingButton from './loaders/LoadingButton';
import { Form, Formik } from "formik";
import * as Yup from "yup";
import useUpdateUser from '../hooks/user/useUpdateUser';
import toast from 'react-hot-toast';
import useUserStore from '../stores/useUsers';
import { useGetMe } from '../hooks/user/useGetUsers';
import TableLoading from './loaders/TableLoading';
import { changePassword } from '../hooks/user/useAddUsers';

const schema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    phoneNumber: Yup.number().test(
            "len",
            "Phone number must be exactly 9 digits",
            (value) => value?.toString().length === 10
        ).typeError("Phone number must be a valid number"),
});
    
const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current Password is a required field."),
    newPassword: Yup.string()
        .required("Password is a required field")
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
    
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), undefined], 'Passwords must match'),
    
});

const Profile = () => {

    const mutationPut = useUpdateUser();
    const changePass = changePassword();
    const { isPending } = useGetMe();
    const { me, setMe } = useUserStore()
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
        me && setUser(me)
    }, [me])

    const [editMode, setEditMode] = useState(false);
    const [changePasswordMode, setChangePasswordMode] = useState(false);
    // const [currentPassword, setCurrentPassword] = useState('');
    // const [newPassword, setNewPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');

    const handleEditProfile = () => {
        setEditMode(!editMode);
    };

    // const handleSaveProfile = () => {
    //     setEditMode(false);
    //     // Save logic here
    // };

    const handleChangePassword = () => {
        setChangePasswordMode(!changePasswordMode);
    };

    // const handleSavePassword = () => {
    //     if (newPassword === confirmPassword) {
    //         setChangePasswordMode(false);
    //     } else {
    //         alert('Passwords do not match');
    //     }
    // };
    
    const handleSubmit = async (values: IUsersDetails) => {
        const formValues: IUsersDetails = {
            ...user,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: `0${values.phoneNumber}`,
        }
        try {
            const updatedUser = await mutationPut.mutateAsync({
                id: user.id,
                data: formValues,
              });
              setMe({...updatedUser})
              toast.success("Profile has been successfully updated.")
    
        } catch (err) {
            toast.error("Failed on updating profile.")
        }
    
    }

    const handleSubmitPassword = async (values: { currentPassword: string, newPassword: string }) => {
        
        try {
            await changePass.mutateAsync({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            })
            toast.success("Password has been successfully updated.")
    
        } catch (err) {
            toast.error("Failed on updating profile.")
        }
    
    }

    return (
        <div className="p-3 min-h-screen">
            {
                isPending && <TableLoading />
            }
            <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 rounded-lg shadow-lg shadow-cyan-500/50">
                <h1 className="text-2xl text-cyan-900 uppercase font-bold mb-6">My Profile</h1>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold font-mono uppercase text-gray-700">Profile Details</h2>
                        <button
                            onClick={handleEditProfile}
                            className="text-cyan-600 hover:text-cyan-800"
                        >
                            Edit Profile
                        </button>
                    </div>

                    {editMode ? (
                        <Formik
                            validationSchema={schema}
                            initialValues={user}
                            onSubmit={handleSubmit}
                        >
                        {({
                        errors,
                        // // touched,
                        handleChange,
                        handleBlur,
                        // handleSubmit,
                        }) => (
                        <>
                                        
                        <Form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    defaultValue={user.firstName}
                                    onChange={handleChange}
                                    required
                                    onBlur={handleBlur}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    defaultValue={user.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <div className="mt-2 relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        +63
                                    </span>

                                    <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="number"
                                    defaultValue={user.phoneNumber}
                                    required
                                    className="mt-1 pl-10 block w-full border border-gray-300 rounded-md text-gray-700 shadow-sm p-2"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    />
                                </div>
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                        )}
                            </div>
                            <div className='flex items-center space-x-4'>
                                <LoadingButton 
                                    isLoading={false}
                                    text={`Save`}
                                />
                                
                                <button type='button' 
                                        className=" mt-6 px-4 py-2 outlin-cyan-600 text-cyan-600 rounded-md hover:bg-cyan-400/50 hover:text-cyan-900"
                                        onClick={() => handleEditProfile()}>
                                            Cancel
                                </button>
                            </div>
                        </Form></>
                    )}
                    </Formik>
                        
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
                            className="text-cyan-600 hover:text-cyan-800"
                        >
                            Change Password
                        </button>
                    </div>

                    {changePasswordMode && (
                        <Formik
                        validationSchema={passwordSchema}
                        initialValues={{ newPassword: "", currentPassword:"", confirmPassword: "", }}
                        onSubmit={handleSubmitPassword}
                        >
                        {({
                        errors,
                        // // touched,
                        handleChange,
                        handleBlur,
                        // handleSubmit,
                        }) => (
                        <>
                                        
                            <Form className="space-y-4 nt-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                    <div className="mt-2">
                                        <input
                                        id="currentPassword"
                                        name="currentPassword"
                                        type="password"
                                        required
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
                                        />
                                    </div>
                                        {errors.currentPassword && (
                                            <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                                        )}
                                    </div>
                                
                                <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Password
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
                                    />
                                </div>
                                    {errors.newPassword && (
                                        <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                                    )}
                                </div>
                                
                                <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                                    Confirm Password
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
                                    />
                                </div>
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                    )}
                                </div>
                                <div className='flex w-full space-x-3 align-center items-center'>
                                    <LoadingButton 
                                        isLoading={false}
                                        text={`Save Password`}
                                    />
                                    <button type='button' 
                                    className=" mt-6 px-4 py-2 outlin-cyan-600 text-cyan-600 rounded-md hover:bg-cyan-400/50 hover:text-cyan-900"
                                    onClick={() => handleChangePassword()}>
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                            </>
                            )}
                        </Formik>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;