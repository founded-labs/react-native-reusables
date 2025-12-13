import * as React from 'react';
import { Progress } from '@/registry/nativewind/components/ui/progress';

export function ProgressPreview() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return <Progress value={progress} className="w-3/4 md:w-[60%]" />;
}
