import { Loader2Icon } from 'lucide-react'

const Loading = () => {
  return (
    <div className="flex items-center justify-center py-20 w-full">
      <Loader2Icon className="animate-spin text-app-green w-10 h-10" />
    </div>
  );
};

export default Loading;