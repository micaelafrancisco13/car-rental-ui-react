import { FC } from "react";

interface ITablePagination {
    handleNext: () => void
    handlePrevious: () => void
    handleItemsPerPageChange: (value: number) => void
    itemsPerPage: number
    totalNumber: number
    currentPage: number
    isGrid?: boolean
}

const TablePagination: FC<ITablePagination> = ({
    handleNext,
    handlePrevious,
    handleItemsPerPageChange,
    itemsPerPage,
    totalNumber,
    currentPage,
    isGrid = false,
}) => {
    return (
        <nav
            aria-label="Pagination"
            className="flex flex-grow items-center fixed bottom-0 left-0 right-0 bg-gray px-4 py-2 sm:py-3 sm:px-6"
        >
            <div className="hidden sm:block">
                <span className="relative inline-flex items-center text-black mr-3 text-sm text-gray-700">
                    {
                        !isGrid &&
                        (<label>
                            {` Items per page:`}
                            <select onChange={(e) => handleItemsPerPageChange(Number(e.target.value))} value={itemsPerPage}>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </select>
                        </label>)
                    }
                </span>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end">
                {(currentPage > 1) && (<button
                    onClick={handlePrevious}
                    className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                >
                    Previous
                </button>)}
                {(currentPage * itemsPerPage) <= totalNumber && (<button
                    onClick={handleNext}
                    className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                >
                    Next
                </button>)}
            </div>
        </nav>
    )
}

export default TablePagination;