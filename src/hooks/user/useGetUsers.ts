import { AxiosRequestConfig } from "axios";
import useUserStore from "../../stores/useUsers";
import { IUsersDetails } from "../../interfaces/shared";
import apiClient from "../../services/api-client";
import { useQuery } from "@tanstack/react-query";

const useGetUsers = () => {
  const endpoint = "/users";
  const queryKey = ["users"];
  const requestConfig: AxiosRequestConfig = {
    headers: {
      Authorization: `${localStorage.getItem("authToken")}`,
    },
  };

  const setUsers = useUserStore((state) => state.setUsers);
  return useQuery({queryKey, 
	queryFn: async () => {
    const { data } = await apiClient.get<IUsersDetails[]>(endpoint, requestConfig);
    setUsers(data);
  }});
};

const useGetMe = () => {
  const endpoint = "/users/me";
  const queryKey = ["me"];
  const requestConfig: AxiosRequestConfig = {
    headers: {
      Authorization: `${localStorage.getItem("authToken")}`,
    },
  };

  const setMe = useUserStore((state) => state.setMe);
  return useQuery({queryKey, 
	queryFn: async () => {
    const { data } = await apiClient.get<IUsersDetails>(endpoint, requestConfig);
    setMe(data);
  }});
};

export {
  useGetUsers,
  useGetMe,
}
