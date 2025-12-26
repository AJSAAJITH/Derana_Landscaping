import { SignOutButton, UserButton } from "@clerk/nextjs";
import CreateSupervisorButton from "./components/createSupervisorButton";
import GenerateToken from "./components/genarateToken";


export default function Home() {
  return (
    <div className="">
      main page
      <SignOutButton>
        <UserButton />
      </SignOutButton>
    </div>
  );
}
