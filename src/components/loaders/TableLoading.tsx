const TableLoading = () => {
    return (
        <>
            <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center z-10">
                <div className="animate-spin rounded-full border-t-4 border-blue-500 w-12 h-12"></div>
            </div>
        </>
    )
}

export default TableLoading