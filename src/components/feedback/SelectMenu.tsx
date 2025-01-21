import { FC } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'


interface ISelectMenu {
    title: string;
    options: any;
    handleFilter: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    defaultValue: string
}

const SelectMenu:FC<ISelectMenu> = ({
    title, 
    options, 
    handleFilter,
    defaultValue,
}) => {

  return (
    <div>
      <label htmlFor="location" className="block text-sm/6 font-medium text-gray-900">
        { title }
      </label>
      <div className="grid grid-cols-1">
        <select
          id={title}
          name={title}
          defaultValue={defaultValue}
          onChange={handleFilter}
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        >
            {
                options.map((item: string) => <option value={item}>{`${item ? item : "All"}`}</option>)
            }
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
        />
      </div>
    </div>
  )
}

export default SelectMenu;