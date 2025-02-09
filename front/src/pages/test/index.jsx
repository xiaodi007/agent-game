import {
  ConnectButton,
  useCurrentAccount,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
// import { CreateCounter } from "../../CreateCounter";
// import { Counter } from "../../Counter";

// import "./App.css";

function App() {
  function ConnectedAccount() {
    const account = useCurrentAccount();

    if (!account) {
      return null;
    }

    return (
      <div>
        <div>Connected to {account.address}</div>;
        <OwnedObjects address={account.address} />
      </div>
    );
  }

  function OwnedObjects({ address }) {
    const { data } = useSuiClientQuery("getOwnedObjects", {
      owner: address,
    });
    if (!data) {
      return null;
    }

    return (
      <ul>
        {data.data.map((object) => (
          <li key={object.data?.objectId}>
            <a href={`https://suiexplorer.com/object/${object.data?.objectId}`}>
              {object.data?.objectId}
            </a>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <>
     
      <ConnectButton />

      <ConnectedAccount />

      {/* <Counter id={'0x9fbfa0d3d09bd3d4da36e446a5fd5113b57e00aa8f3bf4613b591997e963e11f'} />
      <CreateCounter
        onCreated={(id) => {
          window.location.hash = id;
        }}
      /> */}
    </>
  );
}

export default App;
