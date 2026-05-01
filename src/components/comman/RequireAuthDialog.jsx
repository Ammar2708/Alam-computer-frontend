import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LockKeyhole, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginRequiredDialog from "@/components/shoppping-view/LoginRequiredDialog";

function RequireAuthDialog({
  children,
  title = "Login Required",
  description = "Please login to continue.",
}) {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setOpenLoginDialog(true);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <section className="flex min-h-[55vh] items-center justify-center bg-red-50 px-4">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-red-600">
          Checking login...
        </p>
      </section>
    );
  }

  if (isAuthenticated) {
    return children;
  }

  return (
    <section className="min-h-[65vh] bg-gradient-to-b from-red-600 via-red-600 to-red-50 px-4 py-12 md:px-8">
      <div className="mx-auto max-w-3xl rounded-[30px] border border-red-100 bg-white p-8 text-center shadow-[0_24px_70px_rgba(153,27,27,0.22)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <LockKeyhole className="h-8 w-8" />
        </div>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.24em] text-red-500">
          Authentication Required
        </p>
        <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-gray-500">
          {description}
        </p>
        <Button
          onClick={() => setOpenLoginDialog(true)}
          className="mt-6 h-11 rounded-xl bg-red-600 px-6 text-sm font-black uppercase tracking-[0.16em] text-white hover:bg-red-700"
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Login To Continue
        </Button>
      </div>

      <LoginRequiredDialog
        open={openLoginDialog}
        onOpenChange={setOpenLoginDialog}
        title={title}
        description={description}
      />
    </section>
  );
}

export default RequireAuthDialog;
