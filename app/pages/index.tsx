import Head from "next/head";
import NewResolutionForm from "../components/new-resolution-form";
import { useAccount, useConnect, useEnsName } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const Home = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <>
      <Head>
        <title>WAGMI - Home</title>
        <meta name="description" content="WAGMI" />
      </Head>
      <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          <header>
            <h1 className="text-3xl font-semibold space-y-3">
              <span className="block">🥇 Achieve your goals.</span>
              <span className="block">🤗 Support awesome devs.</span>
            </h1>
            <div>Test: { address }</div>
          </header>
          <main className="pt-10">
            <NewResolutionForm />
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
