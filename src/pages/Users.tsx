import EmptyStates from "../components/feedback/EmptyState";
import TableLoading from "../components/loaders/TableLoading";
import useUserStore from "../stores/useUsers";
import useGetUsers from "../hooks/user/useGetUsers";
import Wrapper from "../layouts/Wrapper";
import { useModalStore } from "../stores/useGlobal";

const Users = () => {
	const { isFetching } = useGetUsers()
    const people = useUserStore((state) => state.users)
    const { toggleModal } = useModalStore();
    const headers: string[] = ["id","Name", "Email", "Phone Number", "Role", "Action"]

    return (
        <Wrapper currentTab={"users"}>
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                <h1 className="text-base font-semibold text-gray-900">Users</h1>
                <p className="mt-2 text-sm text-gray-700">
                    A list of all the users in your account including their name, title, email and role.
                </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                { people.length > 0 && (<button
                    type="button"
                    className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Add user
                </button>)}
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                   {
                    
                    isFetching ? <TableLoading /> :
                    people.length > 0 ? <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                        <tr>
                            {
                                headers.map((item, idx) => {
                                    return (
                                        <th scope="col" key={idx} className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 ${item === "id" ? 'hidden' : ""}`}>
                                            {item}
                                        </th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {people.map((person) => (
                        <tr key={person.id} >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
                            {`${person.firstName} ${person.lastName}`}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{person.email}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{person.phoneNumber}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{person.role}</td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-0 space-x-3">
                                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                    Edit<span className="sr-only">, {person.firstName}</span>
                                </a>
                                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                    Delete<span className="sr-only">, {person.firstName}</span>
                                </a>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                    : <EmptyStates name={"user"} />    
                }
                </div>
                </div>
            </div>
        </div>
        </Wrapper>
    )
}

export default Users;