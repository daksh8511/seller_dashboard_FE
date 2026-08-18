import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface DeleteBoxType {
  deleteProductId: string | null;
  setDeleteProductId: React.Dispatch<React.SetStateAction<string | null>>;
  handleDelete: (id: string) => void;
  deleteLoading: boolean;
}

const DeleteBox = ({
  deleteProductId,
  setDeleteProductId,
  handleDelete,
  deleteLoading
}: DeleteBoxType) => {
  return (
    <AlertDialog
      open={!!deleteProductId}
      onOpenChange={(open) => {
        if (!open) {
          setDeleteProductId(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this product?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            product from your catalog.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className={'bg-black px-3'}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            className="bg-transparent hover:!bg-red-700 !text-red-600 hover:!text-white"
            onClick={() => {
              if (deleteProductId) {
                handleDelete(deleteProductId);
                setDeleteProductId(null);
              }
            }}
          >
            {deleteLoading && <Loader2 />}Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBox;