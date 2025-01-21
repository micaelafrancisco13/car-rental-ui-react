import { create } from 'zustand';
import { IUsersDetails } from '../interfaces/shared';

interface UserStore {
  users: IUsersDetails[];
  user: IUsersDetails | null;
  me: IUsersDetails | null;
  currentPage: number;
  itemsPerPage: number;
  paginated: IUsersDetails[];

  setUsers: (user: IUsersDetails[]) => void;
  setUser: (user: IUsersDetails | null) => void;
  setMe: (me: IUsersDetails) => void;
  addUser: (user: IUsersDetails) => void;
  addUsers: (users: IUsersDetails[]) => void;
  updateUser: (id: string, updatedUser: Partial<IUsersDetails>) => void; // Partial allows updating only some fields
  removeUser: (id: string) => void;

  setPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  getPaginatedUsers: () => IUsersDetails[];
  setPaginatedUsers: () => void
}

const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  user: null,
  me: null,
  currentPage: 1,
  itemsPerPage: 10,
  paginated: [],

  setUsers: (users) => set(() => ({ users })),
  setUser: (user) => set(() => ({ user })),
  setMe: (me) => set(() => ({ me })),
  addUser: (user) => set((state) => ({
    users: [...state.users, user],
  })),
  addUsers: (users) => set((state) => ({
    users: [...state.users, ...users],
  })),
  
  updateUser: (id, updatedUser) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...updatedUser } : user
      ),
    })),
  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),

    setPage: (page) => set(() => ({ currentPage: page })),
    setItemsPerPage: (itemsPerPage) => set(() => ({ itemsPerPage })),
    
    getPaginatedUsers: () => {
      const { users, currentPage, itemsPerPage } = get();
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      return users.slice(startIndex, endIndex);
    },
    
    setPaginatedUsers: () => {
      set(() => ({ paginated: get().getPaginatedUsers() }));
    },

}));

export default useUserStore;
