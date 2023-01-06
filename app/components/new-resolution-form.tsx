import { useEffect, useState, FormEvent } from "react";
import { useConnect, useDisconnect, useAccount, useContractWrite, useContractRead } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { usePrepareContractWrite } from "wagmi";
import { ethers } from "ethers";
import ContractJSON from "../lib/contract.json";

const NewResolutionForm = ({refetch}) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [formData, setFormData] = useState({
    goal: "Test",
    arbiter: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    beneficiary: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    depositAmount: ethers.utils.parseEther('0.00001'),
  });
  const { connect, isLoading } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { address, connector, isConnected } = useAccount();
  const { config, error } = usePrepareContractWrite({
    address: ContractJSON.address,
    abi: ContractJSON.abi,
    functionName: "createEscrow",
    args: [formData.goal, formData.arbiter, formData.beneficiary],
    overrides: {
      value: formData.depositAmount,
    },
  });
  const { write } = useContractWrite({
    ...config,
    onSuccess(data) {
      console.log("Goal created: ", data);
      refetch();
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isConnected) {
      connect();
    }
    if (write) {
      write();
    }
  };

  const handleFormChange = (event: FormEvent) => {
    setFormData({
      ...formData,
      [event.currentTarget.id]: event.currentTarget.value,
    });
  };

  // To prevent hydration errors:
  // https://codingwithmanny.medium.com/understanding-hydration-errors-in-nextjs-13-with-a-web3-wallet-connection-8155c340fbd5
  // https://www.joshwcomeau.com/react/the-perils-of-rehydration/#the-solution
  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
    }
  }, [hasMounted]);
  if (!hasMounted) return null;

  return (
    <div className="text-sm">
      <div className="bg-white p-8 shadow rounded-lg md:rounded-2xl">
        <form className="space-y-7" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="goal" className="block text-gray-900">
              <span className="block">Goal</span>
            </label>
            <div className="mt-1">
              <input
                id="goal"
                name="goal"
                type="text"
                value={formData.goal}
                onChange={handleFormChange}
                className="text-base block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="Run a marathon"
              ></input>
            </div>
          </div>
          <div>
            <label htmlFor="arbiter" className="block text-gray-900">
              <span className="block">Arbiter address</span>
            </label>
            <div className="mt-1">
              <input
                id="arbiter"
                name="arbiter"
                type="text"
                value={formData.arbiter}
                onChange={handleFormChange}
                className="text-base block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="PLW3.eth"
              ></input>
            </div>
          </div>
          <div>
            <label htmlFor="beneficiary" className="block text-gray-900">
              <span className="block">Beneficiary address</span>
            </label>
            <div className="mt-1">
              <input
                id="beneficiary"
                name="beneficiary"
                type="text"
                value={formData.beneficiary}
                onChange={handleFormChange}
                className="text-base block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
              ></input>
            </div>
          </div>
          <div>
            <label htmlFor="depositAmount" className="block text-gray-900">
              <span className="block">Deposit amount (Wei)</span>
            </label>
            <div className="mt-1">
              <input
                id="depositAmount"
                name="depositAmount"
                type="text"
                value={formData.depositAmount}
                onChange={handleFormChange}
                className="text-base block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="0.01"
              ></input>
            </div>
          </div>
          <div className="space-x-2">
            <button
              type="submit"
              disabled={isLoading}
              className={
                isLoading
                  ? "inline-flex justify-center rounded-md border border-transparent bg-indigo-200 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2"
                  : "inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2"
              }
            >
              {isLoading ? "Connecting..." : isConnected ? "Set goal" : "Connect wallet"}
            </button>
            {isConnected && (
              <button
                type="button"
                onClick={() => disconnect()}
                className="inline-flex justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-500 active:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-2"
              >
                Disconnect
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewResolutionForm;
