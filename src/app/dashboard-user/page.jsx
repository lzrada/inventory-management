import Layout from "../components/Layout";
import Dashboard from "../dashboard/page";

const Page = () => {
  return (
    <div className="flex">
      <Dashboard />
      <Layout tittle={"Dashboard User"} />
    </div>
  );
};
export default Page;
