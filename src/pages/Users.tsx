import EmptyStates from "../components/feedback/EmptyState";
import TableLoading from "../components/loaders/TableLoading";
import useUserStore from "../stores/useUsers";
import { useGetUsers } from "../hooks/user/useGetUsers";
import Wrapper from "../layouts/Wrapper";
import { useGlobalStore } from "../stores/useGlobal";
import UserFormModal from "../components/modal/UpsertUser";
import { useEffect, useState } from "react";
import TablePagination from "../components/pagination/Table";
import ConfirmationDelete from "../components/feedback/ConfirmationButton";
import { useDeleteUser } from "../hooks/useDelete";
import toast from "react-hot-toast";

const Users = () => {
	const { isFetching } = useGetUsers()
    const { toggleModal, toggleConfirmation, open } = useGlobalStore();
    const headers: string[] = ["id","Name", "Email", "Phone Number", "Role", "Action"]

    const mutationDelete = useDeleteUser();

    const handleDelete = (id: string) => {
        mutationDelete.mutate(id, {
          onSuccess: () => {
            toast.success("User deleted successfully.")
          },
          onError: (error) => {
            toast.error("Error deleting user")
            console.log({error})
          }
        });
      };

    const {
        users: people,
        user: selectedUser,
        currentPage,
        itemsPerPage,
        setPage,
        setUser,
        setItemsPerPage,
        setPaginatedUsers,
    } = useUserStore();
    const [searchQuery, setSearchQuery] = useState(""); 
    const [filteredPeople, setFilteredPeople] = useState(people); 

    useEffect(() => {
        const filtered = people.filter((user) =>
            `${user.firstName} ${user.lastName} ${user.email}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
        setFilteredPeople(filtered);

        setPage(1);
    }, [searchQuery, people, setPage]);

    useEffect(() => {
        setPaginatedUsers();
    }, [filteredPeople, currentPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const handleItemsPerPageChange = (itemsPerPage: number) => {
        setItemsPerPage(itemsPerPage);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredPeople.slice(
        startIndex,
        startIndex + itemsPerPage
      );

    return (
        <Wrapper currentTab={"users"}>
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                <h1 className="text-base sm:text-2xl font-mono uppercase font-semibold text-cyan-900">Users</h1>
                {/* <p className="mt-2 text-sm text-gray-700">
                    A list of all the users in your account including their name, title, email and role.
                </p> */}
                </div>
                <div className="flex rounded-md border border-cyan-500 overflow-hidden max-w-md mx-auto font-[sans-serif]">
                    <input 
                        type="search" 
                        onChange={handleSearch} 
                        placeholder="Search Vehicle..." 
                        className="w-full outline-none border border-cyan-500 bg-white text-gray-600 text-sm px-4 py-2 rounded-l-md" 
                    />
                    <button 
                        type="button" 
                        className="flex items-center justify-center bg-cyan-600 px-5">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 192.904 192.904" 
                            width="16px" 
                            className="fill-white">
                            <path
                                d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                            </path>
                        </svg>
                    </button>
                </div>

                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                { people.length > 0 && (<button
                onClick={toggleModal}
                    type="button"
                    className="block rounded-md bg-cyan-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                    Add user
                </button>)}
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="mx-4  h-5/6 overflow-hidden overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block border-2 border-cyan-100  min-w-full p-0 overflow-y-auto max-h-80 sm:max-h-96 scrollbar align-middle">
                   {
                    
                    isFetching ? <TableLoading /> :
                    people.length > 0 ? <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-cyan-600 sticky left-0 p-0 m-0 top-0 z-10">
                        <tr>
                            {
                                headers.map((item, idx) => {
                                    return (
                                        <th scope="col" key={idx} className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-2 ${item === "id" ? 'hidden' : ""}`}>
                                            {item}
                                        </th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedUsers.map((person) => (
                        <tr key={person.id} >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-2">
                            {`${person.firstName} ${person.lastName}`}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{person.email}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{person.phoneNumber}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{person.role}</td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-0 space-x-3">
                                <button onClick={() => {
                                    setUser(person)
                                    toggleModal();
                                }} className="text-cyan-600 hover:text-cyan-900">
                                    Edit<span className="sr-only">, {person.firstName}</span>
                                </button>
                                <button onClick={() => {
                                    setUser(person)
                                    toggleConfirmation()
                                }} className="text-cyan-600 hover:text-cyan-900">
                                    Delete<span className="sr-only">, {person.firstName}</span>
                                </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                    : <EmptyStates name={"user"} toggleModal={()=>toggleModal()} />    
                }
                </div>
                </div>
            </div>
            
            <TablePagination 
                handleItemsPerPageChange={(number) => handleItemsPerPageChange(number)}
                handlePrevious={()=> handlePageChange(currentPage - 1)}
                handleNext={()=> handlePageChange(currentPage + 1)}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                totalNumber={people.length}
            />
        </div>
        <UserFormModal />
        { open && <ConfirmationDelete handleConfirm={()=>{
            handleDelete(selectedUser?.id || "")
        }}/>}
        </Wrapper>
    )
}

export default Users;