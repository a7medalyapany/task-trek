import Avatar from "./Avatar";
import Image from "next/image";
import SearchAndFilter from "./SearchAndFilter";
import { createClient } from "@/lib/supabase/server";

export default async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Image
          src="/tasktrek-logo.png"
          alt="TaskTrek Logo"
          width={40}
          height={40}
          className="mr-4"
        />
        <SearchAndFilter />
        <Avatar
          avatarUrl={user?.user_metadata.avatar_url as string}
          name={user?.user_metadata.name as string}
          email={user?.email as string}
        />
      </div>
    </nav>
  );
}
