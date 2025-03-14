import { Button, Dialog } from "@headlessui/react";

interface ITermsModal {
    isOpen: boolean;
    setIsOpen: () => void
}

const TermsModal:React.FC<ITermsModal> = ({
    isOpen, setIsOpen
}) => {

  return (
    <>
      <Dialog open={isOpen} onClose={() => setIsOpen()} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        <div className="text-gray-900 relative bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full">
          <Dialog.Title className="text-xl font-semibold">Terms and Conditions</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600">
          By checking the box below and proceeding with the booking, you agree to the following Terms and Conditions. Please read them carefully.
          </Dialog.Description>
          <div className="mt-4 max-h-60 overflow-y-auto border p-2 rounded-md text-sm text-gray-800">
            <p>1. The renter must be at least [18] years old and hold a valid driver's license. The rental period begins and ends on the agreed-upon dates, and any late returns may result in additional charges</p>
            <p>2. The renter is responsible for any damages, fines, or penalties incurred during the rental period unless covered by insurance. Full payment must be completed before the vehicle is picked up.</p>
            <p>3. The rental vehicle must not be used for illegal activities, racing, or off-road driving.</p>
            <p>4. In the event of a breakdown or accident, the renter must notify the company immediately and follow the provided procedures. The rental company reserves the right to terminate the rental agreement if any of the terms are violated.</p>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button onClick={() => setIsOpen()}>Close</Button>
            {/* <Button onClick={() => setIsOpen(false)}>Accept</Button> */}
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default TermsModal;
