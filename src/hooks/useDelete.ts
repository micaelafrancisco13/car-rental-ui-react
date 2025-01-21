import {useMutationDelete, useMutationDeleteQuery} from "./useMutationDelete"; 

const useDeleteUser = () => { 
    return useMutationDelete<string>("/users"); 
}; 

const useDeleteVehicle = () => {
    return useMutationDeleteQuery<string>("/vehicles")
}

export {
    useDeleteUser,
    useDeleteVehicle
};